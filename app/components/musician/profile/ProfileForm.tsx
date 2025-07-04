import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";
import { UserProfileForm } from "../../shared/UserProfileForm";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileFormProps, MusicianFormData } from "./types";

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  loading,
  saving,
  error,
  success,
  existingProfile,
  onSave,
  navigate
}) => {
  const isEditMode = !!existingProfile;
  
  // Initial form data for a new musician profile or populated with existing data
  const initialFormData: MusicianFormData = isEditMode ? {
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    stageName: existingProfile.stage_name || "",
    bio: existingProfile.bio || "",
    genre: existingProfile.genre || "",
    genres: existingProfile.genres || [],
    instruments: existingProfile.instruments || [],
    city: existingProfile.city || "",
    state: existingProfile.state || "",
    country: existingProfile.country || "",
    phone: existingProfile.phone || "",
    website: existingProfile.website || "",
    experience: existingProfile.experience || "",
    yearsExperience: existingProfile.years_experience || 0,
    hourlyRate: existingProfile.hourly_rate || 0,
    profilePicture: existingProfile.profile_picture || "",
    audioFiles: existingProfile.audio_files || [],
    socialLinks: existingProfile.social_links || [],
    additionalPictures: existingProfile.additional_pictures || [],
  } : {
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
            <ProfileHeader
              title={isEditMode ? "Edit Musician Profile" : "Create Musician Profile"}
              description={isEditMode 
                ? "Update your musician profile information" 
                : "Set up your musician profile to start getting bookings"}
              error={error}
              success={success}
            >
              <CardContent>
                <UserProfileForm 
                  role="musician"
                  profile={initialFormData}
                  onSave={onSave}
                  isSaving={saving}
                  allowNameEdit={true}
                />
              </CardContent>
            </ProfileHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}; 