import { useState } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import {
  CreateFormContainer,
  SimpleCreateForm,
  createSimpleVenueProfile
} from "../components/venue/profile";

export default function VenueProfileCreate() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateVenue = async () => {
    try {
      setSaving(true);
      setError(null);

      // Get current user ID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      console.log("Creating venue profile for user:", authUser.id);

      const { data, error: venueError } = await createSimpleVenueProfile(
        authUser.id, 
        authUser.email || user?.email || ""
      );

      if (venueError) {
        console.error("Venue creation error:", venueError);
        throw venueError;
      }

      console.log("Venue profile created successfully:", data);

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

  return (
    <CreateFormContainer success={success} error={error}>
      <SimpleCreateForm saving={saving} onSubmit={handleCreateVenue} />
    </CreateFormContainer>
  );
} 
