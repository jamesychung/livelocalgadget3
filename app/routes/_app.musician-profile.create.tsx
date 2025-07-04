import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { 
  LoadingState, 
  ExistingProfileState, 
  ProfileForm,
  MusicianProfile,
  MusicianFormData,
  checkExistingMusicianProfile,
  createMusicianProfile
} from "../components/musician/profile";

export default function MusicianProfileCreate() {
  const outletContext = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingProfile, setExistingProfile] = useState<MusicianProfile | null>(null);

  // Ensure we have the user from context
  const user = outletContext?.user;
  
  if (!user) {
    return <LoadingState message="User context not available. Please try refreshing the page." />;
  }

  useEffect(() => {
    if (user?.id) {
      checkExistingProfileData();
    }
  }, [user?.id]);

  const checkExistingProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Checking existing profile for user ID:", user.id, "Type:", typeof user.id);

      const { data, error } = await checkExistingMusicianProfile(user.email);

      console.log("Existing profile result:", data);

      if (error) {
        console.error("Error checking musician profile:", error);
        setError("Failed to check profile. Please try again.");
      } else if (data) {
        // Profile already exists, redirect to edit
        setExistingProfile(data);
        setError("You already have a musician profile. Redirecting to edit page...");
        setTimeout(() => {
          navigate("/musician-profile/edit");
        }, 2000);
      } else {
        // No profile exists, allow creation
        setExistingProfile(null);
      }
    } catch (err) {
      console.error("Error checking musician profile:", err);
      setError("Failed to check profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: MusicianFormData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      console.log("=== CREATE PROFILE SAVE STARTED ===");
      console.log("Form data received:", formData);

      const { data, error } = await createMusicianProfile(formData, user.id);

      if (error) {
        console.error("Error creating profile:", error);
        setError("Failed to create profile. Please try again.");
        return;
      }

      setSuccess(true);
      console.log("=== CREATE PROFILE SAVE COMPLETED ===");
      
      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        navigate("/musician-dashboard");
      }, 2000);

    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (existingProfile) {
    return <ExistingProfileState error={error} navigate={navigate} />;
  }

  return (
    <ProfileForm
      user={user}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
      existingProfile={existingProfile}
      onSave={handleSave}
      navigate={navigate}
    />
  );
} 
