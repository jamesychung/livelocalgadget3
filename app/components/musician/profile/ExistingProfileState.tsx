import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowLeft } from "lucide-react";
import { ExistingProfileStateProps } from "./types";

export const ExistingProfileState: React.FC<ExistingProfileStateProps> = ({ error, navigate }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Already Exists</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/musician-dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/musician-profile/edit")}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 