import { supabase } from "../../../lib/supabase";
import { Musician, Event, InvitationData } from "./types";

/**
 * Fetch all musicians from the database
 * @returns Promise with musicians data or error
 */
export const fetchMusicians = async (): Promise<{ data: Musician[] | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('musicians')
      .select(`
        id,
        stage_name,
        genres,
        availability,
        email,
        phone,
        city,
        state,
        bio,
        hourly_rate,
        profile_picture
      `)
      .limit(100);

    if (error) {
      console.error("Error fetching musicians:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching musicians:", err);
    return { data: null, error: err };
  }
};

/**
 * Fetch events for a specific venue
 * @param venueId The ID of the venue
 * @returns Promise with events data or error
 */
export const fetchVenueEvents = async (venueId: string): Promise<{ data: Event[] | null, error: any }> => {
  try {
    if (!venueId) return { data: null, error: "No venue ID provided" };
    
    const { data: rawData, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        date,
        start_time,
        end_time,
        genres,
        venue:venues(
          id,
          name
        )
      `)
      .eq('venue_id', venueId)
      .eq('status', 'invited');

    if (error) {
      console.error("Error fetching venue events:", error);
      return { data: null, error };
    }

    // Transform the data to match the Event interface
    const data = rawData?.map(event => ({
      ...event,
      venue: {
        id: event.venue[0]?.id || '',
        name: event.venue[0]?.name || ''
      }
    })) as Event[];

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching venue events:", err);
    return { data: null, error: err };
  }
};

/**
 * Create booking invitations for musicians to events
 * @param invitations Array of invitation data objects
 * @returns Promise with result or error
 */
export const createBookingInvitations = async (invitations: InvitationData[]): Promise<{ data: any, error: any }> => {
  try {
    if (!invitations || invitations.length === 0) {
      return { data: null, error: "No invitations to create" };
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(invitations);

    if (error) {
      console.error("Error creating booking invitations:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error creating booking invitations:", err);
    return { data: null, error: err };
  }
};

/**
 * Filter musicians based on search term and genre filters
 * @param musicians Array of musicians to filter
 * @param searchTerm Search term to filter by
 * @param genreFilter Array of genres to filter by
 * @returns Filtered array of musicians
 */
export const filterMusicians = (
  musicians: Musician[],
  searchTerm: string,
  genreFilter: string[]
): Musician[] => {
  return musicians.filter(musician => {
    const matchesSearch = musician.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        musician.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        musician.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        musician.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = genreFilter.length === 0 || 
                       genreFilter.some(genre => 
                           musician.genres?.some(musicianGenre => 
                               musicianGenre.toLowerCase().includes(genre.toLowerCase())
                           )
                       );
    
    return matchesSearch && matchesGenre;
  });
}; 