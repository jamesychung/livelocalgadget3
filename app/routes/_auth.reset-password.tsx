import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useActionForm } from "@gadgetinc/react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { api } from "../api";
import type { RootOutletContext } from "../root";

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const { gadgetConfig } = useOutletContext<RootOutletContext>();

  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: {
      code: new URLSearchParams(location.search).get("code"),
      password: "",
      confirmPassword: "",
    },
    onSuccess: () => {
      // Redirect to sign-in after successful password reset
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    },
  });

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
            <form onSubmit={submit}>
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
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...register("password")}
                        className={errors?.user?.password?.message ? "border-destructive" : ""}
                      />
                      {errors?.user?.password?.message && (
                        <p className="text-sm text-destructive">{errors.user.password.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                        className={errors?.confirmPassword?.message ? "border-destructive" : ""}
                      />
                      {errors?.confirmPassword?.message && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                  {errors?.root?.message && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.root.message}</AlertDescription>
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
