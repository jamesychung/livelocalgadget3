import React from "react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "./EventStatusBadge";
import { Badge } from "../ui/badge";
import { CheckCircle, Users, Clock } from "lucide-react";

interface CalendarEventItemProps {
  event: any;
  onClick?: (event: any) => void;
}

export const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ event, onClick }) => {
  // Determine the background color based on booking status
  const getEventBackgroundColor = () => {
    if (event.hasConfirmedBooking) {
      return "bg-green-50 border-green-200 hover:bg-green-100";
    }
    if (event.pendingApplications > 0) {
      return "bg-orange-50 border-orange-200 hover:bg-orange-100";
    }
    return "bg-white border-gray-200 hover:bg-gray-50";
  };

  return (
    <div
      className={`text-xs p-1 rounded border cursor-pointer transition-colors ${getEventBackgroundColor()}`}
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
      
      {/* Booking Status Indicators */}
      <div className="flex items-center gap-1 mt-1">
        <EventStatusBadge status={event.eventStatus} />
        
        {/* Confirmed Booking Indicator */}
        {event.hasConfirmedBooking && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="h-2 w-2 mr-1" />
            Booked
          </Badge>
        )}
        
        {/* Pending Applications Indicator */}
        {event.pendingApplications > 0 && !event.hasConfirmedBooking && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Clock className="h-2 w-2 mr-1" />
            {event.pendingApplications}
          </Badge>
        )}
        
        {/* Total Applications Indicator */}
        {event.confirmedBookings + event.pendingApplications > 0 && (
          <Badge variant="outline" className="text-xs">
            <Users className="h-2 w-2 mr-1" />
            {event.confirmedBookings + event.pendingApplications}
          </Badge>
        )}
      </div>
    </div>
  );
}; 