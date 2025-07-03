import { useState } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";

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

      // Create a simple venue profile
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert({
          owner_id: authUser.id,
          name: "My Venue",
          description: "A great venue for live music",
          email: authUser.email || user?.email || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (venueError) {
        console.error("Venue creation error:", venueError);
        throw venueError;
      }

      console.log("Venue profile created successfully:", venueData);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Venue Profile</h1>
          <p className="text-muted-foreground">
            Set up your venue profile to start attracting musicians and hosting events
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
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
              <p className="font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Simple Form */}
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">Click the button below to create a simple venue profile:</p>
          <Button 
            onClick={handleCreateVenue}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Creating..." : "Create Venue Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
