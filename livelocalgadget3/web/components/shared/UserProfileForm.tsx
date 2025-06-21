import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export type UserProfileFormProps = {
  role: "user" | "musician" | "venue";
  profile: any;
  onSave: (data: any) => void;
  isSaving?: boolean;
  allowNameEdit?: boolean;
};

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ role, profile, onSave, isSaving, allowNameEdit }) => {
  // Helper function to safely convert values to strings
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value.name) return String(value.name);
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Helper function to safely convert values to arrays
  const safeArray = (value: any): string[] => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") return [value];
    return [];
  };

  // Common music genres
  const availableGenres = [
    "Jazz", "Rock", "Pop", "Classical", "Blues", "Country", "Folk", "Electronic", 
    "Hip Hop", "R&B", "Soul", "Funk", "Reggae", "Latin", "World", "Alternative", 
    "Indie", "Metal", "Punk", "Gospel", "Bluegrass", "Ska", "Disco", "House"
  ];

  // Set up local state for all possible fields
  const [form, setForm] = useState({
    firstName: safeString(profile?.firstName) || "",
    lastName: safeString(profile?.lastName) || "",
    email: safeString(profile?.email) || "",
    // Musician fields (matching schema)
    stageName: safeString(profile?.stageName) || "",
    name: safeString(profile?.name) || "",
    bio: safeString(profile?.bio) || "",
    genre: safeString(profile?.genre) || "",
    genres: safeArray(profile?.genres) || [],
    city: safeString(profile?.city) || "",
    state: safeString(profile?.state) || "",
    country: safeString(profile?.country) || "",
    phone: safeString(profile?.phone) || "",
    website: safeString(profile?.website) || "",
    experience: safeString(profile?.experience) || "",
    yearsExperience: safeString(profile?.yearsExperience) || "",
    instruments: safeString(profile?.instruments) || "",
    hourlyRate: safeString(profile?.hourlyRate) || "",
    // Venue fields
    description: safeString(profile?.description) || "",
  });

  console.log("UserProfileForm render - profile:", profile);
  console.log("UserProfileForm render - form state:", form);
  console.log("UserProfileForm render - isSaving:", isSaving);
  console.log("UserProfileForm render - allowNameEdit:", allowNameEdit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setForm({ ...form, genres: [...form.genres, genre] });
    } else {
      setForm({ ...form, genres: form.genres.filter(g => g !== genre) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted with data:", form);
    console.log("Form element:", e.target);
    console.log("Form validity:", (e.target as HTMLFormElement).checkValidity());
    console.log("isSaving state:", isSaving);
    
    // Prevent submission if already saving
    if (isSaving) {
      console.log("Form submission blocked - already saving");
      return;
    }
    
    // Validate that stage name is provided
    if (!form.stageName.trim()) {
      alert("Please enter your stage name.");
      return;
    }
    
    // Validate website URL if provided
    if (form.website.trim() && !isValidUrl(form.website.trim())) {
      alert("Please enter a valid website URL (e.g., https://example.com) or leave it empty.");
      return;
    }
    
    // Prepare the data for submission
    const submitData = {
      ...form,
      // Use the first selected genre as the primary genre field
      genre: form.genres.length > 0 ? form.genres[0] : "",
      // Keep the genres array for the JSON field
      genres: form.genres,
      // Ensure numeric fields are properly formatted
      yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : 0,
      hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
      // Ensure website is either a valid URL or null
      website: form.website.trim() || null
    };
    
    console.log("Submitting data:", submitData);
    console.log("Calling onSave function...");
    onSave(submitData);
    console.log("=== FORM SUBMISSION COMPLETED ===");
  };

  // Helper function to validate URLs
  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Check if form is valid - simplified for testing
  const isFormValid = form.stageName.trim() !== "";

  console.log("Form validation:", {
    stageName: form.stageName.trim() !== "",
    isFormValid
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            readOnly={!allowNameEdit}
            className={allowNameEdit ? "" : "bg-gray-50 cursor-not-allowed"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {allowNameEdit ? "Enter your first name" : "Name cannot be changed after signup"}
          </p>
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            readOnly={!allowNameEdit}
            className={allowNameEdit ? "" : "bg-gray-50 cursor-not-allowed"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {allowNameEdit ? "Enter your last name" : "Name cannot be changed after signup"}
          </p>
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          readOnly={!allowNameEdit}
          className={allowNameEdit ? "" : "bg-gray-50 cursor-not-allowed"}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {allowNameEdit ? "Enter your email address" : "Email cannot be changed after signup"}
        </p>
      </div>

      {/* Musician fields */}
      {role === "musician" && (
        <>
          <div>
            <Label htmlFor="stageName">Stage Name *</Label>
            <Input
              id="stageName"
              name="stageName"
              value={form.stageName}
              onChange={handleChange}
              required
              placeholder="Enter your stage name or artist name"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded p-2 min-h-[80px]"
              placeholder="Tell us about yourself and your music..."
            />
          </div>
          <div>
            <Label htmlFor="genre">Genres *</Label>
            <div className="mt-2 p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-3">
                Select all genres that apply to your music (at least one required)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableGenres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={form.genres.includes(genre)}
                      onCheckedChange={(checked) => handleGenreChange(genre, checked === true)}
                    />
                    <Label 
                      htmlFor={genre} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
              {form.genres.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    Selected: {form.genres.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="musician-city">City</Label>
              <Input
                id="musician-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="musician-state">State</Label>
              <Input
                id="musician-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your state/province"
              />
            </div>
            <div>
              <Label htmlFor="musician-country">Country</Label>
              <Input
                id="musician-country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter your country"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="musician-phone">Phone</Label>
            <Input
              id="musician-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="musician-website">Website</Label>
            <Input
              id="musician-website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a valid website URL (e.g., https://example.com) or leave empty
            </p>
          </div>
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Brief description of your experience"
            />
          </div>
          <div>
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              min="0"
              value={form.yearsExperience}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="instruments">Instruments</Label>
            <Input
              id="instruments"
              name="instruments"
              value={form.instruments}
              onChange={handleChange}
              placeholder="e.g., Guitar, Piano, Drums (separate with commas)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your primary instrument(s), separated by commas
            </p>
          </div>
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.hourlyRate}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </>
      )}

      {/* Venue fields */}
      {role === "venue" && (
        <>
          <div>
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2 min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="venue-city">City *</Label>
              <Input
                id="venue-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue-state">State *</Label>
              <Input
                id="venue-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue-country">Country *</Label>
              <Input
                id="venue-country"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="venue-phone">Phone</Label>
            <Input
              id="venue-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="venue-website">Website</Label>
            <Input
              id="venue-website"
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSaving || !isFormValid}
        onClick={() => {
          console.log("=== BUTTON CLICKED ===");
          console.log("Button clicked, isSaving:", isSaving);
          console.log("isFormValid:", isFormValid);
          console.log("Button disabled:", isSaving || !isFormValid);
        }}
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </Button>
      
      {/* Debug button to test if the issue is with form validation */}
      <Button 
        type="button" 
        variant="outline"
        className="w-full mt-2" 
        onClick={() => {
          console.log("=== DEBUG BUTTON CLICKED ===");
          console.log("Current form state:", form);
          console.log("Calling onSave directly...");
          const submitData = {
            ...form,
            genre: form.genres.length > 0 ? form.genres[0] : "",
            genres: form.genres
          };
          onSave(submitData);
        }}
      >
        Debug: Save Profile (Bypass Validation)
      </Button>
    </form>
  );
}; 