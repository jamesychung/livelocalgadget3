import React from "react";
import { Badge } from "../ui/badge";

interface EventStatusBadgeProps {
    status: string | null | undefined;
    className?: string;
    showIcon?: boolean;
}

export function EventStatusBadge({ 
    status, 
    className = "",
    showIcon = false 
}: EventStatusBadgeProps) {
    const getStatusInfo = (status: string | null | undefined) => {
        if (!status) {
            return {
                className: "bg-gray-100 text-gray-800",
                text: "No Status"
            };
        }
        
        const statusColors: Record<string, { className: string; text: string }> = {
            draft: {
                className: "bg-gray-100 text-gray-800",
                text: "Draft"
            },
            confirmed: {
                className: "bg-green-100 text-green-800",
                text: "Confirmed"
            },
            selected: {
                className: "bg-yellow-100 text-yellow-800", 
                text: "Musician Selected"
            },
            pending_review: {
                className: "bg-orange-100 text-orange-800",
                text: "Pending Review"
            },
            proposed: {
                className: "bg-yellow-100 text-yellow-800", 
                text: "Proposed"
            },
            cancelled: {
                className: "bg-red-100 text-red-800",
                text: "Cancelled"
            },
            open: {
                className: "bg-blue-100 text-blue-800",
                text: "Open"
            },
            pending_confirmation: {
                className: "bg-orange-100 text-orange-800",
                text: "Pending Confirmation"
            },
            pending_cancel: {
                className: "bg-red-100 text-red-800",
                text: "Pending Cancel"
            },
            completed: {
                className: "bg-emerald-100 text-emerald-800",
                text: "Completed"
            }
        };
        
        return statusColors[status] || {
            className: "bg-gray-100 text-gray-800",
            text: status.charAt(0).toUpperCase() + status.slice(1)
        };
    };

    const statusInfo = getStatusInfo(status);

    return (
        <Badge className={`${statusInfo.className} ${className}`}>
            {statusInfo.text}
        </Badge>
    );
}

// Convenience function for backward compatibility
export function getStatusBadge(status: string | null | undefined) {
    const statusInfo = (() => {
        if (!status) {
            return {
                className: "bg-gray-100 text-gray-800",
                text: "No Status"
            };
        }
        
        const statusColors: Record<string, { className: string; text: string }> = {
            draft: {
                className: "bg-gray-100 text-gray-800",
                text: "Draft"
            },
            confirmed: {
                className: "bg-green-100 text-green-800",
                text: "Confirmed"
            },
            selected: {
                className: "bg-yellow-100 text-yellow-800", 
                text: "Musician Selected"
            },
            pending_review: {
                className: "bg-orange-100 text-orange-800",
                text: "Pending Review"
            },
            proposed: {
                className: "bg-yellow-100 text-yellow-800", 
                text: "Proposed"
            },
            cancelled: {
                className: "bg-red-100 text-red-800",
                text: "Cancelled"
            },
            open: {
                className: "bg-blue-100 text-blue-800",
                text: "Open"
            },
            pending_confirmation: {
                className: "bg-orange-100 text-orange-800",
                text: "Pending Confirmation"
            },
            pending_cancel: {
                className: "bg-red-100 text-red-800",
                text: "Pending Cancel"
            },
            completed: {
                className: "bg-emerald-100 text-emerald-800",
                text: "Completed"
            }
        };
        
        return statusColors[status] || {
            className: "bg-gray-100 text-gray-800",
            text: status.charAt(0).toUpperCase() + status.slice(1)
        };
    })();

    return statusInfo;
} 