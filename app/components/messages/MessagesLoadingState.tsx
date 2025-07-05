import React from "react";
import { Loader2 } from "lucide-react";

export function MessagesLoadingState() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading messages...</span>
      </div>
    </div>
  );
} 