import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EventHistoryViewer } from "./EventHistoryViewer";

interface VenueEventHistoryTabProps {
  eventId: string;
}

export const VenueEventHistoryTab: React.FC<VenueEventHistoryTabProps> = ({ eventId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event History</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track all changes and activity for this event
        </p>
      </CardHeader>
      <CardContent>
        <EventHistoryViewer eventId={eventId} />
      </CardContent>
    </Card>
  );
}; 
