import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, DollarSign } from "lucide-react";
import { api } from "../../api";
import type { AuthOutletContext } from "../_app";
import { UserProfileForm } from "../../components/shared/UserProfileForm";

export default function VenueProfileEdit() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVenueProfile();
  }, []);

  const loadVenueProfile = async () => {
    try {
      setLoading(true);
      const profileResult = await api.venue.findFirst({
        filter: { user: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
          location: true,
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
          totalEvents: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            primaryRole: true,
          },
        },
      });
      setVenueProfile(profileResult);
    } catch (err) {
      console.error("Error loading venue profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      
      if (venueProfile) {
        // Update existing venue profile
        await api.venue.update(venueProfile.id, {
          name: formData.name,
          description: formData.description,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          phone: formData.phone,
          website: formData.website,
        });
      } else {
        // Create new venue profile
        await api.venue.create({
          user: user.id,
          name: formData.name,
          description: formData.description,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          phone: formData.phone,
          website: formData.website,
          isActive: true,
        });
      }
      
      navigate("/venue-dashboard");
    } catch (err) {
      console.error("Error saving venue profile:", err);
      alert("Failed to save venue profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Safe string conversion function
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.key) return String(value.key);
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Combine user and venue profile data
  const combinedProfile = {
    ...user,
    ...venueProfile,
    // Map venue fields to the form structure
    name: safeString(venueProfile?.name) || "",
    description: safeString(venueProfile?.description) || "",
    city: safeString(venueProfile?.city) || "",
    state: safeString(venueProfile?.state) || "",
    country: safeString(venueProfile?.country) || "",
    phone: safeString(venueProfile?.phone) || "",
    website: safeString(venueProfile?.website) || "",
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/venue-dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Venue Profile</h1>
              <p className="text-muted-foreground">
                Update your venue information and contact details
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Venue Owner
          </Badge>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Venue Information
            </CardTitle>
            <CardDescription>
              Update your venue details. Note that your name and email cannot be changed after signup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileForm
              role="venue"
              profile={combinedProfile}
              onSave={handleSave}
              isSaving={saving}
            />
          </CardContent>
        </Card>

        {/* Additional Venue Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Venue Details</CardTitle>
            <CardDescription>
              These fields will be available in future updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Price Range: Coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">Capacity: Coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Address: Coming soon</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Amenities: Coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Hours: Coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">Venue Type: Coming soon</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 