import React from "react";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
    onRefresh: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function RefreshButton({ 
    onRefresh, 
    variant = "outline", 
    size = "sm",
    className = ""
}: RefreshButtonProps) {
    return (
        <Button 
            variant={variant} 
            size={size} 
            onClick={onRefresh}
            className={className}
        >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
        </Button>
    );
} 