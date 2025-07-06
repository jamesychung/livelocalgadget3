import React from "react";
import { Link } from "react-router-dom";

import { Badge } from "../ui/badge";
import { CheckCircle, Users, Clock, AlertTriangle, XCircle, Star } from "lucide-react";

interface CalendarEventItemProps {
  event: any;
  onClick?: (event: any) => void;
}

export const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ event, onClick }) => {
  // Get the primary booking status for this event
  const getPrimaryBookingStatus = () => {
    // If we have bookings data, find the most relevant status
    if (event.bookings && event.bookings.length > 0) {
      // Priority order: cancelled, pending_cancel, confirmed, selected, applied
      const statusPriority = ['cancelled', 'pending_cancel', 'confirmed', 'selected', 'applied'];
      
      for (const status of statusPriority) {
        const bookingWithStatus = event.bookings.find((booking: any) => booking.status === status);
        if (bookingWithStatus) {
          return { status, booking: bookingWithStatus };
        }
      }
    }
    
    // If no bookings exist, show event status (Open Event or Invited Event)
    // Fallback to event status indicators for events without applications
    if (event.hasConfirmedBooking) return { status: 'confirmed', booking: null };
    if (event.pendingApplications > 0) return { status: 'applied', booking: null };
    
    // No applications yet - show event status
    return { status: event.eventStatus || 'open', booking: null };
  };

  // Determine the background color based on booking status
  const getEventBackgroundColor = (primaryStatus: string) => {
    switch (primaryStatus) {
      case 'confirmed':
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case 'pending_cancel':
        return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      case 'cancelled':
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case 'selected':
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case 'applied':
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case 'completed':
        return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      case 'open':
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
      case 'invited':
        return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100";
      default:
        return "bg-white border-gray-200 hover:bg-gray-50";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-2 w-2" />;
      case 'pending_cancel':
        return <AlertTriangle className="h-2 w-2" />;
      case 'cancelled':
        return <XCircle className="h-2 w-2" />;
      case 'selected':
        return <Star className="h-2 w-2" />;
      case 'applied':
        return <Clock className="h-2 w-2" />;
      case 'completed':
        return <CheckCircle className="h-2 w-2" />;
      case 'open':
        return <Users className="h-2 w-2" />;
      case 'invited':
        return <Users className="h-2 w-2" />;
      default:
        return null;
    }
  };

  const primaryBookingStatus = getPrimaryBookingStatus();
  const backgroundColor = getEventBackgroundColor(primaryBookingStatus.status);

  return (
    <div
      className={`text-xs p-1 rounded border cursor-pointer transition-colors ${backgroundColor}`}
      onClick={() => onClick?.(event)}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-muted-foreground truncate">
        {event.startTime} {event.musician && (
          <Link
            to={`/musician/${event.musician.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            - {event.musician.stageName}
          </Link>
        )}
      </div>
      
      {/* Primary Booking Status */}
      <div className="flex items-center gap-1 mt-1">
        <Badge variant="secondary" className="text-xs flex items-center gap-1">
          {getStatusIcon(primaryBookingStatus.status)}
          {primaryBookingStatus.status === 'pending_cancel' ? 'Cancel Pending' :
           primaryBookingStatus.status === 'confirmed' ? 'Confirmed' :
           primaryBookingStatus.status === 'cancelled' ? 'Cancelled' :
           primaryBookingStatus.status === 'selected' ? 'Selected' :
           primaryBookingStatus.status === 'applied' ? 'Applied' :
           primaryBookingStatus.status === 'completed' ? 'Completed' :
           primaryBookingStatus.status === 'open' ? 'Open Event' :
           primaryBookingStatus.status === 'invited' ? 'Invited Event' :
           'Open Event'}
        </Badge>
        
        {/* Additional booking count if there are multiple bookings */}
        {(event.confirmedBookings + event.pendingApplications > 1) && (
          <Badge variant="outline" className="text-xs">
            <Users className="h-2 w-2 mr-1" />
            {event.confirmedBookings + event.pendingApplications}
          </Badge>
        )}
      </div>
    </div>
  );
}; 