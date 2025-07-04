import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import {
  LoadingState,
  EditFormContainer,
  VenueEditForm,
  VenueFormData,
  fetchVenueProfile,
  updateVenueProfile
} from "../components/venue/profile";

export default function VenueProfileEdit() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<VenueFormData>({
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
    additional_pictures: [],
    social_links: [],
    amenities: [],
    genres: [],
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

      const { data, error } = await fetchVenueProfile(authUser.email || "");

      if (error) {
        if (error === "PGRST116") {
          navigate("/venue-profile/create");
          return;
        }
        throw error;
      }

      if (data) {
        setVenueProfile(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          venue_type: data.venue_type || "",
          capacity: data.capacity?.toString() || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          address: data.address || "",
          zip_code: data.zip_code || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          price_range: data.price_range || "",
          profile_picture: data.profile_picture || "",
          additional_pictures: data.additional_pictures || [],
          social_links: data.social_links || [],
          amenities: data.amenities || [],
          genres: data.genres || [],
          contact_first_name: data.contact_first_name || "",
          contact_last_name: data.contact_last_name || ""
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

      const { data, error } = await updateVenueProfile(formData, venueProfile.id);

      if (error) {
        console.error("Error updating profile:", error);
        setError(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
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
    return <LoadingState message="Loading venue profile..." />;
  }

  return (
    <EditFormContainer success={success} error={error} navigate={navigate}>
      <VenueEditForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleProfilePictureUpload={handleProfilePictureUpload}
        handleProfilePictureRemove={handleProfilePictureRemove}
        handleAdditionalPicturesChange={handleAdditionalPicturesChange}
        handleSocialLinksChange={handleSocialLinksChange}
        handleSave={handleSave}
        saving={saving}
        navigate={navigate}
      />
    </EditFormContainer>
  );
} 