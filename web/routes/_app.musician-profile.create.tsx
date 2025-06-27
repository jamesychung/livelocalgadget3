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
        // Profile already exists, redirect to edit
        setExistingProfile(profileResult[0]);
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
        stageName: formData.stageName || "",
        bio: formData.bio || "",
        genre: formData.genre || "",
        genres: Array.isArray(formData.genres) ? formData.genres : [],
        instruments: formData.instruments ? 
          (typeof formData.instruments === 'string' ? 
            (formData.instruments === '[]' || formData.instruments.includes('[]') ? [] :
             formData.instruments.startsWith('[') && formData.instruments.endsWith(']') ?
             (() => {
               try {
                 const parsed = JSON.parse(formData.instruments);
                 return Array.isArray(parsed) ? parsed : [];
               } catch {
                 return formData.instruments.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0);
               }
             })() :
             formData.instruments.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0)) : 
            formData.instruments) : 
          [],
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
        user: { _link: user.id },
        isActive: true,
        isVerified: false,
        rating: 0,
        totalGigs: 0,
      };

      console.log("Create data being sent:", createData);

      // Create the musician profile
      try {
        const createResult = await api.musician.create(createData);
        console.log("Musician create result:", createResult);
      } catch (createError: any) {
        console.error("Musician create error details:", {
          message: createError.message,
          code: createError.code,
          status: createError.status,
          response: createError.response,
          data: createError.data
        });
        throw createError;
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
                Set up your musician profile to start getting booked for events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Profile created successfully! Redirecting to dashboard...
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
                profile={{ ...user }}
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