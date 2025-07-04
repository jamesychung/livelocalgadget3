import React from "react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "./EventStatusBadge";

interface CalendarEventItemProps {
  event: any;
  onClick?: (event: any) => void;
}

export const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ event, onClick }) => {
  return (
    <div
      className="text-xs p-1 bg-white rounded border cursor-pointer hover:bg-gray-50"
      onClick={() => onClick?.(event)}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-muted-foreground truncate">
        {event.startTime} - {event.musician && (
          <Link
            to={`/musician/${event.musician.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {event.musician.stageName}
          </Link>
        )}
      </div>
      <div className="flex items-center gap-1">
        <EventStatusBadge status={event.eventStatus} />
      </div>
    </div>
  );
}; 