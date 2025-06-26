import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionForm } from "@gadgetinc/react";
import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function RoleSelectionPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    submit,
    formState: { errors },
  } = useActionForm(api.user.update, {
    defaultValues: user,
    onSuccess: () => {
      // After updating user info, create profile based on role
      handleRoleAssignment();
    },
    send: ["firstName", "lastName"],
  });

  const handleRoleAssignment = async () => {
    setIsSubmitting(true);
    
    try {
      if (selectedRole === "musician") {
        // Create musician profile
        await api.musician.create({
          user: { _link: user.id },
          name: `${user.firstName} ${user.lastName}`,
          stageName: user.firstName,
          email: user.email,
        });
        navigate("/musician-dashboard");
      } else if (selectedRole === "venue") {
        // Create venue profile
        await api.venue.create({
          owner: { _link: user.id },
          name: `${user.firstName}'s Venue`,
          email: user.email,
        });
        navigate("/venue-dashboard");
      } else if (selectedRole === "fan") {
        // Just update user info, no additional profile needed
        navigate("/signed-in");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      // Handle error - maybe show a message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }
    submit(e);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <p className="text-muted-foreground mt-2">
                Tell us about yourself to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                  className={errors?.user?.firstName?.message ? "border-destructive" : ""}
                />
                {errors?.user?.firstName?.message && (
                  <p className="text-sm text-destructive mt-1">{errors.user.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                  className={errors?.user?.lastName?.message ? "border-destructive" : ""}
                />
                {errors?.user?.lastName?.message && (
                  <p className="text-sm text-destructive mt-1">{errors.user.lastName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">I am a...</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musician">Musician</SelectItem>
                    <SelectItem value="venue">Venue Owner</SelectItem>
                    <SelectItem value="fan">Music Fan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !selectedRole}
              >
                {isSubmitting ? "Setting up..." : "Continue"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>You can change your role later in your profile settings.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 