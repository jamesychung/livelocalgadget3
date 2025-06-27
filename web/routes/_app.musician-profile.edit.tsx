import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { UserProfileForm } from "../components/shared/UserProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MusicianProfile {
  id: string;
  name: string;
  bio: string;
  genre: string;
  genres: string[];
  instruments: string[];
  hourlyRate: number;
  location: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  yearsExperience: number;
  stageName: string;
  phone: string;
  email: string;
  website: string;
  socialLinks: any;
  profilePicture: string;
  audioFiles: string[];
  additionalPictures: string[];
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalGigs: number;
  availability: any;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function MusicianProfileEdit() {
  const outletContext = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [musicianProfile, setMusicianProfile] = useState<MusicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Ensure we have the user from context
  const user = outletContext?.user;
  
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

  useEffect(() => {
    if (user?.id) {
      loadMusicianProfile();
    }
  }, [user?.id]);

  const loadMusicianProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileResult = await api.musician.findMany({
        filter: { user: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          bio: true,
          genre: true,
          genres: true,
          instruments: true,
          hourlyRate: true,
          location: true,
          city: true,
          state: true,
          country: true,
          experience: true,
          yearsExperience: true,
          stageName: true,
          phone: true,
          email: true,
          website: true,
          socialLinks: true,
          profilePicture: true,
          audioFiles: true,
          additionalPictures: true,
          isActive: true,
          isVerified: true,
          rating: true,
          totalGigs: true,
          availability: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        first: 1
      });

      if (profileResult && profileResult.length > 0) {
        setMusicianProfile(profileResult[0]);
      } else {
        // No profile exists, redirect to create
        setError("No musician profile found. Redirecting to create page...");
        setTimeout(() => {
          navigate("/musician-profile/create");
        }, 2000);
      }
    } catch (err) {
      console.error("Error loading musician profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        stageName: formData.stageName || "",
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
        yearsExperience: parseInt(formData.yearsExperience) || 0,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        email: formData.email || user.email,
        profilePicture: formData.profilePicture && formData.profilePicture.trim() ? formData.profilePicture.trim() : null,
        audioFiles: formData.audioFiles || [],
        socialLinks: formData.socialLinks || [],
        additionalPictures: formData.additionalPictures || [],
      };

      console.log("Update data being sent:", updateData);

      // Update the musician profile
      try {
        const updateResult = await api.musician.update(musicianProfile.id, updateData);
        console.log("Musician update result:", updateResult);
      } catch (updateError: any) {
        console.error("Musician update error details:", {
          message: updateError.message,
          code: updateError.code,
          status: updateError.status,
          response: updateError.response,
          data: updateError.data
        });
        throw updateError;
      }

      // Update the user profile (firstName, lastName, email)
      const userUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      console.log("User update data:", userUpdateData);
      
      const userUpdateResult = await api.user.update(user.id, userUpdateData);
      console.log("User update result:", userUpdateResult);

      setSuccess(true);
      console.log("=== EDIT PROFILE SAVE COMPLETED ===");
      
      // Reload the profile to get updated data
      await loadMusicianProfile();
      
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

  if (loading) {
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
                  <p className="text-sm text-green-700">
                    Profile updated successfully! Redirecting to dashboard...
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <UserProfileForm
                role="musician"
                profile={{ ...user, ...musicianProfile }}
                onSave={handleSave}
                isSaving={saving}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 