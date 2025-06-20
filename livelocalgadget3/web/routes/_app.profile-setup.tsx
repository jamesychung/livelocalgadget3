import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@gadgetinc/react";
import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router";

export default function ProfileSetup() {
  const [isClient, setIsClient] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useUser();

  // Ensure we're on the client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="w-[420px]">
        <div className="space-y-8">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // If no user is found, redirect to sign in
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
              <Button onClick={() => navigate("/sign-in")}>
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
      // Call the update action with the user ID
      const result = await api.user.update(user.id, {
        firstName,
        lastName,
        primaryRole: selectedRole
      });
      
      console.log("Profile setup result:", result);
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
                        Choose your role carefully - this cannot be changed after setup
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
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-xs text-amber-700">
                          ⚠️ <strong>Important:</strong> Your role selection is permanent and cannot be changed after setup. 
                          Choose the role that best represents how you'll use the platform.
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
                  
                  {/* Debug button to show form values */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
                      console.log("Form data:", {
                        firstName: formData.get("firstName"),
                        lastName: formData.get("lastName"),
                        selectedRole
                      });
                      console.log("Current user:", user);
                      alert(`Form data: ${JSON.stringify({
                        firstName: formData.get("firstName"),
                        lastName: formData.get("lastName"),
                        selectedRole
                      }, null, 2)}\nUser ID: ${user.id}`);
                    }}
                  >
                    Debug: Show Form Values
                  </Button>
                  
                  {/* Debug display */}
                  <div className="p-3 bg-gray-100 rounded text-xs">
                    <p><strong>Debug Info:</strong></p>
                    <p>Selected Role: {selectedRole}</p>
                    <p>User ID: {user.id}</p>
                    <p>User Email: {user.email}</p>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 