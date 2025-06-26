import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, DollarSign, Star, Users, Clock } from "lucide-react";
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
        setVenueProfile(null); // Explicitly set to null
      }
    } catch (err) {
      console.error("Error loading venue profile:", err);
      // Only show error if it's not a "not found" type error
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as any).message;
        if (!errorMessage.includes('not found') && !errorMessage.includes('No records')) {
          setError("Failed to load profile. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      if (venueProfile) {
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
        };

        const updateResult = await api.venue.update(venueProfile.id, updateData);
      } else {
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
          owner: { _link: user.id },
        };

        const createResult = await api.venue.create(createData);
        setVenueProfile(createResult);
      }

      // Update the user profile (firstName, lastName, email)
      const userUpdateData = {
        firstName: formData.firstName || user.firstName,
        lastName: formData.lastName || user.lastName,
        email: formData.email || user.email,
      };
      
      const userUpdateResult = await api.user.update(user.id, userUpdateData);

      setSuccess(true);
      
      // Reload the profile to get updated data
      await loadVenueProfile();
      
      // Show success message for 5 seconds, then redirect
      setTimeout(() => {
        navigate("/venue-dashboard");
      }, 5000);

    } catch (err: any) {
      console.error("Error saving profile:", err);
      
      // Show more specific error message
      if (err.message) {
        setError(`Failed to save profile: ${err.message}`);
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper function to safely convert values to strings
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  // Helper function to safely convert arrays
  const safeArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value.split(",").map((item: string) => item.trim()).filter((item: string) => item.length > 0);
      }
    }
    return [];
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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/venue-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {venueProfile ? "Edit Venue Profile" : "Create Venue Profile"}
              </CardTitle>
              <CardDescription>
                {venueProfile 
                  ? "Update your venue profile information" 
                  : "Create your venue profile to start managing events and bookings"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Profile {venueProfile ? "updated" : "created"} successfully! Redirecting to dashboard...
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {venueProfile && (
                <UserProfileForm
                  role="venue"
                  profile={{ 
                    ...user,  // User data first (firstName, lastName, email)
                    ...venueProfile,  // Venue data second (including profilePicture)
                    email: user.email, // Explicitly ensure user email is used
                  }}
                  onSave={handleSave}
                  isSaving={saving}
                  allowNameEdit={true}
                />
              )}

              {!venueProfile && (
                <UserProfileForm
                  role="venue"
                  profile={{ ...user }}
                  onSave={handleSave}
                  isSaving={saving}
                  allowNameEdit={true}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 