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
      checkExistingProfile();
    }
  }, [user?.id]);

  const checkExistingProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Checking existing profile for user ID:", user.id, "Type:", typeof user.id);

      const { data, error } = await supabase
        .from('musicians')
        .select('*')
        .eq('email', user.email)
        .single();

      console.log("Existing profile result:", data);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
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

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      console.log("=== CREATE PROFILE SAVE STARTED ===");
      console.log("Form data received:", formData);

      // Prepare the create data
      const createData = {
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
        user_id: user.id,
        is_active: true,
        is_verified: false,
        rating: 0,
        total_gigs: 0,
      };

      console.log("Create data being sent:", createData);

      // Create the musician profile
      const { data: createResult, error: createError } = await supabase
        .from('musicians')
        .insert([createData])
        .select();

      if (createError) {
        console.error("Musician create error:", createError);
        throw createError;
      }

      console.log("Musician create result:", createResult);

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

  if (existingProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Already Exists</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/musician-dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate("/musician-profile/edit")}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initial form data for a new musician profile
  const initialFormData = {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    stageName: "",
    bio: "",
    genre: "",
    genres: [],
    instruments: [],
    city: "",
    state: "",
    country: "",
    phone: "",
    website: "",
    experience: "",
    yearsExperience: 0,
    hourlyRate: 0,
    profilePicture: "",
    audioFiles: [],
    socialLinks: [],
    additionalPictures: [],
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
              <CardTitle>Create Musician Profile</CardTitle>
              <CardDescription>
                Set up your musician profile to start getting bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700">Profile created successfully! Redirecting...</p>
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
