import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { LoadingStateProps } from "./types";

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading profile..." }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded">{message}</div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 