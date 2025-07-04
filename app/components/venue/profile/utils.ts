import { supabase } from "../../../lib/supabase";
import { VenueProfile } from "./types";

/**
 * Creates a simple venue profile in the database
 * @param userId User ID to associate with the profile
 * @param email User email to associate with the profile
 * @returns Object containing result or error
 */
export const createSimpleVenueProfile = async (userId: string, email: string) => {
  try {
    // Create a simple venue profile
    const { data, error } = await supabase
      .from('venues')
      .insert({
        owner_id: userId,
        name: "My Venue",
        description: "A great venue for live music",
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Venue creation error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error creating venue profile:", err);
    return { data: null, error: err };
  }
};

/**
 * Fetches a venue profile by user email
 * @param email User email to fetch profile for
 * @returns Object containing profile data or error
 */
export const fetchVenueProfile = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error loading venue profile:", error);
      return { data: null, error: "Failed to load profile. Please try again." };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error in data fetching:", err);
    return { data: null, error: "An unexpected error occurred" };
  }
}; 