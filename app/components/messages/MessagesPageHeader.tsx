import React from "react";
import { Badge } from "../ui/badge";
import { Mail } from "lucide-react";

interface MessagesPageHeaderProps {
  totalUnreadMessages: number;
}

export function MessagesPageHeader({ totalUnreadMessages }: MessagesPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with musicians about your events</p>
      </div>
      {totalUnreadMessages > 0 && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Mail className="h-4 w-4" />
          {totalUnreadMessages} unread
        </Badge>
      )}
    </div>
  );
} 