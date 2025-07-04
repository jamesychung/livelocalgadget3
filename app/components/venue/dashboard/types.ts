import { User } from "@supabase/supabase-js";

// Venue profile data
export interface VenueProfile {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  price_range?: string;
  profile_picture?: string;
  additional_pictures?: string[];
  rating?: number;
  total_events?: number;
  user_id: string;
}

// Booking data structure
export interface Booking {
  id: string;
  status: string;
  musician_id: string;
  event_id: string;
  venue_id: string;
  created_at: string;
  updated_at?: string;
  applied_at?: string;
  selected_at?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancel_requested_at?: string;
  cancel_requested_by?: string;
  cancel_confirmed_at?: string;
  cancel_confirmed_by?: string;
  cancellation_reason?: string;
  proposed_rate?: number;
  musician_pitch?: string;
  musician?: {
    id: string;
    stage_name: string;
    city?: string;
    state?: string;
    genre?: string;
    genres?: string[];
    profile_picture?: string;
    phone?: string;
    email?: string;
    hourly_rate?: number;
  };
  event?: {
    id: string;
    title: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    description?: string;
    created_at: string;
  };
  venue?: VenueProfile;
}

// Event data structure
export interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  venue_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  musician?: {
    id: string;
    stage_name: string;
    city?: string;
    state?: string;
    genre?: string;
  };
}

// Review data structure
export interface Review {
  id: string;
  venue_id: string;
  musician_id?: string;
  reviewer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: {
    first_name?: string;
    last_name?: string;
  };
}

// Dashboard stats
export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalBookings: number;
  pendingBookings: number;
  averageRating: number;
  pendingCancelBookings: number;
}

// Props for dashboard components
export interface DashboardHeaderProps {
  venue: VenueProfile;
  user: User;
  stats?: DashboardStats;
}

export interface DashboardStatsProps {
  stats: DashboardStats;
}

export interface OverviewTabProps {
  venue: VenueProfile;
  recentEvents: Event[];
  pendingBookings: Booking[];
  confirmedBookings: Booking[];
  pendingCancelBookings: Booking[];
}

export interface EventsTabProps {
  events: Event[];
  venue: VenueProfile;
  onCreateEvent: () => void;
}

export interface BookingsTabProps {
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
}

export interface ProfileTabProps {
  venue: VenueProfile;
  reviews: Review[];
}

export interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

export interface ReviewCardProps {
  review: Review;
} 