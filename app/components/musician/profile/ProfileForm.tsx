import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
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
  // Initial form data for a new musician profile
  const initialFormData: MusicianFormData = {
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
              title="Create Musician Profile"
              description="Set up your musician profile to start getting bookings"
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