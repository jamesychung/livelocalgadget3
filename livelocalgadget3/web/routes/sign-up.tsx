import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActionForm } from "@gadgetinc/react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [isClient, setIsClient] = useState(false);

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
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[420px]">
      <div className="space-y-8">
        <Card className="p-8">
          <form onSubmit={submit}>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <a href={`/auth/google/start${search}`}>
                  <img
                    className="mr-2 h-4 w-4"
                    src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
                    alt="Google logo"
                  />
                  Sign up with Google
                </a>
              </Button>
              <Separator />
              <div className="space-y-4">
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
                {isSubmitSuccessful && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      Account created successfully! Please check your email to verify your account.
                    </p>
                  </div>
                )}
                <Button className="w-full" size="lg" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Creating account..." : "Sign up with email"}
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
  );
} 