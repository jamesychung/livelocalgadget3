import { useState } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, DollarSign, Star, Users, Clock, AlertCircle } from "lucide-react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { UserProfileForm } from "../components/shared/UserProfileForm";

export default function VenueProfileCreate() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Create new venue profile
      const createData = {
        name: formData.name || "",
        description: formData.description || "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        phone: formData.phone || "",
        website: formData.website && formData.website.trim() ? formData.website.trim() : null,
        profilePicture: formData.profilePicture && formData.profilePicture.trim() ? formData.profilePicture.trim() : null,
        additionalPictures: formData.additionalPictures || [],
        socialLinks: formData.socialLinks || [],
        genres: formData.genres || [],
        type: formData.type || "",
        capacity: parseInt(formData.capacity) || 0,
        priceRange: formData.priceRange || "",
        amenities: formData.amenities || [],
        address: formData.address || "",
        zipCode: formData.zipCode || "",
        email: formData.email || "",
        owner: { _link: user.id },
      };

      const createResult = await api.venue.create(createData);

      // Update the user profile (firstName, lastName, email)
      const userUpdateData = {
        firstName: formData.firstName || user.firstName,
        lastName: formData.lastName || user.lastName,
        email: formData.email || user.email,
      };

      await api.user.update(user.id, userUpdateData);

      setSuccess(true);
      
      // Navigate to venue dashboard after successful creation
      setTimeout(() => {
        navigate("/venue-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error creating venue profile:", err);
      setError("Failed to create profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const safeString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    return '';
  };

  const safeArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) return [value];
    return [];
  };

  // Default form data for venue creation
  const defaultFormData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    name: "",
    description: "",
    type: "",
    capacity: "",
    city: "",
    state: "",
    country: "",
    address: "",
    zipCode: "",
    phone: "",
    website: "",
    priceRange: "",
    genres: [],
    amenities: [],
    profilePicture: "",
    additionalPictures: [],
    socialLinks: [],
    hours: {},
    venueEmail: "",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/venue-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Venue Profile</h1>
            <p className="text-muted-foreground">
              Set up your venue profile to start attracting musicians and hosting events
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5" />
              <p className="font-medium">Venue profile created successfully!</p>
            </div>
            <p className="text-green-700 mt-1">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Venue Information
          </CardTitle>
          <CardDescription>
            Tell musicians about your venue, its amenities, and what makes it special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserProfileForm
            role="venue"
            profile={defaultFormData}
            onSave={handleSave}
            isSaving={saving}
            allowNameEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
} 
