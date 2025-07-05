import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Users, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "../components/shared/EventStatusBadge";
import { ApplicationDetailDialog } from "../components/shared/ApplicationDetailDialog";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";

export default function VenueHistoryPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);

  const {
    // Data
    venue,
    allEvents,
    allBookings,

    // Helper functions
    getApplicationCount,

    // Event handlers
    handleBookApplication,
    handleRejectApplication,
  } = useVenueEvents(user);

  // Override handleEventClick to use our new state
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailDialogOpen(true);
  };

  // If no venue profile found, show a message with option to create one
  if (!venue) {
    return (
      <VenueProfilePrompt onCreateProfile={() => {}} />
    );
  }

  // Enhance events with correct status based on booking states
  const allEventsWithBookingInfo = allEvents.map(event => {
    const eventBookings = allBookings.filter(booking => booking.event?.id === event.id);
    const completedBookings = eventBookings.filter(booking => booking.status === 'completed');
    const cancelledBookings = eventBookings.filter(booking => booking.status === 'cancelled');
    const confirmedBookings = eventBookings.filter(booking => booking.status === 'confirmed');
    const selectedBookings = eventBookings.filter(booking => booking.status === 'selected');
    const appliedBookings = eventBookings.filter(booking => booking.status === 'applied');
    const cancelRequestedBookings = eventBookings.filter(booking => booking.status === 'pending_cancel');
    
    // Determine event status based on booking states (same logic as BookingsTab)
    let eventStatus = event.eventStatus || 'open';
    if (completedBookings.length > 0) {
      eventStatus = 'completed';
    } else if (cancelledBookings.length > 0 && confirmedBookings.length === 0) {
      eventStatus = 'cancelled';
    } else if (cancelRequestedBookings.length > 0) {
      eventStatus = 'cancel_requested';
    } else if (confirmedBookings.length > 0) {
      eventStatus = 'confirmed';
    } else if (selectedBookings.length > 0) {
      eventStatus = 'selected';
    } else if (appliedBookings.length > 0) {
      eventStatus = 'application_received';
    } else if (event.eventStatus === 'invited') {
      eventStatus = 'invited';
    }
    
    return {
      ...event,
      eventStatus: eventStatus,
      bookings: eventBookings
    };
  });

  // Only show completed or cancelled events in history
  const pastEvents = allEventsWithBookingInfo.filter(event => 
    event.eventStatus === 'completed' || event.eventStatus === 'cancelled'
  );

  const handleViewApplications = (event: any) => {
    setSelectedEventForApplications(event);
    setApplicationsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/venue-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Event History</h1>
            <p className="text-muted-foreground">
              Past events and completed bookings for {venue?.name || "your venue"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {pastEvents.length} Past Events
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700">
            {pastEvents.filter(e => e.eventStatus === 'completed').length} Completed
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-red-50 text-red-700">
            {pastEvents.filter(e => e.eventStatus === 'cancelled').length} Cancelled
          </Badge>
        </div>
      </div>

      {/* Event History */}
      <Card>
        <CardHeader>
          <CardTitle>Past Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Completed and cancelled events
          </p>
        </CardHeader>
        <CardContent>
          {pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => {
                const applicationCount = getApplicationCount(event.id);
                const borderColor = event.eventStatus === 'completed' ? 'border-l-emerald-500' : 'border-l-red-500';
                
                return (
                  <Card key={event.id} className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 ${borderColor}`}>
                    <CardContent className="pt-6">
                      <div
                        className="flex flex-col gap-2"
                        onClick={() => handleEventClick(event)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {event.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>
                                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <EventStatusBadge status={event.eventStatus} />
                                {applicationCount > 0 && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                    <Users className="h-3 w-3 mr-1" />
                                    {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Action buttons outside clickable area */}
                      <div className="flex items-center gap-2 mt-2">
                        {applicationCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => { e.stopPropagation(); handleViewApplications(event); }}
                            className="flex items-center gap-1"
                          >
                            <Users className="h-4 w-4" />
                            View Applications ({applicationCount})
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleEventClick(event); }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Past Events</h3>
              <p className="text-muted-foreground mb-6">
                Your event history will appear here once you have completed or cancelled events.
              </p>
              <Button asChild>
                <Link to="/create-event">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Dialog */}
      <ApplicationDetailDialog
        open={applicationsDialogOpen}
        onOpenChange={setApplicationsDialogOpen}
        selectedEvent={selectedEventForApplications}
        getEventApplications={(eventId) => allBookings.filter(b => b.event?.id === eventId)}
        onAcceptApplication={(bookingId) => handleBookApplication(bookingId, selectedEventForApplications?.id || '')}
        onRejectApplication={handleRejectApplication}
      />

      {/* Event Detail Dialog */}
      <ApplicationDetailDialog
        open={isEventDetailDialogOpen}
        onOpenChange={setIsEventDetailDialogOpen}
        selectedEvent={selectedEvent}
        getEventApplications={(eventId) => allBookings.filter(b => b.event?.id === eventId)}
        onAcceptApplication={(bookingId) => handleBookApplication(bookingId, selectedEvent?.id || '')}
        onRejectApplication={handleRejectApplication}
      />
    </div>
  );
} 