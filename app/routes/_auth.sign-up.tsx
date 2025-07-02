import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { supabase } from "../api";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setIsSubmitSuccessful(true);
        
        // Listen for auth state change (email verification)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event);
          
          if (event === 'SIGNED_IN' && session) {
            console.log("User signed in after verification");
            subscription.unsubscribe();
            navigate("/profile-setup");
          }
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[420px]">
      <div className="space-y-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Get started</h1>
              
              {/* Google Sign Up - TODO: Implement Supabase Google OAuth */}
              <Button variant="outline" size="lg" className="w-full" disabled>
                <img
                  className="mr-2 h-4 w-4"
                  src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
                  alt="Google logo"
                />
                Sign up with Google (Coming Soon)
              </Button>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {isSubmitSuccessful && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 font-medium">Account created!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Please check your email to verify your account. After verification, you'll be redirected to complete your profile.
                    </p>
                  </div>
                )}
                
                <Button className="w-full" size="lg" disabled={loading || isSubmitSuccessful} type="submit">
                  {loading ? "Creating account..." : "Sign up with email"}
                </Button>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
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
