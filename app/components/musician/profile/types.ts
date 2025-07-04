import { ReactNode } from "react";

// Musician profile data structure
export interface MusicianProfile {
  id?: string;
  bio: string;
  genre: string;
  genres: string[];
  instruments: string[];
  hourly_rate: number;
  location?: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  years_experience: number;
  stage_name: string;
  phone: string;
  email: string;
  website: string | null;
  social_links: Array<{platform: string, url: string}>;
  profile_picture: string | null;
  audio_files: string[];
  additional_pictures: string[];
  is_active: boolean;
  is_verified: boolean;
  rating: number;
  total_gigs: number;
  availability?: any;
  user_id: string;
}

// Form data for musician profile creation/editing
export interface MusicianFormData {
  firstName: string;
  lastName: string;
  email: string;
  stageName: string;
  bio: string;
  genre: string;
  genres: string[];
  instruments: string[] | string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website: string;
  experience: string;
  yearsExperience: number | string;
  hourlyRate: number | string;
  profilePicture: string;
  audioFiles: string[];
  socialLinks: Array<{platform: string, url: string}>;
  additionalPictures: string[];
}

// Props for the ProfileForm component
export interface ProfileFormProps {
  user: any;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  existingProfile: MusicianProfile | null;
  onSave: (formData: MusicianFormData) => Promise<void>;
  navigate: (path: string) => void;
}

// Props for the ProfileHeader component
export interface ProfileHeaderProps {
  title: string;
  description: string;
  error: string | null;
  success: boolean;
  children?: ReactNode;
}

// Props for the LoadingState component
export interface LoadingStateProps {
  message?: string;
}

// Props for the ExistingProfileState component
export interface ExistingProfileStateProps {
  error: string | null;
  navigate: (path: string) => void;
} 