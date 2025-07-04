import React from "react";
import { Badge } from "../../../components/ui/badge";

/**
 * Get status badge styling
 */
export const getStatusBadgeClass = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    applied: "bg-blue-100 text-blue-800",
    selected: "bg-orange-100 text-orange-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    open: "bg-green-100 text-green-800",
    invited: "bg-purple-100 text-purple-800",
    pending_cancel: "bg-orange-100 text-orange-800",
  };
  return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

interface StatusBadgeProps {
  status: string;
}

/**
 * Status badge component
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge className={getStatusBadgeClass(status)}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </Badge>
  );
}; 