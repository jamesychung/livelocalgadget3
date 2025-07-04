import React from "react";
import { Badge } from "../../../components/ui/badge";

// Helper function to render status badges
export function getStatusBadge(status: string) {
  const statusColors: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800",
    selected: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
    pending_cancel: "bg-orange-100 text-orange-800",
  };
  
  const statusLabels: Record<string, string> = {
    applied: "📝 Applied",
    selected: "⭐ Venue Selected You",
    confirmed: "✅ Confirmed",
    cancelled: "❌ Cancelled",
    completed: "🎉 Completed",
    pending_cancel: "⏳ Cancel Requested",
  };
  
  return (
    <Badge className={statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800"}>
      {statusLabels[status?.toLowerCase()] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown")}
    </Badge>
  );
}

// Helper to format date/time
export function formatDateTime(dateTime: string | Date | null | undefined) {
  if (!dateTime) return "No date provided";
  return new Date(dateTime).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

// Helper to format date only
export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "No date provided";
  return new Date(date).toLocaleDateString();
}

// Helper to format time range
export function formatTimeRange(startTime?: string, endTime?: string) {
  if (!startTime || !endTime) return "Time TBD";
  return `${startTime} - ${endTime}`;
} 