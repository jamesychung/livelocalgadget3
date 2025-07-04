import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Calendar } from "lucide-react";
import { Event } from "./types";

interface EventSelectionProps {
  events: Event[];
  selectedEvents: string[];
  handleEventSelection: (eventId: string, checked: boolean) => void;
}

export const EventSelection: React.FC<EventSelectionProps> = ({
  events,
  selectedEvents,
  handleEventSelection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => 
                      handleEventSelection(event.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.start_time} - {event.end_time}
                    </p>
                    {event.genres && event.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.genres.map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No events available for invitations</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create events first to invite musicians
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 