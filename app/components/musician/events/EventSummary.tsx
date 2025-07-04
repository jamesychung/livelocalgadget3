import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Clock, Music, Calendar } from "lucide-react";
import { EventSummaryProps } from './types';

export const EventSummary: React.FC<EventSummaryProps> = ({
  invitedEvents,
  openEvents,
  totalEvents
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invited Events</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{invitedEvents}</div>
          <p className="text-xs text-muted-foreground">
            Invited to events
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Events</CardTitle>
          <Music className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{openEvents}</div>
          <p className="text-xs text-muted-foreground">
            Open events
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            All events
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 