import React from "react";
import { Button } from "../ui/button";
import { Eye, Edit } from "lucide-react";

interface EventActionsProps {
    onView: () => void;
    onEdit: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function EventActions({ 
    onView, 
    onEdit, 
    variant = "outline", 
    size = "sm",
    className = ""
}: EventActionsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button
                variant={variant}
                size={size}
                onClick={onView}
                className="flex items-center gap-1"
            >
                <Eye className="h-4 w-4" />
                View
            </Button>
            <Button
                variant={variant}
                size={size}
                onClick={onEdit}
                className="flex items-center gap-1"
            >
                <Edit className="h-4 w-4" />
                Edit
            </Button>
        </div>
    );
} 