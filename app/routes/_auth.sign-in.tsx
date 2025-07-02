import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { supabase } from "../api";

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      // Get the user's profile
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("Failed to get user information");
        setLoading(false);
        return;
      }
      
      // Check if the user has completed profile setup
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('first_name, last_name, user_type')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        navigate("/profile-setup");
        return;
      }
      
      // Check if profile is complete
      if (!profile.first_name || !profile.last_name || !profile.user_type) {
        navigate("/profile-setup");
        return;
      }
      
      // Redirect based on user type
      if (profile.user_type === "musician") {
        navigate("/musician-dashboard");
      } else if (profile.user_type === "venue") {
        navigate("/venue-dashboard");
      } else {
        navigate("/signed-in");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[420px]">
        <div className="space-y-8">
          <Card className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Login</h1>
                
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full" size="lg" disabled={loading} type="submit">
                    {loading ? "Signing in..." : "Continue with email"}
                  </Button>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <p className="text-sm text-muted-foreground">
                    Forgot your password?{" "}
                    <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                      Reset password
                    </Link>
                  </p>
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
    </div>
  );
}
