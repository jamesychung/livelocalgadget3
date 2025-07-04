import { supabase } from "../../lib/supabase";
import { AccountSettings, MusicianProfile, VenueProfile } from "./types";

/**
 * Update user data in Supabase
 */
export const updateUserData = async (userId: string, data: {
  first_name: string;
  last_name: string;
  email: string;
}) => {
  return await supabase
    .from('users')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
};

/**
 * Update musician data in Supabase
 */
export const updateMusicianData = async (musicianId: string, data: {
  stage_name: string;
  phone: string;
  city: string;
  state: string;
  hourly_rate: number;
}) => {
  return await supabase
    .from('musicians')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', musicianId);
};

/**
 * Update venue data in Supabase
 */
export const updateVenueData = async (venueId: string, data: {
  name: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  capacity: number;
  price_range: string;
}) => {
  return await supabase
    .from('venues')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', venueId);
};

/**
 * Initialize account settings from user, musician, and venue data
 */
export const initializeAccountSettings = (
  user: any,
  musician: MusicianProfile | null,
  venue: VenueProfile | null
): AccountSettings => {
  return {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: musician?.phone || venue?.phone || '',
    city: musician?.city || venue?.city || '',
    state: musician?.state || venue?.state || '',
    // Musician-specific fields
    stageName: musician?.stage_name || '',
    hourlyRate: musician?.hourly_rate || 0,
    // Venue-specific fields
    venueName: venue?.name || '',
    venueEmail: venue?.email || '',
    venueWebsite: venue?.website || '',
    venueCapacity: venue?.capacity || 0,
    venuePriceRange: venue?.price_range || '',
  };
};

/**
 * Get default notification settings
 */
export const getDefaultNotificationSettings = () => {
  return {
    emailNotifications: true,
    // Musician-specific
    bookingRequests: true,
    bookingConfirmations: true,
    newReviews: true,
    // Venue-specific
    eventRequests: true,
    eventConfirmations: true,
    venueReviews: true,
    // Common
    marketingEmails: false,
  };
}; 