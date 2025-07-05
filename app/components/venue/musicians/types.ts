export interface Musician {
  id: string;
  stage_name: string;
  genres: string[];
  availability: any;
  email: string;
  phone: string;
  city: string;
  state: string;
  bio: string;
  hourly_rate: number;
  profile_picture?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  genres: string[];
  venue: {
    id: string;
    name: string;
  };
}

export interface VenueProfile {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface InvitationData {
  event_id: string;
  musician_id: string;
  venue_id: string;
  status: string;
  invited_at?: string;
  created_at: string;
  updated_at: string;
} 