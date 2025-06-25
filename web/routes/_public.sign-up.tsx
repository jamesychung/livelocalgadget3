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
  const [selectedRole, setSelectedRole] = useState("regular_user");

  const { search } = useLocation();
  const navigate = useNavigate();

  const {
    submit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp, {
    onSuccess: (result: any) => {
      console.log("Signup result:", result);
      // Redirect to profile setup page
      setTimeout(() => {
        window.location.href = "/profile-setup";
      }, 2000);
    },
  });

  // Set the role value when it changes
  useEffect(() => {
    setValue("primaryRole", selectedRole);
  }, [selectedRole, setValue]);

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

  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <div className="w-[420px]">
        <div className="space-y-8">
          <Card className="p-8">
            <form onSubmit={submit}>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
                <div className="space-y-4">
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
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={selectedRole}
                        onValueChange={(value) => setSelectedRole(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="musician">Musician</SelectItem>
                          <SelectItem value="venue">Venue Owner</SelectItem>
                          <SelectItem value="user">Regular User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isSubmitSuccessful && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">
                        Account created successfully! Redirecting to profile setup...
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Please check your email to verify your account for full access.
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={isSubmitting} 
                    type="submit"
                  >
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
            <Link to="/sign-in" className="text-primary hover:underline font-medium">
              Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 