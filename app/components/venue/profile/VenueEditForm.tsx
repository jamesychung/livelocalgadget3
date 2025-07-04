import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Building, MapPin, Phone, Globe, Image } from "lucide-react";
import { FileUpload } from "../../shared/FileUpload";
import { MultipleImageUpload } from "../../shared/MultipleImageUpload";
import { SocialMediaForm } from "../../shared/SocialMediaForm";
import { VenueFormData } from "./types";

interface VenueEditFormProps {
  formData: VenueFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleProfilePictureUpload: (url: string) => void;
  handleProfilePictureRemove: () => void;
  handleAdditionalPicturesChange: (images: string[]) => void;
  handleSocialLinksChange: (links: Array<{platform: string, url: string}>) => void;
  handleSave: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  navigate: (path: string) => void;
}

export const VenueEditForm: React.FC<VenueEditFormProps> = ({
  formData,
  handleInputChange,
  handleProfilePictureUpload,
  handleProfilePictureRemove,
  handleAdditionalPicturesChange,
  handleSocialLinksChange,
  handleSave,
  saving,
  navigate
}) => {
  // Handle array inputs (genres, amenities)
  const handleArrayInputChange = (name: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    // Update form data directly rather than through event
    const customEvent = {
      target: {
        name,
        value: items
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(customEvent);
  };

  return (
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
              onChange={(e) => handleArrayInputChange('genres', e.target.value)}
              placeholder="Rock, Jazz, Blues, Country, etc. (comma separated)"
            />
          </div>

          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              name="amenities"
              value={formData.amenities.join(', ')}
              onChange={(e) => handleArrayInputChange('amenities', e.target.value)}
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
  );
}; 