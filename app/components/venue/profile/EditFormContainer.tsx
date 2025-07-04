import React, { ReactNode } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditFormContainerProps {
  success: boolean;
  error: string | null;
  navigate: (path: string) => void;
  children: ReactNode;
}

export const EditFormContainer: React.FC<EditFormContainerProps> = ({ 
  success, 
  error, 
  navigate,
  children 
}) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/venue-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Venue Profile</h1>
            <p className="text-muted-foreground">
              Update your venue information and settings
            </p>
          </div>
        </div>
      </div>

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <p className="font-medium">Venue profile updated successfully!</p>
            </div>
            <p className="text-green-700 mt-1">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <p className="font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}; 