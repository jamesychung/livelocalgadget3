import React from "react";
import { Card, CardContent } from "../../ui/card";
import { CreateFormContainerProps } from "./types";

export const CreateFormContainer: React.FC<CreateFormContainerProps> = ({ 
  success, 
  error, 
  children 
}) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Venue Profile</h1>
          <p className="text-muted-foreground">
            Set up your venue profile to start attracting musicians and hosting events
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <p className="font-medium">Venue profile created successfully!</p>
            </div>
            <p className="text-green-700 mt-1">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
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

      {/* Form Content */}
      <Card>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}; 