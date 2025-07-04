import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NoProfileStateProps {
  error: string | null;
  navigate: (path: string) => void;
}

export const NoProfileState: React.FC<NoProfileStateProps> = ({ error, navigate }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>No Profile Found</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/musician-dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/musician-profile/create")}>
              Create Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 