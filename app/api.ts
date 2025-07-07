// Sets up the API client for interacting with your backend.
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log("Environment Variables Debug:");
console.log("VITE_SUPABASE_URL:", supabaseUrl);
console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "SET" : "NOT SET");
console.log("Using URL:", supabaseUrl);
console.log("Using Key length:", supabaseAnonKey?.length);

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export API object for compatibility with previous Gadget code
export const api = {
  user: {
    update: async (data: any) => {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          user_type: data.userType
        })
        .eq('id', data.id);
      
      if (error) throw error;
      return { id: data.id };
    },
    findOne: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
        userType: data.user_type,
      };
    }
  },
  musician: {
    create: async (data: any) => {
      const { data: musician, error } = await supabase
        .from('musicians')
        .insert([
          {
            user_id: data.user?._link,
            stage_name: data.stageName,
            email: data.email,
            genres: data.genres || []
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return musician;
    },
    findOne: async (id: string) => {
      const { data, error } = await supabase
        .from('musicians')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    findMany: async (options: any = {}) => {
      let query = supabase.from('musicians').select('*');
      
      if (options.filter) {
        // Handle filters if needed
        // This is a simplified version
        const filters = options.filter;
        if (filters.id?.equals) {
          query = query.eq('id', filters.id.equals);
        }
        if (filters.user?.id?.equals) {
          query = query.eq('user_id', filters.user.id.equals);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  },
  venue: {
    create: async (data: any) => {
      const { data: venue, error } = await supabase
        .from('venues')
        .insert([
          {
            owner_id: data.owner?._link,
            name: data.name,
            email: data.email
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return venue;
    },
    findMany: async (options: any = {}) => {
      let query = supabase.from('venues').select('*');
      
      if (options.filter) {
        // Handle filters if needed
        const filters = options.filter;
        if (filters.owner?.id?.equals) {
          query = query.eq('owner_id', filters.owner.id.equals);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  },
  booking: {
    findMany: async (options: any = {}) => {
      let query = supabase.from('bookings').select('*');
      
      if (options.filter) {
        // Handle filters if needed
        // This is a simplified version
        const filters = options.filter;
        if (filters.musician?.id?.equals) {
          query = query.eq('musician_id', filters.musician.id.equals);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  },
  message: {
    findMany: async (options: any = {}) => {
      let query = supabase.from('messages').select('*');
      
      if (options.filter) {
        const filters = options.filter;
        if (filters.booking?.id?.equals) {
          // For booking-based messages, we need to find messages for the event associated with the booking
          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('event_id')
            .eq('id', filters.booking.id.equals)
            .single();
          
          if (bookingError) throw bookingError;
          if (booking?.event_id) {
            query = query.eq('event_id', booking.event_id);
          }
        }
        if (filters.isActive?.equals !== undefined) {
          query = query.eq('is_active', filters.isActive.equals);
        }
      }
      
      if (options.sort) {
        const sortField = options.sort.createdAt || options.sort.sent_date_time;
        if (sortField) {
          const ascending = sortField === "Ascending";
          query = query.order('sent_date_time', { ascending });
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    create: async (data: any) => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      
      // Determine recipient ID from the booking data
      let recipientId = null;
      if (data.recipient?.connect?.id) {
        recipientId = data.recipient.connect.id;
      }
      
      // Get booking details to determine event and roles
      let eventId = null;
      let senderRole = null;
      let recipientRole = null;
      
      if (data.booking?.connect?.id) {
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            event_id,
            event:events(
              venue:venues(owner_id)
            ),
            musician:musicians(user_id)
          `)
          .eq('id', data.booking.connect.id)
          .single();
        
        if (bookingError) throw bookingError;
        
        eventId = booking.event_id;
        
        // Handle the nested data structure properly
        const eventData = booking.event as any;
        const venueData = eventData?.venue as any;
        const musicianData = booking.musician as any;
        
        // Determine roles based on current user
        const isVenue = user.id === venueData?.owner_id;
        const isMusician = user.id === musicianData?.user_id;
        
        if (isVenue) {
          senderRole = 'venue';
          recipientRole = 'musician';
          recipientId = musicianData?.user_id;
        } else if (isMusician) {
          senderRole = 'musician';
          recipientRole = 'venue';
          recipientId = venueData?.owner_id;
        } else {
          throw new Error('User is not authorized for this booking');
        }
      }
      
      if (!eventId || !recipientId) {
        throw new Error('Could not determine event or recipient');
      }
      
      // Create the message
      const messageData = {
        event_id: eventId,
        sender_id: user.id,
        recipient_id: recipientId,
        sender_role: senderRole,
        recipient_role: recipientRole,
        message_category: data.messageCategory || 'general',
        content: data.content,
        attachments: data.attachments || [],
        read_status: false,
        sent_date_time: new Date().toISOString(),
        is_active: true
      };
      
      const { data: message, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();
      
      if (error) throw error;
      return message;
    }
  }
};

// Export a function to check API health
export const checkApiHealth = async () => {
  try {
    console.log("Checking API health...");
    
    // Try a simple API call to test connection
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error("API health check failed:", error);
      return false;
    }
    
    console.log("API health check successful:", data);
    return true;
  } catch (error: any) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Export a function to wait for authentication
export const waitForAuthentication = async (timeout = 5000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      console.log("Authentication detected after waiting");
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.error("Authentication timeout - API client not authenticated after", timeout, "ms");
  return false;
};

// Export a function to force reset the API client
export const forceResetApiClient = async () => {
  try {
    console.log("Force resetting API client...");
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Force clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log("API client reset complete");
    return true;
  } catch (error) {
    console.error("Error resetting API client:", error);
    return false;
  }
};