import React, { useState, useMemo } from "react";
import { useVenueEvents } from "../../../hooks/useVenueEvents";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Calendar, Users, AlertCircle, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "../../shared/EventStatusBadge";
import { ApplicationDetailDialog } from "../../shared/ApplicationDetailDialog";
import { VenueEventEditDialog } from "../../shared/VenueEventEditDialog";
import { FilterPanel, FilterState } from "../../shared/FilterPanel";
import { useFilters, filterFunctions } from "../../../hooks/useFilters";

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

  // Use the filter hook for all events
  const { filteredData: filteredEvents } = useFilters({
    data: allEvents,
    filters,
    filterFunction: eventFilterFunction
  });

  // Filter events by status for different sections
  const activeEvents = filteredEvents.filter(event => 
    event.eventStatus === 'open' || event.eventStatus === 'confirmed'
  );
  
  const completedEvents = filteredEvents.filter(event => 
    event.eventStatus === 'completed'
  );
  
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
          <CardTitle>Current Active Events</CardTitle>
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
                    { value: 'all', label: 'All Events' },
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
          {activeEvents.length > 0 ? (
            <div className="space-y-4">
              {activeEvents.map((event) => {
                const applicationCount = getApplicationCount(event.id);
                const pendingApplicationCount = getPendingApplicationCount(event.id);
                const hasPendingApps = pendingApplicationCount > 0;
                const borderColor = hasPendingApps 
                  ? 'border-l-orange-500' 
                  : event.eventStatus === 'confirmed' 
                    ? 'border-l-green-500' 
                    : 'border-l-blue-500';
                
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
                                  <Badge 
                                    variant={hasPendingApps ? "destructive" : "secondary"} 
                                    className={hasPendingApps ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}
                                  >
                                    <Users className="h-3 w-3 mr-1" />
                                    {hasPendingApps 
                                      ? `${pendingApplicationCount} pending` 
                                      : `${applicationCount} ${applicationCount === 1 ? 'application' : 'applications'}`
                                    }
                                    {hasPendingApps && ' - Review Needed'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Action buttons outside clickable area */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleEditEvent(event); }}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {applicationCount > 0 && (
                          <Button
                            variant={hasPendingApps ? "default" : "outline"}
                            size="sm"
                            onClick={e => { e.stopPropagation(); handleViewApplications(event); }}
                            className={`flex items-center gap-1 ${hasPendingApps ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                          >
                            <Users className="h-4 w-4" />
                            {hasPendingApps ? 'Review Applications' : 'View Applications'} ({hasPendingApps ? pendingApplicationCount : applicationCount})
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

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Events</CardTitle>
            <p className="text-sm text-muted-foreground">
              Events that have been completed
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedEvents.map((event) => {
                const applicationCount = getApplicationCount(event.id);
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 border-l-emerald-500">
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
                                  <Badge 
                                    variant="secondary" 
                                    className="bg-emerald-100 text-emerald-800"
                                  >
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleEventClick(event); }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
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
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
}; 