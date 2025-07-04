import React from "react";
import { LoadingStateProps } from "./types";

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading venue profile..." }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}; 