import { ReactNode } from "react";

// Venue profile data structure
export interface VenueProfile {
  id?: string;
  owner_id: string;
  name: string;
  description: string;
  venue_type: string;
  capacity: number;
  city: string;
  state: string;
  country: string;
  address: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string | null;
  price_range: string;
  profile_picture: string;
  additional_pictures: string[];
  social_links: Array<{platform: string, url: string}>;
  amenities: string[];
  genres: string[];
  contact_first_name: string;
  contact_last_name: string;
  created_at?: string;
  updated_at?: string;
}

// Form data for venue profile creation
export interface VenueFormData {
  name: string;
  description: string;
  venue_type: string;
  capacity: string | number;
  city: string;
  state: string;
  country: string;
  address: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  price_range: string;
  profile_picture: string;
  additional_pictures: string[];
  social_links: Array<{platform: string, url: string}>;
  amenities: string[];
  genres: string[];
  contact_first_name: string;
  contact_last_name: string;
}

// Props for the SimpleCreateForm component
export interface SimpleCreateFormProps {
  saving: boolean;
  onSubmit: () => Promise<void>;
}

// Props for the CreateFormContainer component
export interface CreateFormContainerProps {
  success: boolean;
  error: string | null;
  children: ReactNode;
}

// Props for the VenueProfileCreate component
export interface VenueProfileCreateProps {
  user: any;
  navigate: (path: string) => void;
}

// Props for the LoadingState component
export interface LoadingStateProps {
  message?: string;
} 