import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { StatusMessage as StatusMessageType } from "./types";

interface StatusMessageProps {
  message: StatusMessageType | null;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-lg border ${
      message.type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center gap-2">
        {message.type === 'success' ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <span>{message.text}</span>
      </div>
    </div>
  );
}; 