import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@gadgetinc/react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";

export default function () {
  const [isClient, setIsClient] = useState(false);

  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

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
          {isSubmitSuccessful ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Password reset email has been sent. Please check your inbox and follow the instructions.
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link 
                  to="/sign-in" 
                  className="text-primary hover:underline font-medium"
                >
                  ← Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
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
                  {errors?.root?.message && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.root.message}</AlertDescription>
                    </Alert>
                  )}
                  <Button className="w-full" size="lg" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Sending..." : "Send reset link"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card>
        <div className="text-center">
          <Link 
            to="/sign-in" 
            className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}