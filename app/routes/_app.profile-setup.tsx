import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useOutletContext, useNavigate } from 'react-router-dom';
import { api, supabase } from "../api";
import type { AuthOutletContext } from "./_app";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const context = useOutletContext<AuthOutletContext>();
  const user = context?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        userType: user.user_type || ''
      });
      setIsLoading(false);
    } else {
      // If no user in context, try to get from Supabase directly
      const fetchUser = async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (!authUser) {
            navigate('/sign-in');
            return;
          }
          
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (userProfile) {
            setFormData({
              firstName: userProfile.first_name || '',
              lastName: userProfile.last_name || '',
              userType: userProfile.user_type || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleProfileCreation = async (userType: string, userId: string) => {
    try {
      if (userType === "musician") {
        await api.musician.create({
          user: { _link: userId },
          stageName: formData.firstName,
          email: user?.email || '',
          genres: [],
        });
        navigate("/musician-dashboard");
      } else if (userType === "venue") {
        navigate("/venue-profile/create");
      } else {
        navigate("/signed-in");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      return { error };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.userType) newErrors.userType = "Please select a role";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Get current user if not available in context
      let userId = user?.id;
      
      if (!userId) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          throw new Error("User not authenticated");
        }
        userId = authUser.id;
      }

      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: formData.userType
        })
        .eq('id', userId);

      if (error) throw error;

      // Handle profile creation based on user type
      const result = await handleProfileCreation(formData.userType, userId);
      if (result?.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "An error occurred while updating your profile" });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about yourself to get started with LiveLocal
          </p>
        </div>
        
        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors?.firstName ? "border-destructive" : ""}`}
                />
                {errors?.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors?.lastName ? "border-destructive" : ""}`}
                />
                {errors?.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="userType" className="text-sm font-medium">I am a...</Label>
                <Select onValueChange={handleSelectChange} value={formData.userType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musician">Musician</SelectItem>
                    <SelectItem value="venue">Venue Owner</SelectItem>
                    <SelectItem value="fan">Music Fan</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.userType && (
                  <p className="text-sm text-destructive mt-1">{errors.userType}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-2 h-11 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up..." : "Continue"}
            </Button>
            
            {errors?.submit && (
              <p className="text-sm text-destructive mt-1 text-center">{errors.submit}</p>
            )}
          </form>

          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>You can change your role later in your profile settings.</p>
          </div>
        </Card>
      </div>
    </div>
  );
} 
