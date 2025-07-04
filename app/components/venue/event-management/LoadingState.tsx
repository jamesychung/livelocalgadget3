import React from "react";

interface LoadingStateProps {
  message?: string;
  title?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Please wait while we fetch the event information.",
  title = "Loading Event Data..."
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}; 