export interface Musician {
  id: string;
  stage_name: string;
  email: string;
  bio?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  genres?: string[];
  years_experience?: number;
  hourly_rate?: number;
  total_gigs?: number;
  rating?: number;
  profile_picture?: string;
  availability?: Record<string, any>;
}

export interface Booking {
  id: string;
  status: string;
  musician_id: string;
  event_id: string;
  venue_id: string;
  proposed_rate?: number;
  musician_pitch?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  applied_at?: string;
  selected_at?: string;
  confirmed_at?: string;
  completed_at?: string;
  completed_by?: string;
  completed_by_role?: string;
  cancel_requested_at?: string;
  cancel_requested_by?: string;
  cancel_requested_by_role?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancel_confirmed_by_role?: string;
  cancellation_reason?: string;
  created_at: string;
  event?: {
    id: string;
    title: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    description?: string;
    created_at: string;
    venue?: {
      id: string;
      name: string;
      address?: string;
      city?: string;
      state?: string;
    };
  };
  musician?: {
    id: string;
    stage_name: string;
    email: string;
  };
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  musician?: Musician;
}

export interface DashboardHeaderProps {
  musician: Musician;
  user: User;
  lastRefreshTime: Date;
  bookingsNeedingAttention: number;
  isRefreshing: boolean;
  refreshBookings: () => void;
}

export interface DashboardStatsProps {
  musician: Musician;
  bookingsNeedingAttention: number;
}

export interface OverviewTabProps {
  musician: Musician;
  upcomingEvents: Booking[];
  allBookings?: Booking[];
  allEvents?: any[];
}

export interface BookingsTabProps {
  bookings: Booking[];
  user: User;
  handleBookingClick: (booking: Booking) => void;
  handleBookingStatusUpdate: (updatedBooking: Booking) => void;
}

export interface ProfileTabProps {
  musician: Musician;
}

 