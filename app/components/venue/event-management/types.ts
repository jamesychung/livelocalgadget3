export interface Venue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  [key: string]: any;
}

export interface Musician {
  id: string;
  stage_name: string;
  genre?: string[];
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  hourly_rate?: number;
  profile_picture?: string;
  [key: string]: any;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  ticket_price?: number;
  total_capacity?: number;
  status?: string;
  genres?: string[];
  venue?: Venue;
  musician?: Musician;
  [key: string]: any;
}

export interface Booking {
  id: string;
  event_id: string;
  musician_id: string;
  venue_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  selected_at?: string;
  confirmed_at?: string;
  rejected_at?: string;
  event?: Event;
  musician?: Musician;
  [key: string]: any;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: string;
  senderName: string;
}

export interface EditFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  totalCapacity: string;
  status: string;
  genres: string[];
} 