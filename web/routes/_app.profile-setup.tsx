import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOutletContext } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function ProfileSetup() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen py-12">
        <div className="w-[420px]">
          <Card className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to complete your profile setup.
              </p>
              <Button onClick={() => window.location.href = "/sign-in"}>
                Sign In
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const roles = [
    { value: "user", label: "User (Fan/Consumer)", description: "Browse events, follow artists and venues" },
    { value: "musician", label: "Musician", description: "Get booked, manage profile, promote yourself" },
    { value: "venue", label: "Venue Owner", description: "Find musicians, manage events, promote venue" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    try {
      // Update user's name first
      await api.user.update(user.id, {
        firstName,
        lastName
      });
      
      // Create profile based on selected role
      if (selectedRole === "musician") {
        await api.musician.create({
          user: { _link: user.id },
          name: `${firstName} ${lastName}`,
          email: user.email,
          isActive: true
        });
      } else if (selectedRole === "venue") {
        await api.venue.create({
          owner: { _link: user.id },
          name: `${firstName} ${lastName}`,
          email: user.email,
          isActive: true
        });
      }
      
      console.log("Profile setup complete");
      setIsSubmitSuccessful(true);
      
      // Redirect based on role
      setTimeout(() => {
        if (selectedRole === "musician") {
          window.location.href = "/musician-dashboard";
        } else if (selectedRole === "venue") {
          window.location.href = "/venue-dashboard";
        } else {
          window.location.href = "/signed-in";
        }
      }, 2000);
    } catch (error: any) {
      console.error("Profile setup error:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <div className="w-[420px]">
        <div className="space-y-8">
          <Card className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
                  <p className="text-muted-foreground mt-2">
                    Tell us a bit about yourself to get started
                  </p>
                </div>

                <div className="space-y-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="role" className="text-base font-medium">I am a...</Label>
                      <div className="text-sm text-muted-foreground mb-3">
                        Choose your role to create your profile
                      </div>
                      <Select 
                        value={selectedRole} 
                        onValueChange={(value) => {
                          setSelectedRole(value);
                          console.log("Role changed to:", value);
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.label}</span>
                                <span className="text-xs text-muted-foreground">{role.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-700">
                          ℹ️ <strong>Note:</strong> This will create a profile for you based on your role selection. 
                          You can always create additional profiles later.
                        </p>
                      </div>
                    </div>
                  </div>

                  {isSubmitSuccessful && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">
                        Profile setup complete! Redirecting to your dashboard...
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={isSubmitting} 
                    type="submit"
                  >
                    {isSubmitting ? "Setting up profile..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 