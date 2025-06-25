import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@gadgetinc/react";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router";
import { api } from "../api";

export default function () {
  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendVerifyEmail, {
    onSuccess: () => {
      // This will send a verification email which can help users find their account
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
                  If an account exists with this email, we've sent you a verification email. Check your inbox to confirm your account.
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
                  <h1 className="text-3xl font-bold tracking-tight">Find your account</h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll help you find your account.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email address</Label>
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
                    {isSubmitting ? "Sending..." : "Find account"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card>
        <div className="space-y-4">
          <div className="text-center">
            <Link 
              to="/sign-in" 
              className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
          <div className="text-center">
            <Link 
              to="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Forgot password instead?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 