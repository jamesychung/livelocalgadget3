import React from "react";
import { Card, CardContent } from "../ui/card";

interface MessagesErrorStateProps {
  error: { message: string };
}

export function MessagesErrorState({ error }: MessagesErrorStateProps) {
  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error loading messages</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 