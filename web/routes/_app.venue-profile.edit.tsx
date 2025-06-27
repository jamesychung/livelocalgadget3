import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, DollarSign, Star, Users, Clock, AlertCircle } from "lucide-react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { UserProfileForm } from "../components/shared/UserProfileForm";

interface VenueProfile {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  priceRange: string;
  amenities: string[];
  hours: any;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  profilePicture: string;
  additionalPictures: string[];
  socialLinks: any;
  genres: string[];
  zipCode: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    firstName: string;
    lastName: string;
  };
}

export default function VenueProfileEdit() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [venueProfile, setVenueProfile] = useState<VenueProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadVenueProfile();
    }
  }, [user?.id]);

  const loadVenueProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only try to load if user exists
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const profileResult = await api.venue.findMany({
        filter: { owner: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
          city: true,
          state: true,
          country: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          priceRange: true,
          amenities: true,
          hours: true,
          isActive: true,
          isVerified: true,
          rating: true,
          profilePicture: true,
          additionalPictures: true,
          socialLinks: true,
          genres: true,
          zipCode: true,
          owner: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sort: { updatedAt: "Descending" },
        first: 1
      });

      if (profileResult && profileResult.length > 0) {
        const venueProfile = profileResult[0];
        setVenueProfile(venueProfile);
        setReviews([]); // Set empty reviews for now
      } else {
        // If no venue profile found, redirect to create page
        navigate("/venue-profile/create");
        return;
      }
    } catch (err) {
      console.error("Error loading venue profile:", err);
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

      if (!venueProfile) {
        setError("No venue profile found to update.");
        return;
      }

      // Update existing venue profile
      const updateData = {
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
      };

      const updateResult = await api.venue.update(venueProfile.id, updateData);

      // Update the user profile (firstName, lastName, email)
      const userUpdateData = {
        firstName: formData.firstName || user.firstName,
        lastName: formData.lastName || user.lastName,
        email: formData.email || user.email,
      };

      await api.user.update(user.id, userUpdateData);

      setSuccess(true);
      
      // Navigate back to venue dashboard after successful update
      setTimeout(() => {
        navigate("/venue-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error updating venue profile:", err);
      setError("Failed to update profile. Please try again.");
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

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your venue profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no venue profile found, this should redirect to create page
  if (!venueProfile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to create profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare form data for editing
  const formData = {
    firstName: venueProfile.owner?.firstName || user?.firstName || "",
    lastName: venueProfile.owner?.lastName || user?.lastName || "",
    email: venueProfile.email || user?.email || "",
    name: venueProfile.name || "",
    description: venueProfile.description || "",
    type: venueProfile.type || "",
    capacity: venueProfile.capacity?.toString() || "",
    city: venueProfile.city || "",
    state: venueProfile.state || "",
    country: venueProfile.country || "",
    address: venueProfile.address || "",
    zipCode: venueProfile.zipCode || "",
    phone: venueProfile.phone || "",
    website: venueProfile.website || "",
    priceRange: venueProfile.priceRange || "",
    genres: safeArray(venueProfile.genres),
    amenities: safeArray(venueProfile.amenities),
    profilePicture: venueProfile.profilePicture || "",
    additionalPictures: safeArray(venueProfile.additionalPictures),
    socialLinks: venueProfile.socialLinks || [],
    hours: venueProfile.hours || {},
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
            <h1 className="text-3xl font-bold">Edit Venue Profile</h1>
            <p className="text-muted-foreground">
              Update your venue information and settings
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
              <p className="font-medium">Venue profile updated successfully!</p>
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
            Update your venue details, amenities, and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserProfileForm
            role="venue"
            profile={formData}
            onSave={handleSave}
            isSaving={saving}
            allowNameEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
} 