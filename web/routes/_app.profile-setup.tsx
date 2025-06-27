import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOutletContext, useNavigate } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { useActionForm } from "@gadgetinc/react";

export default function ProfileSetupPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    submit,
    setValue,
    getValues,
    formState: { errors },
  } = useActionForm(api.user.update, {
    defaultValues: user,
    onSuccess: async () => {
      const { userType } = getValues();
      await handleProfileCreation(userType);
    },
    send: ["firstName", "lastName", "userType"],
  });

  const handleProfileCreation = async (userType: string) => {
    setIsSubmitting(true);

    try {
      if (userType === "musician") {
        await api.musician.create({
          user: { _link: user.id },
          stageName: user.firstName,
          email: user.email,
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
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                  className={errors?.firstName?.message ? "border-destructive" : ""}
                />
                {errors?.firstName?.message && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                  className={errors?.lastName?.message ? "border-destructive" : ""}
                />
                {errors?.lastName?.message && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="userType">I am a...</Label>
                <Select onValueChange={(value) => setValue("userType", value)}>
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
                disabled={isSubmitting}
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