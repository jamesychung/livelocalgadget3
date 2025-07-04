import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: new URLSearchParams(location.search).get("code") || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        setErrors({ root: error.message });
      } else {
        setIsSubmitSuccessful(true);
        // Redirect to sign-in after successful password reset
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    } catch (error: any) {
      setErrors({ root: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="w-[420px]">
      <div className="space-y-8">
        <Card className="p-8">
          {isSubmitSuccessful ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Password reset successfully! Redirecting you to sign in...
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link 
                  to="/sign-in" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in now
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
                  <p className="text-muted-foreground">
                    Enter your new password below.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="password">New password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors?.password ? "border-destructive" : ""}
                      />
                      {errors?.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors?.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors?.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  {errors?.root && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.root}</AlertDescription>
                    </Alert>
                  )}
                  <Button className="w-full" size="lg" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Resetting..." : "Reset password"}
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
