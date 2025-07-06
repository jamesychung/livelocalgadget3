import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { OverviewTabProps, Booking, Event } from "./types";
import { formatDate } from "./utils";
import { StatusDisplay } from "../../shared/StatusDisplay";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Mail, AlertCircle, Users } from "lucide-react";
import { EventDialog } from "../../shared/EventDialog";
import { useVenueEvents } from "../../../hooks/useVenueEvents";
import { BookingCard } from "../../shared/BookingCard";


export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  venue, 
  user,
  recentEvents, 
  pendingBookings,
  selectedBookings,
  confirmedBookings,
  pendingCancelBookings,
  allBookings = []
}) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);

  // Use venue events hook to get pending applications data
  const {
    getEventsWithPendingApplications,
    getPendingApplications,
    getApplicationCount,
    handleBookApplication,
    handleRejectApplication,
  } = useVenueEvents(user);

  const handleEventClick = (booking: Booking) => {
    setSelectedEvent(booking.event);
    setSelectedBooking(booking);
    setIsEventDialogOpen(true);
  };

  const handleRecentEventClick = (event: Event) => {
    setSelectedEvent(event);
    // Find the first booking for this event to show activity log
    const eventBookings = allBookings.filter(booking => booking.event?.id === event.id);
    setSelectedBooking(eventBookings.length > 0 ? eventBookings[0] : null);
    setIsEventDialogOpen(true);
  };

  const handleViewApplications = (event: any) => {
    setSelectedEventForApplications(event);
    setApplicationsDialogOpen(true);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
  };

  // Get events by status with their relevant timestamps
  const getEventsByStatus = () => {
    // Applications received (applied bookings)
    const applicationEvents = allBookings
      .filter(booking => booking.status === 'applied' && booking.event && booking.applied_at)
      .map(booking => ({
        booking,
        timestamp: new Date(booking.applied_at!),
        displayText: `Application received from ${booking.musician?.stage_name}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Confirmed events
    const confirmedEvents = allBookings
      .filter(booking => booking.status === 'confirmed' && booking.event && booking.confirmed_at)
      .map(booking => ({
        booking,
        timestamp: new Date(booking.confirmed_at!),
        displayText: `Event confirmed with ${booking.musician?.stage_name}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Cancellation requests
    const cancellationEvents = allBookings
      .filter(booking => booking.status === 'pending_cancel' && booking.event && booking.cancel_requested_at)
      .map(booking => ({
        booking,
        timestamp: new Date(booking.cancel_requested_at!),
        displayText: `Cancellation requested by ${(booking as any).cancelled_by_role === 'musician' ? booking.musician?.stage_name : 'venue'}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return { applicationEvents, confirmedEvents, cancellationEvents };
  };

  const { applicationEvents, confirmedEvents, cancellationEvents } = getEventsByStatus();

  return (
    <div className="space-y-6">
      {/* Explanatory Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm font-medium">
          Overview tab highlights important events with: Applications Received, Confirmed Events, and Cancellation Requests
        </p>
      </div>

      {/* Cancellation Requests - Highest Priority */}
      {cancellationEvents.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-orange-800">
              <div className="flex items-center gap-2">
                <span>⚠️ Cancellation Requests</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {cancellationEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cancellationEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking.id}-cancel`}
                  booking={item.booking}
                  status="cancel_requested"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications Received */}
      {applicationEvents.length > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-purple-800">
              <div className="flex items-center gap-2">
                <span>📝 Applications Received</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {applicationEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking.id}-application`}
                  booking={item.booking}
                  status="application_received"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmed Events */}
      {confirmedEvents.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-800">
              <div className="flex items-center gap-2">
                <span>✅ Confirmed Events</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {confirmedEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking.id}-confirmed`}
                  booking={item.booking}
                  status="confirmed"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Events Message */}
      {cancellationEvents.length === 0 && applicationEvents.length === 0 && confirmedEvents.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-6 text-center text-gray-500">
            <p>No important events to display at this time.</p>
          </CardContent>
        </Card>
      )}

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        event={selectedEvent}
        booking={selectedBooking}
        bookings={selectedEvent ? allBookings.filter(booking => booking.event?.id === selectedEvent.id) : []}
        currentUser={{ venue: { id: venue.id } }}
        userRole="venue"
        onStatusUpdate={(updatedBooking: any) => {
          // Handle status update - could refresh data or update state
          console.log('Status updated:', updatedBooking);
        }}
        onAcceptApplication={(bookingId: string) => {
          // Handle accept - this is for dashboard view so might not need implementation
          console.log('Accept application:', bookingId);
        }}
        onRejectApplication={(bookingId: string) => {
          // Handle reject - this is for dashboard view so might not need implementation  
          console.log('Reject application:', bookingId);
        }}
        onMessageOtherParty={(recipientId: string) => {
          window.open(`/messages?recipient=${recipientId}`, '_blank');
        }}
      />

      {/* Applications Dialog */}
      <EventDialog
        isOpen={applicationsDialogOpen}
        onClose={() => setApplicationsDialogOpen(false)}
        event={selectedEventForApplications}
        bookings={selectedEventForApplications ? allBookings.filter(b => b.event?.id === selectedEventForApplications.id) : []}
        onAcceptApplication={(bookingId: string) => handleBookApplication(bookingId, selectedEventForApplications?.id || '')}
        onRejectApplication={handleRejectApplication}
        currentUser={{ venue: { id: venue.id } }}
        userRole="venue"
        showApplicationsList={true}
      />
    </div>
  );
};

const ImportantEventItem: React.FC<{ 
  booking: Booking; 
  status: 'application_received' | 'confirmed' | 'cancel_requested';
  timestamp: Date;
  displayText: string;
  onEventClick: () => void;
}> = ({ booking, status, timestamp, displayText, onEventClick }) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <BookingCard
      booking={booking}
      onEventClick={onEventClick}
      viewMode="venue"
      variant={status === 'confirmed' ? 'confirmed' : status === 'cancel_requested' ? 'cancelled' : 'application'}
      showStatusBadge={true}
      showActions={false}
      showPitch={false}
      clickText={`${displayText} • ${formatTimestamp(timestamp)}`}
      status={status}
    />
  );
};



const BookingItem: React.FC<{ 
  booking: Booking; 
  onEventClick: () => void;
}> = ({ booking, onEventClick }) => {
  return (
    <div 
      className="flex items-center justify-between border-b pb-2 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
      onClick={onEventClick}
    >
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
                            <StatusDisplay status={booking.status} variant="badge" />
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click for event details and activity log
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEventClick();
          }}
        >
          View
        </Button>
      </div>
    </div>
  );
}; 