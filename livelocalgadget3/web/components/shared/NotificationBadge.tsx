import React from "react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../../api";

interface NotificationBadgeProps {
  userId: string;
  className?: string;
  showCount?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  userId, 
  className = "",
  showCount = true 
}) => {
  const [{ data: notifications, fetching, error }] = useFindMany(api.notification, {
    filter: {
      user: { id: { equals: userId } },
      isRead: { equals: false },
      isActive: { equals: true }
    }
  });

  const unreadCount = notifications?.length || 0;

  if (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }

  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className={`inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full ${className}`}>
      {showCount ? (unreadCount > 99 ? "99+" : unreadCount) : ""}
    </div>
  );
}; 