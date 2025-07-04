import { supabase } from "../../../lib/supabase";
import { MusicianFormData, MusicianProfile } from "./types";

/**
 * Checks if a musician profile exists for the given user email
 * @param email User email to check
 * @returns Object containing profile data or error
 */
export const checkExistingMusicianProfile = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking musician profile:", error);
      return { data: null, error: "Failed to check profile. Please try again." };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error checking musician profile:", err);
    return { data: null, error: "Failed to check profile. Please try again." };
  }
};

/**
 * Fetches a musician profile by user email
 * @param email User email to fetch profile for
 * @returns Object containing profile data or error
 */
export const fetchMusicianProfile = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('musicians')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error("Error loading musician data:", error);
      return { data: null, error: "Failed to load profile. Please try again." };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error in data fetching:", err);
    return { data: null, error: "An unexpected error occurred" };
  }
};

/**
 * Creates a new musician profile in the database
 * @param formData Form data from the profile form
 * @param userId User ID to associate with the profile
 * @returns Object containing result or error
 */
export const createMusicianProfile = async (formData: MusicianFormData, userId: string) => {
  try {
    // Prepare the create data
    const createData = {
      stage_name: formData.stageName || "",
      bio: formData.bio || "",
      genre: formData.genre || "",
      genres: Array.isArray(formData.genres) ? formData.genres : [],
      instruments: Array.isArray(formData.instruments) ? formData.instruments : 
                  typeof formData.instruments === 'string' ? formData.instruments.split(',').map(i => i.trim()) : [],
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      phone: formData.phone || "",
      website: formData.website && formData.website.trim() ? formData.website.trim() : null,
      experience: formData.experience || "",
      years_experience: parseInt(formData.yearsExperience as string) || 0,
      hourly_rate: parseFloat(formData.hourlyRate as string) || 0,
      email: formData.email,
      profile_picture: formData.profilePicture && formData.profilePicture.trim() ? formData.profilePicture.trim() : null,
      audio_files: formData.audioFiles || [],
      social_links: formData.socialLinks || [],
      additional_pictures: formData.additionalPictures || [],
      user_id: userId,
      is_active: true,
      is_verified: false,
      rating: 0,
      total_gigs: 0,
    };

    // Create the musician profile
    const { data: createResult, error: createError } = await supabase
      .from('musicians')
      .insert([createData])
      .select();

    if (createError) {
      console.error("Musician create error:", createError);
      return { data: null, error: createError };
    }

    // Update the user profile (first_name, last_name, email)
    const userUpdateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    };
    
    const { error: userUpdateError } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', userId);

    if (userUpdateError) {
      console.error("User update error:", userUpdateError);
      return { data: createResult, error: userUpdateError };
    }

    return { data: createResult, error: null };
  } catch (err) {
    console.error("Error creating profile:", err);
    return { data: null, error: err };
  }
};

/**
 * Updates an existing musician profile
 * @param formData Form data from the profile form
 * @param profileId ID of the musician profile to update
 * @param userId User ID associated with the profile
 * @returns Object containing result or error
 */
export const updateMusicianProfile = async (formData: MusicianFormData, profileId: string, userId: string) => {
  try {
    // Prepare the update data
    const updateData = {
      stage_name: formData.stageName || "",
      bio: formData.bio || "",
      genre: formData.genre || "",
      genres: Array.isArray(formData.genres) ? formData.genres : [],
      instruments: Array.isArray(formData.instruments) ? formData.instruments : 
                  typeof formData.instruments === 'string' ? formData.instruments.split(',').map(i => i.trim()) : [],
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      phone: formData.phone || "",
      website: formData.website && formData.website.trim() ? formData.website.trim() : null,
      experience: formData.experience || "",
      years_experience: parseInt(formData.yearsExperience as string) || 0,
      hourly_rate: parseFloat(formData.hourlyRate as string) || 0,
      email: formData.email,
      profile_picture: formData.profilePicture && formData.profilePicture.trim() ? formData.profilePicture.trim() : null,
      audio_files: formData.audioFiles || [],
      social_links: formData.socialLinks || [],
      additional_pictures: formData.additionalPictures || [],
    };

    // Update the musician profile
    const { error: updateError } = await supabase
      .from('musicians')
      .update(updateData)
      .eq('id', profileId);

    if (updateError) {
      console.error("Musician update error:", updateError);
      return { data: null, error: updateError };
    }

    // Update the user profile (first_name, last_name, email)
    const userUpdateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    };
    
    const { error: userUpdateError } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', userId);

    if (userUpdateError) {
      console.error("User update error:", userUpdateError);
      return { data: null, error: userUpdateError };
    }

    return { data: true, error: null };
  } catch (err) {
    console.error("Error updating profile:", err);
    return { data: null, error: err };
  }
}; 