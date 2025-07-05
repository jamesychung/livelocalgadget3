import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { OverviewTabProps, Booking, Event } from "./types";
import { formatDate } from "./utils";
import { StatusBadge } from "./StatusBadge";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { ApplicationDetailDialog } from "../../shared/ApplicationDetailDialog";

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  venue, 
  recentEvents, 
  pendingBookings,
  confirmedBookings,
  pendingCancelBookings 
}) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleEventClick = (booking: Booking) => {
    setSelectedEvent(booking.event);
    setSelectedBooking(booking);
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Confirmed Bookings - Top Priority Section */}
      {confirmedBookings.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex justify-between items-center text-green-800">
              <span>🎵 Confirmed Bookings - Don't Miss These!</span>
              <Link to="/venue-dashboard?tab=bookings">
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-900">
                  View Calendar
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedBookings.slice(0, 5).map((booking) => (
                <ConfirmedBookingItem 
                  key={booking.id} 
                  booking={booking} 
                  onEventClick={() => handleEventClick(booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex justify-between items-center">
              <span>Recent Events</span>
              <Link to="/venue-events">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.slice(0, 5).map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No events yet</p>
                <Link to="/venue-events">
                  <Button variant="outline" size="sm" className="mt-2">Create Event</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                <span>Pending Applications</span>
                <Link to="/venue-musicians">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBookings.length > 0 ? (
                <div className="space-y-4">
                  {pendingBookings.slice(0, 3).map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No pending applications</p>
              )}
            </CardContent>
          </Card>

          {pendingCancelBookings.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                  <span>Pending Cancellations</span>
                  <Link to="/venue-musicians">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCancelBookings.slice(0, 3).map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ApplicationDetailDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        selectedEvent={selectedEvent}
        getEventApplications={(eventId) => selectedBooking ? [selectedBooking] : []}
        onAcceptApplication={(bookingId) => {
          // Handle accept - this is for dashboard view so might not need implementation
          console.log('Accept application:', bookingId);
        }}
        onRejectApplication={(bookingId) => {
          // Handle reject - this is for dashboard view so might not need implementation  
          console.log('Reject application:', bookingId);
        }}
      />
    </div>
  );
};

const ConfirmedBookingItem: React.FC<{ 
  booking: Booking; 
  onEventClick: () => void;
}> = ({ booking, onEventClick }) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div 
      className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEventClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
          {booking.musician?.profile_picture ? (
            <img 
              src={booking.musician.profile_picture} 
              alt={booking.musician.stage_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-green-600 font-semibold text-lg">
              {booking.musician?.stage_name?.charAt(0) || "M"}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-green-800">{booking.musician?.stage_name}</h4>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Confirmed
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.event?.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(booking.event?.start_time)} - {formatTime(booking.event?.end_time)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {booking.event?.title}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click for event details and activity log
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {booking.musician?.phone && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={`tel:${booking.musician.phone}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        )}
        {booking.musician?.email && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={`mailto:${booking.musician.email}`}>
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  // Determine the event status to display
  const getEventDisplayStatus = () => {
    // If event has a status, use it
    if (event.status) {
      return event.status;
    }
    
    // If no explicit status, determine based on context
    // For now, default to "open" for events without a status
    return "open";
  };

  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div>
        <h4 className="font-medium">{event.title}</h4>
        <div className="flex items-center text-sm text-gray-500">
          <span>{formatDate(event.date)}</span>
          <span className="mx-2">•</span>
          <StatusBadge status={getEventDisplayStatus()} />
        </div>
      </div>
      <Link to={`/venue-event/${event.id}`}>
        <Button variant="ghost" size="sm">View</Button>
      </Link>
    </div>
  );
};

const BookingItem: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {booking.musician?.profile_picture ? (
            <img 
              src={booking.musician.profile_picture} 
              alt={booking.musician.stage_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xs">
              {booking.musician?.stage_name?.charAt(0) || "M"}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-medium">{booking.musician?.stage_name}</h4>
          <div className="flex items-center text-xs text-gray-500">
            <span>{booking.event?.title || "Event"}</span>
            <span className="mx-1">•</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </div>
      <Link to={`/venue-musicians?booking=${booking.id}`}>
        <Button variant="ghost" size="sm">View</Button>
      </Link>
    </div>
  );
}; 