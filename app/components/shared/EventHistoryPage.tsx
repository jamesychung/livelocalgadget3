import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Users, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "./EventStatusBadge";
import { ApplicationDetailDialog } from "./ApplicationDetailDialog";
import { CANCELLATION_REASON_LABELS } from "../../lib/utils";
import { FilterPanel, FilterState } from "./FilterPanel";
import { useFilters, filterFunctions } from "../../hooks/useFilters";

interface EventHistoryPageProps {
  // Data props
  allEvents: any[];
  allBookings: any[];
  userProfile: any;
  user: any;
  
  // Configuration props
  userType: 'venue' | 'musician';
  pageTitle: string;
  backLink: string;
  backLinkText: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  createEventLink?: string;
  createEventText?: string;
  
  // Function props
  getApplicationCount: (eventId: string) => number;
  handleBookApplication: (bookingId: string, eventId: string) => void;
  handleRejectApplication: (bookingId: string) => void;
}

export function EventHistoryPage({
  allEvents,
  allBookings,
  userProfile,
  user,
  userType,
  pageTitle,
  backLink,
  backLinkText,
  emptyStateTitle,
  emptyStateDescription,
  createEventLink,
  createEventText,
  getApplicationCount,
  handleBookApplication,
  handleRejectApplication
}: EventHistoryPageProps) {
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    musician: 'all',
    venue: 'all',
    cancellationReason: 'all'
  });

  // Override handleEventClick to use our new state
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailDialogOpen(true);
  };

  // Enhance events with correct status based on booking states
  const allEventsWithBookingInfo = allEvents.map(event => {
    const eventBookings = allBookings.filter(booking => booking.event?.id === event.id);
    const completedBookings = eventBookings.filter(booking => booking.status === 'completed');
    const cancelledBookings = eventBookings.filter(booking => booking.status === 'cancelled');
    const confirmedBookings = eventBookings.filter(booking => booking.status === 'confirmed');
    const selectedBookings = eventBookings.filter(booking => booking.status === 'selected');
    const appliedBookings = eventBookings.filter(booking => booking.status === 'applied');
    const cancelRequestedBookings = eventBookings.filter(booking => booking.status === 'pending_cancel');
    
    // Determine event status based on booking states
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

  // Get all past events (completed or cancelled)
  const pastEvents = allEventsWithBookingInfo.filter(event => 
    event.eventStatus === 'completed' || event.eventStatus === 'cancelled'
  );

  // Get unique musicians and venues for filter dropdowns
  const uniqueMusicians = useMemo(() => {
    const musicians = new Set<string>();
    allBookings.forEach(booking => {
      if (booking.musician?.stage_name) {
        musicians.add(booking.musician.stage_name);
      }
    });
    return Array.from(musicians).sort();
  }, [allBookings]);

  const uniqueVenues = useMemo(() => {
    const venues = new Set<string>();
    allEvents.forEach(event => {
      if (event.venue?.name) {
        venues.add(event.venue.name);
      }
    });
    return Array.from(venues).sort();
  }, [allEvents]);

  // Create filter function for events
  const eventFilterFunction = (event: any, filters: FilterState): boolean => {
    // Date range filter
    if (!filterFunctions.dateRange(event.date, filters)) return false;

    // Status filter
    if (!filterFunctions.status(event.eventStatus, filters)) return false;

    // Search filter (searches title, venue name, description)
    const searchFields = [
      event.title,
      event.venue?.name,
      event.description
    ];
    if (!filterFunctions.search(searchFields, filters)) return false;

    // Musician filter
    if (!filterFunctions.dropdown(
      event.bookings.find((booking: any) => booking.musician?.stage_name)?.musician?.stage_name,
      'musician',
      filters
    )) return false;

    // Venue filter
    if (!filterFunctions.dropdown(event.venue?.name, 'venue', filters)) return false;

    // Cancellation reason filter
    if (filters.cancellationReason !== 'all') {
      const hasCancelledBooking = event.bookings.some((booking: any) => 
        booking.status === 'cancelled' && booking.cancellation_reason === filters.cancellationReason
      );
      if (!hasCancelledBooking) return false;
    }

    return true;
  };

  // Use the filter hook
  const { filteredData: filteredEvents } = useFilters({
    data: pastEvents,
    filters,
    filterFunction: eventFilterFunction
  });

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
            <Link to={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLinkText}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              Past events and completed bookings for {userProfile?.name || userProfile?.stage_name || "you"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {filteredEvents.length} Past Events
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700">
            {filteredEvents.filter(e => e.eventStatus === 'completed').length} Completed
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-red-50 text-red-700">
            {filteredEvents.filter(e => e.eventStatus === 'cancelled').length} Cancelled
          </Badge>
        </div>
      </div>

      {/* Filter Section */}
      <FilterPanel
        config={{
          search: {
            enabled: true,
            placeholder: "Search events, venues, or descriptions..."
          },
          dateRange: {
            enabled: true,
            fromLabel: "Date From",
            toLabel: "Date To"
          },
          status: {
            enabled: true,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]
          },
          dropdowns: [
            {
              key: 'musician',
              label: 'Musician',
              options: uniqueMusicians,
              searchable: true,
              placeholder: "Select musician..."
            },
            {
              key: 'venue',
              label: 'Venue',
              options: uniqueVenues,
              searchable: true,
              placeholder: "Select venue..."
            },
            {
              key: 'cancellationReason',
              label: 'Cancellation Reason',
              options: Object.entries(CANCELLATION_REASON_LABELS).map(([key, label]) => key),
              searchable: false,
              placeholder: "All Reasons"
            }
          ]
        }}
        onFilterChange={setFilters}
      />

      {/* Event History */}
      <Card>
        <CardHeader>
          <CardTitle>Past Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Completed and cancelled events ({filteredEvents.length})
          </p>
        </CardHeader>
        <CardContent>
          {filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const applicationCount = getApplicationCount(event.id);
                const borderColor = event.eventStatus === 'completed' ? 'border-l-emerald-500' : 'border-l-red-500';
                
                // Get cancellation info for display
                const cancelledBookings = event.bookings.filter((booking: any) => booking.status === 'cancelled');
                const cancellationInfo = cancelledBookings.length > 0 ? cancelledBookings[0] : null;
                
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
                                
                                {/* Show venue info for musicians, musician info for venues */}
                                {userType === 'musician' && event.venue && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Venue: </span>
                                    {event.venue.name}
                                  </div>
                                )}
                                
                                {userType === 'venue' && event.bookings.length > 0 && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Musicians: </span>
                                    {event.bookings.map((booking: any, index: number) => (
                                      <span key={booking.id}>
                                        {booking.musician?.stage_name || 'Unknown'}
                                        {index < event.bookings.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Show cancellation reason if cancelled */}
                                {cancellationInfo && cancellationInfo.cancellation_reason && (
                                  <div className="mt-2 text-sm text-red-600">
                                    <span className="font-medium">Cancellation Reason: </span>
                                    {CANCELLATION_REASON_LABELS[cancellationInfo.cancellation_reason as keyof typeof CANCELLATION_REASON_LABELS] || cancellationInfo.cancellation_reason}
                                  </div>
                                )}
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
              <h3 className="text-xl font-medium mb-2">
                {emptyStateTitle}
              </h3>
              <p className="text-muted-foreground mb-6">
                {emptyStateDescription}
              </p>
              {createEventLink && createEventText && (
                <Button asChild>
                  <Link to={createEventLink}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {createEventText}
                  </Link>
                </Button>
              )}
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