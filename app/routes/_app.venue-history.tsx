import React, { useState, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar, Users, Eye, ArrowLeft, Filter, X, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "../components/shared/EventStatusBadge";
import { ApplicationDetailDialog } from "../components/shared/ApplicationDetailDialog";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";
import { CANCELLATION_REASON_LABELS } from "../lib/utils";

function VenueHistoryContent({ user, venue, allEvents, allBookings, getApplicationCount, handleBookApplication, handleRejectApplication }: any) {
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    musician: '',
    venue: '',
    cancellationReason: 'all'
  });
  const [musicianPopoverOpen, setMusicianPopoverOpen] = useState(false);
  const [venuePopoverOpen, setVenuePopoverOpen] = useState(false);

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

  // Apply filters to past events
  const filteredEvents = useMemo(() => {
    return pastEvents.filter(event => {
      // Date range filter
      if (filters.dateFrom) {
        const eventDate = new Date(event.date);
        const fromDate = new Date(filters.dateFrom);
        if (eventDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const eventDate = new Date(event.date);
        const toDate = new Date(filters.dateTo);
        if (eventDate > toDate) return false;
      }

      // Status filter
      if (filters.status !== 'all' && event.eventStatus !== filters.status) {
        return false;
      }

      // Musician filter
      if (filters.musician) {
        const hasMatchingMusician = event.bookings.some((booking: any) => 
          booking.musician?.stage_name === filters.musician
        );
        if (!hasMatchingMusician) return false;
      }

      // Venue filter
      if (filters.venue) {
        const eventVenueName = event.venue?.name || '';
        if (eventVenueName !== filters.venue) {
          return false;
        }
      }

      // Cancellation reason filter
      if (filters.cancellationReason !== 'all') {
        const hasCancelledBooking = event.bookings.some((booking: any) => 
          booking.status === 'cancelled' && booking.cancellation_reason === filters.cancellationReason
        );
        if (!hasCancelledBooking) return false;
      }

      return true;
    });
  }, [pastEvents, filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: 'all',
      musician: '',
      venue: '',
      cancellationReason: 'all'
    });
    setMusicianPopoverOpen(false);
    setVenuePopoverOpen(false);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.status !== 'all' || 
    filters.musician || filters.venue || filters.cancellationReason !== 'all';

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date From</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="pl-10"
                  />
                  <CalendarIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Date To</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="pl-10"
                  />
                  <CalendarIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Musician Filter */}
              <div className="space-y-2">
                <Label>Musician</Label>
                <Popover open={musicianPopoverOpen} onOpenChange={setMusicianPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={musicianPopoverOpen}
                      className="w-full justify-between"
                    >
                      {filters.musician || "Select musician..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search musicians..." />
                      <CommandList>
                        <CommandEmpty>No musician found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              setFilters(prev => ({ ...prev, musician: '' }));
                              setMusicianPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${filters.musician === '' ? "opacity-100" : "opacity-0"}`}
                            />
                            All Musicians
                          </CommandItem>
                          {uniqueMusicians.map((musician) => (
                            <CommandItem
                              key={musician}
                              value={musician}
                              onSelect={() => {
                                setFilters(prev => ({ ...prev, musician: musician }));
                                setMusicianPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${filters.musician === musician ? "opacity-100" : "opacity-0"}`}
                              />
                              {musician}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Venue Filter */}
              <div className="space-y-2">
                <Label>Venue</Label>
                <Popover open={venuePopoverOpen} onOpenChange={setVenuePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={venuePopoverOpen}
                      className="w-full justify-between"
                    >
                      {filters.venue || "Select venue..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search venues..." />
                      <CommandList>
                        <CommandEmpty>No venue found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              setFilters(prev => ({ ...prev, venue: '' }));
                              setVenuePopoverOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${filters.venue === '' ? "opacity-100" : "opacity-0"}`}
                            />
                            All Venues
                          </CommandItem>
                          {uniqueVenues.map((venue) => (
                            <CommandItem
                              key={venue}
                              value={venue}
                              onSelect={() => {
                                setFilters(prev => ({ ...prev, venue: venue }));
                                setVenuePopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${filters.venue === venue ? "opacity-100" : "opacity-0"}`}
                              />
                              {venue}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cancellation Reason Filter */}
              <div className="space-y-2">
                <Label>Cancellation Reason</Label>
                <Select value={filters.cancellationReason} onValueChange={(value) => setFilters(prev => ({ ...prev, cancellationReason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Reasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    {Object.entries(CANCELLATION_REASON_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {filters.dateFrom && (
                    <Badge variant="secondary">
                      From: {formatDate(filters.dateFrom)}
                    </Badge>
                  )}
                  {filters.dateTo && (
                    <Badge variant="secondary">
                      To: {formatDate(filters.dateTo)}
                    </Badge>
                  )}
                  {filters.status !== 'all' && (
                    <Badge variant="secondary">
                      Status: {filters.status}
                    </Badge>
                  )}
                  {filters.musician && (
                    <Badge variant="secondary">
                      Musician: {filters.musician}
                    </Badge>
                  )}
                  {filters.venue && (
                    <Badge variant="secondary">
                      Venue: {filters.venue}
                    </Badge>
                  )}
                  {filters.cancellationReason !== 'all' && (
                    <Badge variant="secondary">
                      Reason: {CANCELLATION_REASON_LABELS[filters.cancellationReason as keyof typeof CANCELLATION_REASON_LABELS]}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Event History */}
      <Card>
        <CardHeader>
          <CardTitle>Past Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? `Showing ${filteredEvents.length} filtered events` : 'Completed and cancelled events'}
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
                                
                                {/* Show musician info if available */}
                                {event.bookings.length > 0 && (
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
                {hasActiveFilters ? 'No Events Match Filters' : 'No Past Events'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your event history will appear here once you have completed or cancelled events.'
                }
              </p>
              {hasActiveFilters ? (
                <Button onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/create-event">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Your First Event
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

export default function VenueHistoryPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  
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

  // If no venue profile found, show a message with option to create one
  if (!venue) {
    return (
      <VenueProfilePrompt onCreateProfile={() => {}} />
    );
  }

  return (
    <VenueHistoryContent
      user={user}
      venue={venue}
      allEvents={allEvents}
      allBookings={allBookings}
      getApplicationCount={getApplicationCount}
      handleBookApplication={handleBookApplication}
      handleRejectApplication={handleRejectApplication}
    />
  );
}