import React, { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { EventDialog } from "../../shared/EventDialog";
import { FilterPanel, FilterState } from "../../shared/FilterPanel";
import { useFilters, filterFunctions } from "../../../hooks/useFilters";
import { EventStatusLegend } from "../../shared/EventStatusLegend";
import { EventCard } from "../../shared/EventCard";


interface MyEventsTabProps {
  user: any;
  musician: any;
  bookings: any[];
  events: any[];
}

export const MyEventsTab: React.FC<MyEventsTabProps> = ({ user, musician, bookings, events }) => {
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter state - managed by FilterPanel
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    venue: 'all'
  });

  // Get musician's bookings (applications and confirmed gigs)
  const musicianBookings = useMemo(() => {
    return bookings.filter(booking => booking.musician_id === musician?.id);
  }, [bookings, musician?.id]);

  // Get events that musician has applied to or been booked for
  const musicianEvents = useMemo(() => {
    const eventIds = musicianBookings.map(booking => booking.event_id);
    return events.filter(event => eventIds.includes(event.id));
  }, [events, musicianBookings]);

  // Add booking status to events
  const eventsWithBookingStatus = useMemo(() => {
    return musicianEvents.map(event => {
      const booking = musicianBookings.find(b => b.event_id === event.id);
      return {
        ...event,
        bookingStatus: booking?.status || 'unknown',
        booking: booking,
        // For musician perspective, we focus on booking status rather than event status
        eventStatus: booking?.status || 'unknown'
      };
    });
  }, [musicianEvents, musicianBookings]);

  // Override handleEventClick to use our new state
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailDialogOpen(true);
  };

  // Get unique venues for filter dropdown
  const uniqueVenues = useMemo(() => {
    const venues = new Set<string>();
    eventsWithBookingStatus.forEach(event => {
      if (event.venue?.name) {
        venues.add(event.venue.name);
      }
    });
    return Array.from(venues).sort();
  }, [eventsWithBookingStatus]);

  // Create filter function for musician events
  const eventFilterFunction = (event: any, filters: FilterState): boolean => {
    // Date range filter
    if (!filterFunctions.dateRange(event.date, filters)) return false;

    // Status filter (booking status for musicians)
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'applied':
          if (event.bookingStatus !== 'applied') return false;
          break;
        case 'selected':
          if (event.bookingStatus !== 'selected') return false;
          break;
        case 'confirmed':
          if (event.bookingStatus !== 'confirmed') return false;
          break;
        case 'cancel_requested':
          if (event.bookingStatus !== 'cancel_requested') return false;
          break;
        default:
          break;
      }
    }

    // Search filter (searches title, description, venue name)
    const searchFields = [event.title, event.description, event.venue?.name];
    if (!filterFunctions.search(searchFields, filters)) return false;

    // Venue filter
    if (filters.venue && filters.venue !== 'all') {
      if (event.venue?.name !== filters.venue) return false;
    }

    return true;
  };

  // Use the filter hook for events
  const { filteredData: filteredEvents } = useFilters({
    data: eventsWithBookingStatus,
    filters,
    filterFunction: eventFilterFunction
  });

  // Filter events by status for different sections - exclude cancelled and completed
  const activeEvents = filteredEvents.filter(event => 
    event.bookingStatus !== 'cancelled' && event.bookingStatus !== 'completed'
  );

  // Count cancelled and completed events for notice
  const cancelledAndCompletedCount = eventsWithBookingStatus.filter(event => 
    event.bookingStatus === 'cancelled' || event.bookingStatus === 'completed'
  ).length;



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
          <Link to="/musician-availEvents">
            <Search className="mr-2 h-4 w-4" />
            Find Events
          </Link>
        </Button>
      </div>



      {/* Current Active Events Section with Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Active Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Events you've applied to or been booked for. Cancelled and completed events are automatically moved to <Link to="/musician-history" className="text-blue-600 hover:text-blue-800 underline">Event History</Link>.
          </p>
        </CardHeader>
        <CardContent>
          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel
              config={{
                search: {
                  placeholder: "Search events by title, description, or venue...",
                  enabled: true
                },
                dateRange: {
                  enabled: true,
                  fromLabel: "Event Date From",
                  toLabel: "Event Date To"
                },
                status: {
                  enabled: true,
                  label: "Application Status",
                  options: [
                    { value: 'all', label: 'All Active Applications' },
                    { value: 'applied', label: 'Applied' },
                    { value: 'selected', label: 'Selected' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'cancel_requested', label: 'Cancel Requested' }
                  ]
                },
                dropdowns: [
                  {
                    key: 'venue',
                    label: 'Venue',
                    options: ['all', ...uniqueVenues],
                    placeholder: 'Search for venue...',
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
              {activeEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    ...event,
                    // Override some fields for musician perspective
                    rate: event.booking?.proposed_rate || event.rate,
                    eventStatus: event.bookingStatus
                  }}
                  onEventClick={() => handleEventClick(event)}
                  showStatusBadge={true}
                  showActions={true}
                  clickText="Click for event details"
                  className="hover:shadow-lg transition-shadow duration-200"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Events</h3>
              <p className="text-muted-foreground mb-4">
                Browse available events and apply to start building your performance schedule.
              </p>
              <Button asChild>
                <Link to="/musician-availEvents">
                  <Search className="mr-2 h-4 w-4" />
                  Find Events
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancelled and Completed Events Notice */}
      {cancelledAndCompletedCount > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-900">
                    {cancelledAndCompletedCount} Cancelled or Completed Event{cancelledAndCompletedCount === 1 ? '' : 's'}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Your cancelled and completed events have been moved to the history section
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                <Link to="/musician-history">
                  View Event History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications Dialog */}
      <EventDialog
        isOpen={applicationsDialogOpen}
        onClose={() => setApplicationsDialogOpen(false)}
        event={selectedEventForApplications}
        booking={selectedEventForApplications?.booking}
        bookings={selectedEventForApplications ? musicianBookings.filter(b => b.event_id === selectedEventForApplications.id) : []}
        currentUser={{ musician: { id: musician?.id } }}
        userRole="musician"
        showApplicationsList={false}
      />

      {/* Event Detail Dialog */}
      <EventDialog
        isOpen={isEventDetailDialogOpen}
        onClose={() => setIsEventDetailDialogOpen(false)}
        event={selectedEvent}
        booking={selectedEvent?.booking}
        bookings={selectedEvent ? musicianBookings.filter(b => b.event_id === selectedEvent.id) : []}
        currentUser={{ musician: { id: musician?.id } }}
        userRole="musician"
        showApplicationsList={false}
      />
    </div>
  );
}; 