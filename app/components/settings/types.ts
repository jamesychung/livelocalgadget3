import { User } from "@supabase/supabase-js";

// User role types
export type UserRole = 'musician' | 'venue' | 'user';

// Musician profile data
export interface MusicianProfile {
  id: string;
  stage_name: string;
  phone: string;
  city: string;
  state: string;
  hourly_rate: number;
  years_experience?: number;
  genres?: string[];
  instruments?: string[];
  bio?: string;
  email?: string;
  website?: string;
  updated_at?: string;
}

// Venue profile data
export interface VenueProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  capacity: number;
  price_range: string;
  updated_at?: string;
}

// Account settings form data
export interface AccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  // Musician-specific fields
  stageName: string;
  hourlyRate: number;
  // Venue-specific fields
  venueName: string;
  venueEmail: string;
  venueWebsite: string;
  venueCapacity: number;
  venuePriceRange: string;
}

// Notification settings form data
export interface NotificationSettings {
  emailNotifications: boolean;
  // Musician-specific
  bookingRequests: boolean;
  bookingConfirmations: boolean;
  newReviews: boolean;
  // Venue-specific
  eventRequests: boolean;
  eventConfirmations: boolean;
  venueReviews: boolean;
  // Common
  marketingEmails: boolean;
}

// Props for account settings component
export interface AccountSettingsProps {
  user: User;
  musician: MusicianProfile | null;
  venue: VenueProfile | null;
  isLoading: boolean;
  onUpdate: (settings: AccountSettings) => Promise<void>;
}

// Props for notification settings component
export interface NotificationSettingsProps {
  userRole: UserRole;
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

// Props for security settings component
export interface SecuritySettingsProps {
  user: User;
}

// Status message type
export interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}