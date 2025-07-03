import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { UserProfileForm } from "../components/shared/UserProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MusicianProfile {
  id: string;
  bio: string;
  genre: string;
  genres: string[];
  instruments: string[];
  hourly_rate: number;
  location: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  years_experience: number;
  stage_name: string;
  phone: string;
  email: string;
  website: string;
  social_links: any;
  profile_picture: string;
  audio_files: string[];
  additional_pictures: string[];
  is_active: boolean;
  is_verified: boolean;
  rating: number;
  total_gigs: number;
  availability: any;
  user_id: string;
}

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
    const fetchMusicianProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('musicians')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error("Error loading musician data:", error);
          setError("Failed to load profile. Please try again.");
        } else if (!data) {
          setError("No musician profile found. Redirecting to create page...");
          setTimeout(() => {
            navigate("/musician-profile/create");
          }, 2000);
        } else {
          setMusicianProfile(data);
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicianProfile();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600">User context not available. Please try refreshing the page.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async (formData: any) => {
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

      // Prepare the update data
      const updateData = {
        stage_name: formData.stageName || "",
        bio: formData.bio || "",
        genre: formData.genre || "",
        genres: Array.isArray(formData.genres) ? formData.genres : [],
        instruments: formData.instruments || [],
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        phone: formData.phone || "",
        website: formData.website && formData.website.trim() ? formData.website.trim() : null,
        experience: formData.experience || "",
        years_experience: parseInt(formData.yearsExperience) || 0,
        hourly_rate: parseFloat(formData.hourlyRate) || 0,
        email: formData.email || user.email,
        profile_picture: formData.profilePicture && formData.profilePicture.trim() ? formData.profilePicture.trim() : null,
        audio_files: formData.audioFiles || [],
        social_links: formData.socialLinks || [],
        additional_pictures: formData.additionalPictures || [],
      };

      console.log("Update data being sent:", updateData);

      // Update the musician profile
      const { error: updateError } = await supabase
        .from('musicians')
        .update(updateData)
        .eq('id', musicianProfile.id);

      if (updateError) {
        console.error("Musician update error:", updateError);
        throw updateError;
      }

      // Update the user profile (first_name, last_name, email)
      const userUpdateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      };
      console.log("User update data:", userUpdateData);
      
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', user.id);

      if (userUpdateError) {
        console.error("User update error:", userUpdateError);
        throw userUpdateError;
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
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!musicianProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/musician-dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate("/musician-profile/create")}>
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform the musician profile data to match the form's expected structure
  const initialFormData = {
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
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/musician-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Edit Musician Profile</CardTitle>
              <CardDescription>
                Update your musician profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700">Profile updated successfully! Redirecting...</p>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <UserProfileForm 
                role="musician"
                profile={initialFormData}
                onSave={handleSave}
                isSaving={saving}
                allowNameEdit={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
