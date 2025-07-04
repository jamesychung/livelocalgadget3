import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { 
  LoadingState, 
  NoProfileState, 
  ProfileForm,
  MusicianProfile,
  MusicianFormData,
  fetchMusicianProfile,
  updateMusicianProfile
} from "../components/musician/profile";

export default function MusicianProfileEdit() {
  const outletContext = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [musicianProfile, setMusicianProfile] = useState<MusicianProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure we have the user from context
  const user = outletContext?.user;
  
  useEffect(() => {
    const loadMusicianProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await fetchMusicianProfile(user.email);

        if (error) {
          setError(error);
        } else if (!data) {
          setError("No musician profile found. Redirecting to create page...");
          setTimeout(() => {
            navigate("/musician-profile/create");
          }, 2000);
        } else {
          setMusicianProfile(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMusicianProfile();
  }, [user, navigate]);

  if (!user) {
    return <LoadingState message="User context not available. Please try refreshing the page." />;
  }

  const handleSave = async (formData: MusicianFormData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      console.log("=== EDIT PROFILE SAVE STARTED ===");
      console.log("Form data received:", formData);
      console.log("Current musician profile:", musicianProfile);

      if (!musicianProfile) {
        throw new Error("No profile to update");
      }

      const { data, error } = await updateMusicianProfile(formData, musicianProfile.id as string, user.id);

      if (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
        return;
      }

      setSuccess(true);
      console.log("=== EDIT PROFILE SAVE COMPLETED ===");
      
      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        navigate("/musician-dashboard");
      }, 2000);

    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!musicianProfile) {
    return <NoProfileState error={error} navigate={navigate} />;
  }

  // Transform the musician profile data to match the form's expected structure
  const initialFormData: MusicianFormData = {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    stageName: musicianProfile.stage_name || "",
    bio: musicianProfile.bio || "",
    genre: musicianProfile.genre || "",
    genres: musicianProfile.genres || [],
    instruments: musicianProfile.instruments || [],
    city: musicianProfile.city || "",
    state: musicianProfile.state || "",
    country: musicianProfile.country || "",
    phone: musicianProfile.phone || "",
    website: musicianProfile.website || "",
    experience: musicianProfile.experience || "",
    yearsExperience: musicianProfile.years_experience || 0,
    hourlyRate: musicianProfile.hourly_rate || 0,
    profilePicture: musicianProfile.profile_picture || "",
    audioFiles: musicianProfile.audio_files || [],
    socialLinks: musicianProfile.social_links || [],
    additionalPictures: musicianProfile.additional_pictures || [],
  };

  return (
    <ProfileForm
      user={user}
      loading={isLoading}
      saving={saving}
      error={error}
      success={success}
      existingProfile={musicianProfile}
      onSave={handleSave}
      navigate={navigate}
    />
  );
} 
