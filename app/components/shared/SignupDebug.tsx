import { useState, useEffect } from "react";
import { api } from "../../api";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";

export default function SignupDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const testCreateUser = async () => {
    if (!isClient) return;
    
    setIsLoading(true);
    setError("");
    setResult(null);

    const testData = {
      email: `test-${Date.now()}@example.com`,
      firstName: "Test",
      lastName: "User",
      role: "consumer" as const,
      phone: "555-123-4567",
      location: "Test City, TS",
      bio: "Test user for debugging",
      profilePicture: ""
    };

    try {
      console.log("Testing createUser action with data:", testData);
      
      // Test the custom action
      const actionResult = await (api as any).createUser(testData);
      console.log("Action result:", actionResult);
      
      setResult({
        type: "action",
        data: testData,
        result: actionResult
      });
    } catch (err: any) {
      console.error("Action test failed:", err);
      setError(`Action test failed: ${err.message}`);
      
      // Try direct creation as fallback
      try {
        console.log("Trying direct user creation...");
        const directResult = await (api as any).user.create(testData);
        console.log("Direct creation result:", directResult);
        
        setResult({
          type: "direct",
          data: testData,
          result: directResult
        });
      } catch (directErr: any) {
        console.error("Direct creation also failed:", directErr);
        setError(`Both methods failed. Action: ${err.message}, Direct: ${directErr.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Test basic API connection
      console.log("Testing API connection...");
      console.log("API object:", api);
      console.log("API methods:", Object.keys(api));
      
      if ((api as any).user) {
        console.log("User methods:", Object.keys((api as any).user));
      }
      
      if ((api as any).createUser) {
        console.log("createUser action exists");
      }
      
      setResult({
        type: "connection",
        apiKeys: Object.keys(api),
        userMethods: (api as any).user ? Object.keys((api as any).user) : "No user object",
        hasCreateUser: !!(api as any).createUser
      });
    } catch (err: any) {
      console.error("API connection test failed:", err);
      setError(`API connection test failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Signup Debug Tools</CardTitle>
        <CardDescription>
          Test the signup functionality and API connections
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <Alert>
            <AlertDescription>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={testApiConnection}
            disabled={isLoading || !isClient}
            variant="outline"
          >
            {isLoading ? "Testing..." : "Test API Connection"}
          </Button>
          
          <Button 
            onClick={testCreateUser}
            disabled={isLoading || !isClient}
          >
            {isLoading ? "Creating..." : "Test Create User"}
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Check the browser console for detailed logs.</p>
          <p>This will help identify where the signup process is failing.</p>
        </div>
      </CardContent>
    </Card>
  );
} 
