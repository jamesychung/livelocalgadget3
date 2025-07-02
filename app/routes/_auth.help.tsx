import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Mail, Lock, User, HelpCircle } from "lucide-react";
import { Link } from 'react-router-dom';

export default function AuthHelp() {
  return (
    <div className="w-[600px]">
      <div className="space-y-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <HelpCircle className="h-8 w-8" />
              Authentication Help
            </CardTitle>
            <CardDescription>
              Need help signing in or creating an account? We're here to help.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Can't find your account?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you can't remember if you have an account, we can help you find it.
                    </p>
                    <Link to="/forgot-user-id">
                      <Button variant="outline" size="sm">
                        Find my account
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Forgot your password?</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll send you a secure link to reset your password.
                    </p>
                    <Link to="/forgot-password">
                      <Button variant="outline" size="sm">
                        Reset password
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Need to verify your email?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you haven't received a verification email, we can resend it.
                    </p>
                    <Link to="/forgot-user-id">
                      <Button variant="outline" size="sm">
                        Resend verification
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Other options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Don't have an account?</span>
                  <Link to="/sign-up">
                    <Button variant="outline" size="sm">
                      Create account
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Remember your credentials?</span>
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
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
