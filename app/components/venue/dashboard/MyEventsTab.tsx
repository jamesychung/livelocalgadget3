import React, { useState, useMemo } from "react";
import { useVenueEvents } from "../../../hooks/useVenueEvents";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Calendar, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { EventDialog } from "../../shared/EventDialog";
import { VenueEventEditDialog } from "../../shared/VenueEventEditDialog";
import { FilterPanel, FilterState } from "../../shared/FilterPanel";
import { useFilters, filterFunctions } from "../../../hooks/useFilters";
import { EventStatusLegend } from "../../shared/EventStatusLegend";
import { deriveEventStatusFromBookings } from "../../../lib/utils";
import { EventCard } from "../../shared/EventCard";

interface MyEventsTabProps {
  user: any;
  venue: any;
  events: any[];
  bookings: any[];
}

export const MyEventsTab: React.FC<MyEventsTabProps> = ({ user, venue, events, bookings }) => {
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);

  // Filter state - managed by FilterPanel
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    musician: 'all'
  });

  const {
    // State
    editDialogOpen,
    setEditDialogOpen,
    editingEvent,
    setEditingEvent,
    editFormData,
    setEditFormData,
    refreshTrigger,
    setRefreshTrigger,

    // Data
    allEvents,
    allBookings,
    venueBookings,

    // Helper functions
    getApplicationCount,
    getPendingApplicationCount,
    getPendingApplications,
    getEventsWithPendingApplications,

    // Event handlers
    handleEditEvent,
    handleEditSubmit,
    handleBookApplication,
    handleRejectApplication,
  } = useVenueEvents(user);

  // Override handleEventClick to use our new state
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailDialogOpen(true);
  };

  // Get unique musicians for filter dropdown
  const uniqueMusicians = useMemo(() => {
    const musicians = new Set<string>();
    allBookings.forEach(booking => {
      if (booking.musician?.stage_name) {
        musicians.add(booking.musician.stage_name);
      }
    });
    return Array.from(musicians).sort();
  }, [allBookings]);

  // Create filter function for events
  const eventFilterFunction = (event: any, filters: FilterState): boolean => {
    // Date range filter
    if (!filterFunctions.dateRange(event.date, filters)) return false;

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'open':
          if (event.eventStatus !== 'open') return false;
          break;
        case 'invited':
          if (event.eventStatus !== 'invited') return false;
          break;
        case 'application_received':
          if (event.eventStatus !== 'application_received') return false;
          break;
        case 'selected':
          if (event.eventStatus !== 'selected') return false;
          break;
        case 'confirmed':
          if (event.eventStatus !== 'confirmed') return false;
          break;
        case 'cancel_requested':
          if (event.eventStatus !== 'cancel_requested') return false;
          break;
        default:
          break;
      }
    }

    // Search filter (searches title, description)
    const searchFields = [event.title, event.description];
    if (!filterFunctions.search(searchFields, filters)) return false;

    // Musician filter
    if (filters.musician && filters.musician !== 'all') {
      // Check if the selected musician has applied to or is associated with this event
      const eventBookings = allBookings.filter(booking => booking.event_id === event.id);
      const hasSelectedMusician = eventBookings.some(booking => 
        booking.musician?.stage_name === filters.musician
      );
      if (!hasSelectedMusician) return false;
    }

    return true;
  };

  // Derive correct event status for all events based on bookings
  const eventsWithDerivedStatus = useMemo(() => {
    return allEvents.map(event => ({
      ...event,
      eventStatus: deriveEventStatusFromBookings(event, allBookings)
    }));
  }, [allEvents, allBookings]);

  // Use the filter hook for events with derived status
  const { filteredData: filteredEvents } = useFilters({
    data: eventsWithDerivedStatus,
    filters,
    filterFunction: eventFilterFunction
  });

  // Filter events by status for different sections - exclude completed and cancelled
  const activeEvents = filteredEvents.filter(event => 
    event.eventStatus !== 'completed' && event.eventStatus !== 'cancelled'
  );
  
  // Completed events are automatically moved to /venue-history
  const completedEventsCount = eventsWithDerivedStatus.filter(event => 
    event.eventStatus === 'completed'
  ).length;
  
  const eventsWithPendingApplications = getEventsWithPendingApplications();
  
  const pendingApplicationsList = getPendingApplications();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Button asChild>
          <Link to="/create-event">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Pending Applications Section */}
      {eventsWithPendingApplications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Pending Applications - Action Required
              <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                {pendingApplicationsList.length} total
              </Badge>
            </CardTitle>
            <p className="text-sm text-orange-700">
              These events have musician applications waiting for your review
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventsWithPendingApplications.map((event) => {
                const pendingCount = getApplicationCount(event.id);
                
                return (
                  <div key={event.id} className="bg-white border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{formatDate(event.date)}</span>
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                          {pendingCount} pending
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleViewApplications(event)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Review Applications
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Active Events Section with Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Active Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Events that are currently active. Completed events are automatically moved to <Link to="/venue-history" className="text-blue-600 hover:text-blue-800 underline">Event History</Link>.
          </p>
        </CardHeader>
        <CardContent>
          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel
              config={{
                search: {
                  placeholder: "Search events by title or description...",
                  enabled: true
                },
                dateRange: {
                  enabled: true,
                  fromLabel: "Event Date From",
                  toLabel: "Event Date To"
                },
                status: {
                  enabled: true,
                  label: "Event Status",
                  options: [
                    { value: 'all', label: 'All Active Events' },
                    { value: 'open', label: 'Open Event' },
                    { value: 'invited', label: 'Invited Event' },
                    { value: 'application_received', label: 'Application Received' },
                    { value: 'selected', label: 'Musician Selected' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'cancel_requested', label: 'Cancel Requested' }
                  ]
                },
                dropdowns: [
                  {
                    key: 'musician',
                    label: 'Musician',
                    options: ['all', ...uniqueMusicians],
                    placeholder: 'Search for musician...',
                    searchable: true
                  }
                ]
              }}
              onFilterChange={(newFilters) => {
                // Update our local filters state
                setFilters(newFilters);
              }}
              showActiveFilters={true}
              initiallyExpanded={true}
            />
          </div>

          {/* Event Status Legend */}
          <EventStatusLegend events={activeEvents} hideCompletedStatuses={true} />

          {activeEvents.length > 0 ? (
            <div className="space-y-4">
              {activeEvents.map((event) => {
                const applicationCount = getApplicationCount(event.id);
                const pendingApplicationCount = getPendingApplicationCount(event.id);
                
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEventClick={() => handleEventClick(event)}
                    showStatusBadge={true}
                    showActions={true}
                    clickText="Click for event details"
                    className="hover:shadow-lg transition-shadow duration-200"
                    onEdit={() => handleEditEvent(event)}
                    onViewApplications={applicationCount > 0 ? () => handleViewApplications(event) : undefined}
                    applicationCount={applicationCount}
                    pendingApplicationCount={pendingApplicationCount}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Events</h3>
              <p className="text-muted-foreground mb-4">
                Create your first event to start booking musicians.
              </p>
              <Button asChild>
                <Link to="/create-event">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Events Notice */}
      {completedEventsCount > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-900">
                    {completedEventsCount} Completed Event{completedEventsCount === 1 ? '' : 's'}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Your completed events have been moved to the history section
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                <Link to="/venue-history">
                  View Event History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Event Dialog */}
      <VenueEventEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingEvent={editingEvent}
        editFormData={editFormData}
        onEditFormDataChange={setEditFormData}
        onSubmit={handleEditSubmit}
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

      {/* Event Detail Dialog */}
      <EventDialog
        isOpen={isEventDetailDialogOpen}
        onClose={() => setIsEventDetailDialogOpen(false)}
        event={selectedEvent}
        bookings={selectedEvent ? allBookings.filter(b => b.event?.id === selectedEvent.id) : []}
        onAcceptApplication={(bookingId: string) => handleBookApplication(bookingId, selectedEvent?.id || '')}
        onRejectApplication={handleRejectApplication}
        currentUser={{ venue: { id: venue.id } }}
        userRole="venue"
        showApplicationsList={true}
      />
    </div>
  );
}; 