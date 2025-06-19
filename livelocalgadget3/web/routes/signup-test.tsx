import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionForm } from "@gadgetinc/react";
import { useState } from "react";
import { api } from "../api";
import { Link } from "react-router";

export default function SignupTest() {
  const [testResult, setTestResult] = useState<any>(null);

  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp, {
    onSuccess: (result: any) => {
      setTestResult({
        success: true,
        message: "Sign-up successful!",
        data: result,
        emailVerified: result.user?.emailVerified
      });
    },
    onError: (error: any) => {
      setTestResult({
        success: false,
        message: "Sign-up failed",
        error: error
      });
    }
  });

  const testSignUp = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";
    
    try {
      const result = await api.user.signUp({
        email: testEmail,
        password: testPassword
      });
      
      setTestResult({
        success: true,
        message: "Direct API call successful!",
        data: result,
        emailVerified: result.user?.emailVerified
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: "Direct API call failed",
        error: error.message
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Sign-up Test Page</CardTitle>
          <CardDescription>
            Test the sign-up functionality using Gadget's built-in authentication
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Manual Form Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Manual Form Test</h3>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors?.user?.email?.message ? "border-destructive" : ""}
                />
                {errors?.user?.email?.message && (
                  <p className="text-sm text-destructive">{errors.user.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors?.user?.password?.message ? "border-destructive" : ""}
                />
                {errors?.user?.password?.message && (
                  <p className="text-sm text-destructive">{errors.user.password.message}</p>
                )}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
              
              {errors?.root?.message && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </div>

          {/* Direct API Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Direct API Test</h3>
            <Button onClick={testSignUp} variant="outline">
              Test Direct API Call
            </Button>
          </div>

          {/* Results */}
          {testResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {testResult.message}</p>
                    {testResult.emailVerified !== undefined && (
                      <p><strong>Email Verified:</strong> {testResult.emailVerified ? "Yes" : "No"}</p>
                    )}
                    {testResult.error && (
                      <p><strong>Error:</strong> {testResult.error}</p>
                    )}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm">View Full Response</summary>
                      <pre className="text-xs mt-2 overflow-auto bg-gray-100 p-2 rounded">
                        {JSON.stringify(testResult.data || testResult.error, null, 2)}
                      </pre>
                    </details>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <Link to="/sign-up" className="text-primary hover:underline">
                Go to actual sign-up page →
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 