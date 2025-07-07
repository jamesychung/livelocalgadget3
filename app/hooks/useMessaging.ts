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
    owner_id: string;
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
  console.log('🎣 useMessaging hook called with user:', user?.email || 'No user');
  
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

        console.log('🏢 Venue profile fetch:', {
          authUserId: authUser.id,
          venueData,
          venueError: venueError?.message
        });

        if (!venueError && venueData) {
          console.log('✅ Venue profile loaded successfully:', venueData);
          setVenue(venueData);
          setMusician(null);
          return;
        }

        // If no venue found, try to fetch musician data
        const { data: musicianData, error: musicianError } = await supabase
          .from('musicians')
          .select('id, stage_name, email, profile_picture, user_id')
          .eq('email', authUser.email)
          .single();

        if (!musicianError && musicianData) {
          setMusician({ ...musicianData, user_id: authUser.id });
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

    // Robust messaging system with real-time + polling fallback
  useEffect(() => {
    // Wait for user profile to be loaded
    if (!isUserAuthenticated) {
      console.log('User not authenticated, skipping messaging setup');
      return;
    }

    if (!venue?.owner_id && !musician?.user_id) {
      console.log('No user profile loaded, skipping messaging setup');
      return;
    }

    const currentUserId = venue?.owner_id || musician?.user_id;

    let realTimeWorking = false;
    let lastMessageCheck = Date.now();

    // Set up real-time subscription
    console.log('🔌 Setting up real-time subscription for user:', currentUserId);
    
    const channel = supabase
      .channel('messages-' + currentUserId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('🔔 Real-time payload received:', payload);
          realTimeWorking = true;
          lastMessageCheck = Date.now();
          
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as MessageData;
            
            console.log('📨 Real-time message received:', {
              messageId: newMessage.id,
              senderId: newMessage.sender_id,
              recipientId: newMessage.recipient_id,
              currentUserId,
              senderRole: newMessage.sender_role,
              recipientRole: newMessage.recipient_role
            });
            
            // Check if this message is relevant to the current user
            const isRelevant = currentUserId === newMessage.recipient_id || 
                              currentUserId === newMessage.sender_id;
            
            console.log('🎯 Message relevance check:', {
              isRelevant,
              currentUserId,
              isRecipient: currentUserId === newMessage.recipient_id,
              isSender: currentUserId === newMessage.sender_id
            });
            
            if (isRelevant) {
              // Add new message to messages array
              setMessages(prev => {
                // Avoid duplicates
                if (prev.find(m => m.id === newMessage.id)) {
                  console.log('🔄 Real-time: Message already exists, skipping:', newMessage.id);
                  return prev;
                }
                console.log('✅ Real-time: Adding message to state:', {
                  messageId: newMessage.id,
                  isRecipient: currentUserId === newMessage.recipient_id,
                  isSender: currentUserId === newMessage.sender_id
                });
                return [...prev, newMessage];
              });
              
              // Update the specific event with the new message
              setEvents(prev => prev.map(event => {
                if (event.id === newMessage.event_id) {
                  const updatedMessages = [...(event.messages || [])];
                  
                  // Avoid duplicates
                  if (!updatedMessages.find(m => m.id === newMessage.id)) {
                    updatedMessages.push(newMessage);
                  }
                  
                  // Only increment unread count if the message is for the current user
                  const isForCurrentUser = newMessage.recipient_id === currentUserId;
                  
                  return {
                    ...event,
                    messages: updatedMessages,
                    unread_count: isForCurrentUser ? (event.unread_count || 0) + 1 : event.unread_count
                  };
                }
                return event;
              }));
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as MessageData;
            
            // Update message in messages array
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
            
            // Update message in events
            setEvents(prev => prev.map(event => ({
              ...event,
              messages: event.messages?.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            })));
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    // Robust polling fallback system
    const pollForNewMessages = async () => {
      console.log('🔄 Polling for new messages...', {
        currentUserId,
        isVenue: !!venue?.owner_id,
        isMusician: !!musician?.user_id,
        messagesCount: messages.length
      });
      try {
        // Check if real-time is working (if we received a message in last 30 seconds, assume it's working)
        const realtimeRecentlyWorked = Date.now() - lastMessageCheck < 30000;
        
        if (realtimeRecentlyWorked && realTimeWorking) {
          console.log('⚡ Real-time working, skipping poll');
          return;
        }
        
        // Get the latest message timestamp we have
        const latestMessageTime = messages.length > 0 
          ? Math.max(...messages.map(m => new Date(m.sent_date_time).getTime()))
          : Date.now() - 60000; // Last minute if no messages

        console.log('🔍 Polling query params:', {
          currentUserId,
          latestMessageTime: new Date(latestMessageTime).toISOString(),
          queryFilter: `or(sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId})`
        });

        // Fetch new messages since our latest - messages where user is sender OR recipient
        const { data: newMessages, error } = await supabase
          .from('messages')
          .select('*')
          .gte('sent_date_time', new Date(latestMessageTime).toISOString())
          .eq('is_active', true)
          .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
          .order('sent_date_time', { ascending: true });

        if (error) {
          console.error('Error polling for messages:', error);
          return;
        }

        if (newMessages && newMessages.length > 0) {
          console.log('📬 Found new messages via polling:', newMessages.length);
          newMessages.forEach(newMessage => {
            // Message is relevant if user is sender OR recipient
            const isRelevant = currentUserId === newMessage.recipient_id || 
                              currentUserId === newMessage.sender_id;
            
            console.log('🔍 Processing polled message:', {
              messageId: newMessage.id,
              senderId: newMessage.sender_id,
              recipientId: newMessage.recipient_id,
              currentUserId,
              isRelevant,
              readStatus: newMessage.read_status,
              isRecipient: currentUserId === newMessage.recipient_id,
              isSender: currentUserId === newMessage.sender_id,
              eventId: newMessage.event_id
            });
            
            if (isRelevant) {
              
              // Add to messages array (avoid duplicates)
              setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) {
                  console.log('⚠️ Polling: Message already exists, skipping:', newMessage.id);
                  return prev;
                }
                console.log('✅ Polling: Adding new message to state:', {
                  messageId: newMessage.id,
                  isRecipient: currentUserId === newMessage.recipient_id,
                  isSender: currentUserId === newMessage.sender_id,
                  readStatus: newMessage.read_status
                });
                return [...prev, newMessage];
              });
              
              // Update events
              setEvents(prev => {
                let wasUpdated = false;
                const newEvents = prev.map(event => {
                  if (event.id === newMessage.event_id) {
                    const updatedMessages = [...(event.messages || [])];
                    
                    if (!updatedMessages.find(m => m.id === newMessage.id)) {
                      updatedMessages.push(newMessage);
                      wasUpdated = true;
                    }
                    
                    const isForCurrentUser = newMessage.recipient_id === currentUserId;
                    
                    return {
                      ...event,
                      messages: updatedMessages,
                      unread_count: isForCurrentUser ? (event.unread_count || 0) + 1 : event.unread_count
                    };
                  }
                  return event;
                });
                
                if (wasUpdated) {
                  return newEvents;
                } else {
                  // Force a re-render by returning a new array reference
                  // This ensures React detects the change even if the message was already there
                  return [...prev];
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Poll every 3 seconds initially, then reduce frequency if real-time is working
    console.log('⏰ Starting polling every 3 seconds...');
    let pollInterval = setInterval(pollForNewMessages, 3000);

    // After 30 seconds, if real-time is working, reduce polling frequency
    const optimizePolling = setTimeout(() => {
      if (realTimeWorking) {
        clearInterval(pollInterval);
        pollInterval = setInterval(pollForNewMessages, 15000); // Poll every 15 seconds as backup
      }
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
      clearTimeout(optimizePolling);
    };
  }, [isUserAuthenticated, venue?.owner_id, musician?.user_id]);

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
              venue:venues(id, name, owner_id)
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
                created_at,
                venue:venues(id, name, owner_id)
              )
            `)
            .eq('musician_id', musician.id);

          if (bookingsError) {
            console.error("Error fetching musician bookings:", bookingsError);
            setError(bookingsError);
            return;
          }

          // Transform bookings to events format
          eventsData = bookingsData?.map(booking => {
            console.log('🔍 Raw booking data:', {
              bookingId: booking.id,
              eventId: (booking.event as any)?.id,
              eventTitle: (booking.event as any)?.title,
              venueData: (booking.event as any)?.venue,
              fullEvent: booking.event
            });
            
            return {
              ...booking.event,
              booking_id: booking.id,
              booking_status: booking.status,
              booking_rate: booking.proposed_rate,
              booking_pitch: booking.musician_pitch
            };
          }) || [];
          
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
              applied_at,
              selected_at,
              confirmed_at,
              cancel_requested_at,
              cancelled_at,
              completed_at,
              cancel_requested_by_role,
              cancel_confirmed_by_role,
              completed_by_role,
              cancellation_reason,
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
        console.log('🔍 Processing events data:', {
          totalEvents: eventsData?.length || 0,
          isMusician: !!musician?.user_id,
          isVenue: !!venue?.owner_id,
          musicianId: musician?.user_id,
          venueOwnerId: venue?.owner_id
        });
        
        const eventsWithData = eventsData?.map(event => {
          const eventBookings = bookingsData.filter(booking => booking.event_id === event.id);
          const eventMessages = messagesData.filter(message => message.event_id === event.id);
          

          
          // Count unread messages based on user type
          let unreadCount = 0;
          if (venue?.owner_id) {
            // For venues: count messages where venue owner is recipient
            unreadCount = eventMessages.filter(msg => 
              msg.recipient_id === venue.owner_id && !msg.read_status
            ).length;
          } else if (musician?.user_id) {
            // For musicians: count messages where musician is recipient
            unreadCount = eventMessages.filter(msg => 
              msg.recipient_id === musician.user_id && !msg.read_status
            ).length;
          }

          // Transform bookings to applications format
          const applications = eventBookings.map(booking => ({
            id: booking.id,
            status: booking.status,
            proposed_rate: booking.proposed_rate || 0,
            musician_pitch: booking.musician_pitch || '',
            musician: booking.musician,
            created_at: booking.created_at,
            applied_at: booking.applied_at,
            selected_at: booking.selected_at,
            confirmed_at: booking.confirmed_at,
            cancel_requested_at: booking.cancel_requested_at,
            cancelled_at: booking.cancelled_at,
            completed_at: booking.completed_at,
            cancel_requested_by_role: booking.cancel_requested_by_role,
            cancel_confirmed_by_role: booking.cancel_confirmed_by_role,
            completed_by_role: booking.completed_by_role,
            cancellation_reason: booking.cancellation_reason
          }));

          // Set musician for confirmed/selected events (primary musician)
          const confirmedBooking = eventBookings.find(booking => 
            booking.status === 'confirmed' || booking.status === 'selected'
          );

          // Also track all past musicians for messaging capability
          const allPastMusicians = eventBookings
            .filter(booking => booking.musician)
            .map(booking => booking.musician);

          const finalEvent = {
            ...event,
            applications,
            musician: confirmedBooking?.musician || null,
            allPastMusicians, // Include all past musicians for messaging capability
            messages: eventMessages,
            unread_count: unreadCount,
            status: event.event_status || event.booking_status, // Map to expected field name
            venue: Array.isArray(event.venue) ? event.venue[0] : event.venue
          } as EventWithMessaging;
          
          // Debug venue data for musicians
          if (musician?.user_id) {
            console.log('🎵 Event processing for musician:', {
              eventId: finalEvent.id,
              eventTitle: finalEvent.title,
              hasVenue: !!finalEvent.venue,
              venueData: finalEvent.venue,
              rawEventVenue: event.venue
            });
          }
          
          if (musician?.user_id && finalEvent.venue) {
            console.log('🎵 Event venue data for musician:', {
              eventId: finalEvent.id,
              eventTitle: finalEvent.title,
              venueId: finalEvent.venue.id,
              venueOwnerId: (finalEvent.venue as any).owner_id,
              venueName: finalEvent.venue.name,
              musicianUserId: musician.user_id,
              fullVenueData: finalEvent.venue,
              isOwnerIdSameAsMusician: (finalEvent.venue as any).owner_id === musician.user_id
            });
          }
          
          return finalEvent;
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
  }, [venue?.id, venue?.owner_id, musician?.id, musician?.user_id]);

  // Send a new message
  const sendMessage = async (messageData: {
    event_id: string;
    recipient_id: string;
    content: string;
    message_category: string;
    attachments?: any[];
  }) => {
    if (!venue?.owner_id && !musician?.user_id) {
      throw new Error("No authenticated user (venue or musician)");
    }

    try {
      const senderId = venue?.owner_id || musician?.user_id;
      const senderRole = venue?.owner_id ? 'venue' : 'musician';
      const recipientRole = venue?.owner_id ? 'musician' : 'venue';
      
      // CRITICAL FIX: Validate and correct recipient_id
      let finalRecipientId = messageData.recipient_id;
      
      // If recipient_id equals sender_id, this is a self-message bug - fix it
      if (finalRecipientId === senderId) {
        console.log('🚨 DETECTED SELF-MESSAGE BUG - FIXING:', {
          originalRecipientId: finalRecipientId,
          senderId,
          senderRole
        });
        
                 // Find the correct recipient based on the event
         const event = events.find(e => e.id === messageData.event_id);
         if (event?.venue?.owner_id && senderRole === 'musician') {
           // Musician sending to venue
           finalRecipientId = event.venue.owner_id;
           console.log('✅ Fixed recipient for musician->venue:', finalRecipientId);
         } else if (senderRole === 'venue') {
           // Venue sending to musician - need to find musician's user_id from applications or allPastMusicians
           const musicianUserId = event?.allPastMusicians?.find(m => m.user_id)?.user_id ||
                                 event?.applications?.find(app => app.musician)?.musician?.id;
           if (musicianUserId) {
             finalRecipientId = musicianUserId;
             console.log('✅ Fixed recipient for venue->musician:', finalRecipientId);
           } else {
             console.error('❌ Could not find musician user_id for venue message');
             throw new Error('Cannot determine musician recipient');
           }
         } else {
           console.error('❌ Could not determine correct recipient');
           throw new Error('Cannot determine message recipient');
         }
      }

      console.log('📤 Sending message:', {
        event_id: messageData.event_id,
        sender_id: senderId,
        recipient_id: finalRecipientId,
        original_recipient_id: messageData.recipient_id,
        sender_role: senderRole,
        recipient_role: recipientRole,
        content: messageData.content.substring(0, 50),
        venueOwnerId: venue?.owner_id,
        musicianUserId: musician?.user_id,
        wasFixed: finalRecipientId !== messageData.recipient_id
      });

      const messageToInsert = {
        event_id: messageData.event_id,
        sender_id: senderId,
        recipient_id: finalRecipientId,
        sender_role: senderRole,
        recipient_role: recipientRole,
        message_category: messageData.message_category,
        content: messageData.content,
        attachments: messageData.attachments || [],
        read_status: false,
        sent_date_time: new Date().toISOString()
      };
      
      console.log('💾 Inserting message into database:', messageToInsert);

      const { data, error } = await supabase
        .from('messages')
        .insert(messageToInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Message inserted successfully:', {
        messageId: data.id,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        sender_role: data.sender_role,
        recipient_role: data.recipient_role
      });

      // Add sent message to local state immediately for instant display
      const newMessage = {
        ...data,
        sender_role: senderRole,
        recipient_role: recipientRole
      } as MessageData;

      console.log('📨 Adding sent message to sender state:', {
        messageId: newMessage.id,
        senderId: newMessage.sender_id,
        recipientId: newMessage.recipient_id,
        readStatus: newMessage.read_status,
        currentUserId: senderId,
        shouldCountAsUnread: newMessage.recipient_id === senderId
      });

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
      .filter(msg => msg.recipient_id === venue?.owner_id || msg.recipient_id === musician?.user_id)
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
    const currentUserId = venue?.owner_id || musician?.user_id;
    const unreadMessages = messages.filter(msg => 
      msg.recipient_id === currentUserId && !msg.read_status
    );
    
    // Find any messages that might be incorrectly counted
    const suspiciousMessages = messages.filter(msg => 
      msg.sender_id === currentUserId && !msg.read_status
    );
    
    console.log('📊 getTotalUnreadCount called:', {
      currentUserId,
      userType: venue?.owner_id ? 'venue' : 'musician',
      venueOwnerId: venue?.owner_id,
      musicianUserId: musician?.user_id,
      totalMessages: messages.length,
      unreadMessages: unreadMessages.length,
      messagesForUser: messages.filter(m => m.recipient_id === currentUserId).length,
      messagesSentByUser: messages.filter(m => m.sender_id === currentUserId).length,
      suspiciousMessages: suspiciousMessages.length,
      suspiciousMessagesDebug: suspiciousMessages.map(m => ({
        id: m.id.substring(0, 8),
        senderId: m.sender_id,
        recipientId: m.recipient_id,
        read: m.read_status
      })),
      allMessagesDebug: messages.map(m => ({
        id: m.id.substring(0, 8),
        senderId: m.sender_id,
        recipientId: m.recipient_id,
        read: m.read_status,
        isForCurrentUser: m.recipient_id === currentUserId,
        isSentByCurrentUser: m.sender_id === currentUserId,
        category: m.message_category || 'unknown'
      }))
    });
    
    return unreadMessages.length;
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