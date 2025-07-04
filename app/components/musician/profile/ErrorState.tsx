import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";

interface ErrorStateProps {
  error: string | null;
  navigate: (path: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, navigate }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader><CardTitle>Something went wrong</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button onClick={() => navigate("/musician-dashboard")}>Back to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 