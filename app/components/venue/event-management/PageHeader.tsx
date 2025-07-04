import React from "react";
import { Button } from "../../ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Event Management",
  subtitle = "Manage event details, bookings, and communications"
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link to="/venue-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}; 