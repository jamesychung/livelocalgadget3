import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionForm, useSignOut, useUser } from "@gadgetinc/react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const signOut = useSignOut();
  const user = useUser();

  const navigate = useNavigate();
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn, {
    onSuccess: () => {
      setAuthError("");
      if (gadgetConfig.authentication?.redirectOnSuccessfulSignInPath) {
        navigate(gadgetConfig.authentication.redirectOnSuccessfulSignInPath);
      } else {
        navigate("/signed-in");
      }
    },
    onError: async (error: any) => {
      console.error("Sign-in error:", error);
      
      // Handle specific permission errors
      if (error.message?.includes("signed-in role cannot signIn")) {
        setAuthError("You are already signed in. Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/signed-in");
        }, 2000);
      } else if (error.message?.includes("permission")) {
        setAuthError("Authentication error. Please try again or contact support.");
      } else {
        setAuthError(error.message || "Sign-in failed. Please check your credentials and try again.");
      }
    },
  });
  const { search } = useLocation();

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

  // Show signed-in status if user is already authenticated
  if (user) {
    return (
      <div className="w-[420px]">
        <div className="space-y-8">
          <Card className="p-8">
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    You are already signed in as <strong>{user.email}</strong>
                  </div>
                </AlertDescription>
              </Alert>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You can access your dashboard or sign out below.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => navigate("/signed-in")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await signOut();
                        window.location.reload();
                      } catch (error) {
                        setAuthError("Failed to sign out. Please refresh the page.");
                      }
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
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
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <a href={`/auth/google/start${search}`}>
                  <img
                    className="mr-2 h-4 w-4"
                    src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
                    alt="Google logo"
                  />
                  Continue with Google
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...register("password")}
                      className={errors?.user?.password?.message ? "border-destructive" : ""}
                    />
                    {errors?.user?.password?.message && (
                      <p className="text-sm text-destructive">{errors.user.password.message}</p>
                    )}
                  </div>
                </div>
                
                {authError && (
                  <Alert variant={authError.includes("already signed in") ? "default" : "destructive"}>
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                
                <Button className="w-full" size="lg" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Signing in..." : "Sign in with email"}
                </Button>
                {errors?.root?.message && (
                  <p className="text-sm text-destructive text-center">{errors.root.message}</p>
                )}
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-primary font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="text-center">
                  <Link 
                    to="/forgot-user-id" 
                    className="text-sm text-muted-foreground hover:text-primary font-medium"
                  >
                    Can't find your account?
                  </Link>
                </div>
                <div className="text-center">
                  <Link 
                    to="/help" 
                    className="text-sm text-muted-foreground hover:text-primary font-medium"
                  >
                    Need help?
                  </Link>
                </div>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await signOut();
                        setAuthError("Session cleared. You can now sign in.");
                      } catch (error) {
                        setAuthError("Failed to clear session. Please refresh the page.");
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Clear session
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary hover:underline font-medium">
            Get started →
          </Link>
        </p>
      </div>
    </div>
  );
} 