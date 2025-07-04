import React from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  musicianCount: number;
  eventCount: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  musicianCount,
  eventCount
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/venue-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Invite Musicians</h1>
          <p className="text-muted-foreground">
            Select musicians to invite to your events
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {musicianCount} Musicians
        </Badge>
        <Badge variant="secondary">
          {eventCount} Events
        </Badge>
      </div>
    </div>
  );
}; 