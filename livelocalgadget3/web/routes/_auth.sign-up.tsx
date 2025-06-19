import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionForm } from "@gadgetinc/react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [isClient, setIsClient] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");

  const { search } = useLocation();
  const navigate = useNavigate();

  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp, {
    onSuccess: (result: any) => {
      // If email verification is required, show success message
      if (!result.user?.emailVerified) {
        // Don't navigate, let the success message show
        return;
      }
      // If already verified, navigate to the redirect path
      if (gadgetConfig.authentication?.redirectOnSuccessfulSignInPath) {
        navigate(gadgetConfig.authentication.redirectOnSuccessfulSignInPath);
      } else {
        navigate("/signed-in");
      }
    },
  });

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
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
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

  return (
    <div className="w-[420px]">
      <div className="space-y-8">
        <Card className="p-8">
          <form onSubmit={submit}>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <div className="space-y-4">
                {/* First Name */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                      {...register("firstName")}
                      className={errors?.user?.firstName?.message ? "border-destructive" : ""}
                    />
                    {errors?.user?.firstName?.message && (
                      <p className="text-sm text-destructive">{errors.user.firstName.message}</p>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                      {...register("lastName")}
                      className={errors?.user?.lastName?.message ? "border-destructive" : ""}
                    />
                    {errors?.user?.lastName?.message && (
                      <p className="text-sm text-destructive">{errors.user.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...register("email")}
                      className={errors?.user?.email?.message ? "border-destructive" : ""}
                    />
                    {errors?.user?.email?.message && (
                      <p className="text-sm text-destructive">{errors.user.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      {...register("password")}
                      className={errors?.user?.password?.message ? "border-red-500" : ""}
                    />
                    {errors?.user?.password?.message && (
                      <p className="text-sm text-destructive">{errors.user.password.message}</p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="role">I am a...</Label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={(value) => {
                        setSelectedRole(value);
                        // Update the form value for primaryRole
                        const event = {
                          target: { name: "primaryRole", value }
                        } as React.ChangeEvent<HTMLInputElement>;
                        register("primaryRole").onChange(event);
                      }}
                    >
                      <SelectTrigger>
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
                    {errors?.user?.primaryRole?.message && (
                      <p className="text-sm text-destructive">{errors.user.primaryRole.message}</p>
                    )}
                  </div>
                </div>

                {isSubmitSuccessful && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      Account created successfully! Please check your email to verify your account.
                    </p>
                  </div>
                )}
                
                <Button className="w-full" size="lg" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
                
                {errors?.root?.message && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-destructive">{errors.root.message}</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Card>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Already have an account?{" "}
          <Link to="/_auth/sign-in" className="text-primary hover:underline font-medium">
            Login →
          </Link>
        </p>
      </div>
    </div>
  );
}