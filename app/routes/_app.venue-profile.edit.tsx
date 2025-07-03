import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, DollarSign, Users, Image, Plus, X, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { FileUpload } from "../components/shared/FileUpload";
import { MultipleImageUpload } from "../components/shared/MultipleImageUpload";
import { SocialMediaForm } from "../components/shared/SocialMediaForm";

export default function VenueProfileEdit() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue_type: "",
    capacity: "",
    city: "",
    state: "",
    country: "",
    address: "",
    zip_code: "",
    phone: "",
    email: "",
    website: "",
    price_range: "",
    profile_picture: "",
    additional_pictures: [] as string[],
    social_links: [] as Array<{platform: string, url: string}>,
    amenities: [] as string[],
    genres: [] as string[],
    contact_first_name: "",
    contact_last_name: ""
  });

  useEffect(() => {
    if (user?.id) {
      loadVenueProfile();
    }
  }, [user?.id]);

  const loadVenueProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (venueError) {
        if (venueError.code === 'PGRST116') {
          navigate("/venue-profile/create");
          return;
        }
        throw venueError;
      }

      if (venueData) {
        setVenueProfile(venueData);
        setFormData({
          name: venueData.name || "",
          description: venueData.description || "",
          venue_type: venueData.venue_type || "",
          capacity: venueData.capacity?.toString() || "",
          city: venueData.city || "",
          state: venueData.state || "",
          country: venueData.country || "",
          address: venueData.address || "",
          zip_code: venueData.zip_code || "",
          phone: venueData.phone || "",
          email: venueData.email || "",
          website: venueData.website || "",
          price_range: venueData.price_range || "",
          profile_picture: venueData.profile_picture || "",
          additional_pictures: venueData.additional_pictures || [],
          social_links: venueData.social_links || [],
          amenities: venueData.amenities || [],
          genres: venueData.genres || [],
          contact_first_name: venueData.contact_first_name || "",
          contact_last_name: venueData.contact_last_name || ""
        });
      } else {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureUpload = (url: string) => {
    setFormData(prev => ({ ...prev, profile_picture: url }));
  };

  const handleProfilePictureRemove = () => {
    setFormData(prev => ({ ...prev, profile_picture: "" }));
  };

  const handleAdditionalPicturesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, additional_pictures: images }));
  };

  const handleSocialLinksChange = (links: Array<{platform: string, url: string}>) => {
    setFormData(prev => ({ ...prev, social_links: links }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      console.log("Saving venue profile...", { venueProfile, formData });

      if (!venueProfile) {
        setError("No venue profile found to update.");
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // Test query to see what columns exist
      const { data: testData, error: testError } = await supabase
        .from('venues')
        .select('*')
        .limit(1);
      
      console.log("Test query result:", { testData, testError });
      console.log("Available columns:", testData ? Object.keys(testData[0] || {}) : 'No data');

      const updateData = {
        name: formData.name || "",
        description: formData.description || "",
        venue_type: formData.venue_type || "",
        capacity: parseInt(formData.capacity) || 0,
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        address: formData.address || "",
        zip_code: formData.zip_code || "",
        phone: formData.phone || "",
        email: formData.email || "",
        website: formData.website && formData.website.trim() ? formData.website.trim() : null,
        price_range: formData.price_range || "",
        profile_picture: formData.profile_picture || "",
        additional_pictures: formData.additional_pictures || [],
        social_links: formData.social_links || [],
        amenities: formData.amenities || [],
        genres: formData.genres || [],
        contact_first_name: formData.contact_first_name || "",
        contact_last_name: formData.contact_last_name || ""
      };

      console.log("Update data:", updateData);

      const { data, error: venueError } = await supabase
        .from('venues')
        .update(updateData)
        .eq('id', venueProfile.id)
        .select();

      console.log("Update result:", { data, error: venueError });

      if (venueError) {
        console.error("Database error:", venueError);
        throw venueError;
      }

      console.log("Successfully updated venue profile");
      setSuccess(true);
      
      // Reload the profile data to reflect changes
      await loadVenueProfile();
      
      setTimeout(() => {
        navigate("/venue-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error updating venue profile:", err);
      setError(`Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading venue profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <p className="font-medium">Venue profile updated successfully!</p>
            </div>
            <p className="text-green-700 mt-1">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <p className="font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Venue Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="venue_type">Venue Type</Label>
                  <Input
                    id="venue_type"
                    name="venue_type"
                    value={formData.venue_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Bar, Restaurant, Theater, Club"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Maximum capacity"
                  />
                </div>

                <div>
                  <Label htmlFor="price_range">Price Range</Label>
                  <Input
                    id="price_range"
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleInputChange}
                    placeholder="e.g., $10-50, Free, $20-100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell musicians about your venue, atmosphere, and what makes it special..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genres">Genres</Label>
                  <Input
                    id="genres"
                    name="genres"
                    value={formData.genres.join(', ')}
                    onChange={(e) => {
                      const genres = e.target.value.split(',').map(g => g.trim()).filter(g => g);
                      setFormData(prev => ({ ...prev, genres }));
                    }}
                    placeholder="Rock, Jazz, Blues, Country, etc. (comma separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input
                    id="amenities"
                    name="amenities"
                    value={formData.amenities.join(', ')}
                    onChange={(e) => {
                      const amenities = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                      setFormData(prev => ({ ...prev, amenities }));
                    }}
                    placeholder="Stage, PA System, Lighting, Parking, etc. (comma separated)"
                  />
                </div>
              </div>

              {/* Profile Images */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Profile Images
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label>Profile Picture</Label>
                    <FileUpload
                      label="Profile Picture"
                      type="image"
                      currentUrl={formData.profile_picture}
                      onUpload={handleProfilePictureUpload}
                      onRemove={handleProfilePictureRemove}
                    />
                  </div>

                  <div>
                    <Label>Additional Images</Label>
                    <MultipleImageUpload
                      label="Additional Images"
                      images={formData.additional_pictures}
                      onImagesChange={handleAdditionalPicturesChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_first_name">Contact First Name</Label>
                  <Input
                    id="contact_first_name"
                    name="contact_first_name"
                    value={formData.contact_first_name}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_last_name">Contact Last Name</Label>
                  <Input
                    id="contact_last_name"
                    name="contact_last_name"
                    value={formData.contact_last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="venue@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </h3>
              
              <SocialMediaForm
                socialLinks={formData.social_links}
                onChange={handleSocialLinksChange}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State or Province"
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">ZIP/Postal Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="ZIP or Postal Code"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/venue-dashboard")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 