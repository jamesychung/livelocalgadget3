import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface MessageData {
  id: string;
  event_id: string;
  sender_id: string;
  recipient_id: string;
  sender_role: 'venue' | 'musician';
  recipient_role: 'venue' | 'musician';
  message_category: 'general' | 'pricing' | 'performance' | 'technical' | 'contract' | 'issue' | 'other';
  content: string;
  attachments: any[];
  thread_id: string;
  read_status: boolean;
  sent_date_time: string;
  created_at: string;
  sender?: {
    id: string;
    email: string;
    user_type: string;
  };
  recipient?: {
    id: string;
    email: string;
    user_type: string;
  };
}

export interface EventWithMessaging {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  event_status: string;
  status: string; // Mapped from event_status for compatibility
  booking_status?: string; // For musician view - status of their booking
  venue_id: string;
  venue?: {
    id: string;
    name: string;
  };
  musician?: {
    id: string;
    stage_name: string;
    profile_picture?: string;
  };
  allPastMusicians?: Array<{
    id: string;
    stage_name: string;
    profile_picture?: string;
    user_id: string;
  }>;
  applications?: Array<{
    id: string;
    status: string;
    proposed_rate: number;
    musician_pitch: string;
    musician: {
      id: string;
      stage_name: string;
      profile_picture?: string;
    };
  }>;
  messages?: MessageData[];
  unread_count?: number;
}

export function useMessaging(user: any) {
  const [events, setEvents] = useState<EventWithMessaging[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [venue, setVenue] = useState<any>(null);
  const [musician, setMusician] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Check if user is authenticated
  const isUserAuthenticated = !!user?.id;

  // Fetch venue or musician data based on user type
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isUserAuthenticated) return;

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        // Try to fetch venue data first
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('id, name, city, state, owner_id')
          .eq('owner_id', authUser.id)
          .single();

        if (!venueError && venueData) {
          setVenue(venueData);
          setMusician(null);
          return;
        }

        // If no venue found, try to fetch musician data
        const { data: musicianData, error: musicianError } = await supabase
          .from('musicians')
          .select('id, stage_name, email, profile_picture')
          .eq('email', authUser.email)
          .single();

        if (!musicianError && musicianData) {
          setMusician(musicianData);
          setVenue(null);
          return;
        }

        console.error("User has no venue or musician profile");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [isUserAuthenticated]);

  // Fetch events with bookings and messages
  useEffect(() => {
    const fetchEventsWithMessages = async () => {
      if (!venue?.id && !musician?.id) return;

      setLoading(true);
      setError(null);

      try {
        let eventsData: any[] = [];
        let eventIds: string[] = [];

        if (venue?.id) {
          // VENUE: Get all events for this venue
          const { data: venueEventsData, error: eventsError } = await supabase
            .from('events')
            .select(`
              id,
              title,
              description,
              date,
              start_time,
              end_time,
              event_status,
              venue_id,
              created_at,
              venue:venues(id, name)
            `)
            .eq('venue_id', venue.id)
            .order('date', { ascending: true });

          if (eventsError) {
            setError(eventsError);
            console.error("Error fetching venue events:", eventsError);
            return;
          }

          eventsData = venueEventsData || [];
          eventIds = eventsData.map(event => event.id);
        } else if (musician?.id) {
          // MUSICIAN: Get events through bookings
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              id,
              event_id,
              status,
              proposed_rate,
              musician_pitch,
              created_at,
              event:events!inner(
                id,
                title,
                description,
                date,
                start_time,
                end_time,
                event_status,
                venue_id,
                venue:venues(id, name)
              )
            `)
            .eq('musician_id', musician.id);

          if (bookingsError) {
            console.error("Error fetching musician bookings:", bookingsError);
            setError(bookingsError);
            return;
          }

          // Transform bookings to events format
          eventsData = bookingsData?.map(booking => ({
            ...booking.event,
            booking_id: booking.id,
            booking_status: booking.status,
            booking_rate: booking.proposed_rate,
            booking_pitch: booking.musician_pitch
          })) || [];
          
          eventIds = eventsData.map(event => event.id);
        }

        // Get all bookings for these events (for both venue and musician views)
        let bookingsData: any[] = [];
        if (eventIds.length > 0) {
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              id,
              event_id,
              status,
              proposed_rate,
              musician_pitch,
              musician_id,
              created_at,
              musician:musicians(id, stage_name, profile_picture, user_id)
            `)
            .in('event_id', eventIds);

          if (bookingsError) {
            console.error("Error fetching bookings:", bookingsError);
          } else {
            bookingsData = bookings || [];
          }
        }

        // Get all messages for these events
        let messagesData: any[] = [];
        if (eventIds.length > 0) {
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select(`
              id,
              event_id,
              sender_id,
              recipient_id,
              sender_role,
              recipient_role,
              message_category,
              content,
              attachments,
              thread_id,
              read_status,
              sent_date_time,
              created_at
            `)
            .in('event_id', eventIds)
            .eq('is_active', true)
            .order('sent_date_time', { ascending: true });

          if (messagesError) {
            console.error("Error fetching messages:", messagesError);
          } else {
            messagesData = messages || [];
          }
        }

        // Combine events with their bookings and messages
        const eventsWithData = eventsData?.map(event => {
          const eventBookings = bookingsData.filter(booking => booking.event_id === event.id);
          const eventMessages = messagesData.filter(message => message.event_id === event.id);
          
          // Count unread messages based on user type
          let unreadCount = 0;
          if (venue?.owner_id) {
            // For venues: count messages where venue is recipient
            unreadCount = eventMessages.filter(msg => 
              msg.recipient_role === 'venue' && !msg.read_status
            ).length;
          } else if (musician?.id) {
            // For musicians: count messages where musician is recipient
            unreadCount = eventMessages.filter(msg => 
              msg.recipient_id === musician.id && !msg.read_status
            ).length;
          }

          // Transform bookings to applications format
          const applications = eventBookings.map(booking => ({
            id: booking.id,
            status: booking.status,
            proposed_rate: booking.proposed_rate || 0,
            musician_pitch: booking.musician_pitch || '',
            musician: booking.musician
          }));

          // Set musician for confirmed/selected events (primary musician)
          const confirmedBooking = eventBookings.find(booking => 
            booking.status === 'confirmed' || booking.status === 'selected'
          );

          // Also track all past musicians for messaging capability
          const allPastMusicians = eventBookings
            .filter(booking => booking.musician)
            .map(booking => booking.musician);

          return {
            ...event,
            applications,
            musician: confirmedBooking?.musician || null,
            allPastMusicians, // Include all past musicians for messaging capability
            messages: eventMessages,
            unread_count: unreadCount,
            status: event.event_status || event.booking_status, // Map to expected field name
            venue: Array.isArray(event.venue) ? event.venue[0] : event.venue
          } as EventWithMessaging;
        }) || [];

        setEvents(eventsWithData);
        setMessages(messagesData as MessageData[]);
      } catch (error) {
        setError(error);
        console.error("Error fetching events with messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithMessages();
  }, [venue?.id, venue?.owner_id, musician?.id]);

  // Send a new message
  const sendMessage = async (messageData: {
    event_id: string;
    recipient_id: string;
    content: string;
    message_category: string;
    attachments?: any[];
  }) => {
    if (!venue?.owner_id && !musician?.id) {
      throw new Error("No authenticated user (venue or musician)");
    }

    try {
      const senderId = venue?.owner_id || musician?.id;
      const senderRole = venue?.owner_id ? 'venue' : 'musician';
      const recipientRole = venue?.owner_id ? 'musician' : 'venue';

      const { data, error } = await supabase
        .from('messages')
        .insert({
          event_id: messageData.event_id,
          sender_id: senderId,
          recipient_id: messageData.recipient_id,
          sender_role: senderRole,
          recipient_role: recipientRole,
          message_category: messageData.message_category,
          content: messageData.content,
          attachments: messageData.attachments || [],
          read_status: false,
          sent_date_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Immediately update local state with the new message
      const newMessage = {
        ...data,
        sender_role: senderRole,
        recipient_role: recipientRole
      } as MessageData;

      // Update messages array
      setMessages(prev => [...prev, newMessage]);

      // Update the specific event with the new message
      setEvents(prev => prev.map(event => {
        if (event.id === messageData.event_id) {
          const updatedMessages = [...(event.messages || []), newMessage];
          return {
            ...event,
            messages: updatedMessages
          };
        }
        return event;
      }));

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_status: true })
        .in('id', messageIds);

      if (error) {
        throw error;
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, read_status: true } : msg
      ));

      setEvents(prev => prev.map(event => ({
        ...event,
        messages: event.messages?.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, read_status: true } : msg
        ),
        unread_count: event.messages?.filter(msg => 
          !messageIds.includes(msg.id) && msg.recipient_id === venue?.owner_id && !msg.read_status
        ).length || 0
      })));
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  };

  // Get events with messages (for messages page)
  const getEventsWithMessages = () => {
    return events.filter(event => 
      event.messages && event.messages.length > 0
    );
  };

  // Get recent messages (for dashboard)
  const getRecentMessages = (limit = 5) => {
    const allMessages = messages
      .filter(msg => msg.recipient_id === venue?.owner_id || msg.recipient_id === musician?.id)
      .sort((a, b) => new Date(b.sent_date_time).getTime() - new Date(a.sent_date_time).getTime())
      .slice(0, limit);

    return allMessages.map(msg => {
      const event = events.find(e => e.id === msg.event_id);
      return {
        id: msg.id,
        content: msg.content,
        sent_date_time: msg.sent_date_time,
        sender_role: msg.sender_role,
        event: event ? {
          title: event.title,
          date: event.date,
          venue: {
            name: event.venue?.name || 'Unknown Venue'
          }
        } : {
          title: 'Unknown Event',
          date: '',
          venue: {
            name: 'Unknown Venue'
          }
        }
      };
    });
  };

  // Get total unread count
  const getTotalUnreadCount = () => {
    return messages.filter(msg => 
      (msg.recipient_id === venue?.owner_id || msg.recipient_id === musician?.id) && !msg.read_status
    ).length;
  };

  return {
    events,
    messages,
    venue,
    musician,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    getEventsWithMessages,
    getRecentMessages,
    getTotalUnreadCount
  };
} 