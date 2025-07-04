import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import type { AuthOutletContext } from "./_app";
import { 
  LoadingState,
  NoProfileState,
  ErrorState,
  ProfileView,
  MusicianProfile,
  fetchMusicianProfile
} from "../components/musician/profile";

export default function MusicianProfilePage() {
  const context = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [musicianProfile, setMusicianProfile] = useState<MusicianProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ensure we have the user from context
  const user = context?.user;
  
  useEffect(() => {
    const loadMusicianProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await fetchMusicianProfile(user.email);

        if (error) {
          console.error("Error loading musician data:", error);
          setError("Failed to load profile. Please try again.");
        } else if (!data) {
          setError("No musician profile found. Redirecting to create page...");
          setTimeout(() => {
            navigate("/musician-profile/create");
          }, 2000);
        } else {
          console.log("Musician profile data:", data);
          setMusicianProfile(data);
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadMusicianProfile();
  }, [user, navigate]);

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error) {
    return <ErrorState error={error} navigate={navigate} />;
  }

  if (!musicianProfile) {
    return <NoProfileState error={error} navigate={navigate} />;
  }

  return <ProfileView profile={musicianProfile} user={user} navigate={navigate} />;
}
