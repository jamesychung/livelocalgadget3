import React from "react";
import { Badge } from "../ui/badge";

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
}

export function NotificationBadge({ count, maxCount = 99, className = "" }: NotificationBadgeProps) {
  if (count === 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium ${className}`}
    >
      {displayCount}
    </Badge>
  );
} 