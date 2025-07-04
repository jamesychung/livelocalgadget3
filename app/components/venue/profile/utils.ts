import { supabase } from "../../../lib/supabase";
import { VenueFormData, VenueProfile } from "./types";

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

/**
 * Updates an existing venue profile
 * @param formData Form data from the venue edit form
 * @param venueId ID of the venue profile to update
 * @returns Object containing result or error
 */
export const updateVenueProfile = async (formData: VenueFormData, venueId: string) => {
  try {
    const updateData = {
      name: formData.name || "",
      description: formData.description || "",
      venue_type: formData.venue_type || "",
      capacity: parseInt(String(formData.capacity)) || 0,
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      address: formData.address || "",
      zip_code: formData.zip_code || "",
      phone: formData.phone || "",
      email: formData.email || "",
      website: formData.website && formData.website.trim() ? formData.website.trim() : null,
      price_range: formData.price_range || "",
      profile_picture: formData.profile_picture || "",
      additional_pictures: formData.additional_pictures || [],
      social_links: formData.social_links || [],
      amenities: formData.amenities || [],
      genres: formData.genres || [],
      contact_first_name: formData.contact_first_name || "",
      contact_last_name: formData.contact_last_name || "",
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', venueId)
      .select();

    if (error) {
      console.error("Venue update error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error updating venue profile:", err);
    return { data: null, error: err };
  }
}; 