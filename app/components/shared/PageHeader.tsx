import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: {
    text: string;
    href: string;
  };
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButton,
  actions,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {backButton && (
        <Button variant="ghost" size="sm" asChild>
          <Link to={backButton.href} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            {backButton.text}
          </Link>
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}; 