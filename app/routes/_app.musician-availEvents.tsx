import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { BookingDetailDialog } from '../components/shared/BookingDetailDialog';
import {
  EventSummary,
  EventSearchFilter,
  EventsTable,
  EventDetailDialog,
  SortField,
  SortDirection,
  getMatchingMusicians,
  getStatusDisplay,
  sortEvents
} from '../components/musician/events';

export default function MusicianAvailEventsPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  // State for data
  const [events, setEvents] = useState<any[]>([]);
  const [musicians, setMusicians] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            start_time,
            end_time,
            event_status,
            rate,
            genres,
            created_at,
            venue_id,
            venue:venues(id, name, city, state)
          `)
          .in('event_status', ['open', 'invited']);

        if (eventsError) throw eventsError;

        // Fetch musicians
        const { data: musiciansData, error: musiciansError } = await supabase
          .from('musicians')
          .select(`
            id,
            stage_name,
            genres,
            availability,
            email,
            phone,
            city,
            state,
            bio,
            hourly_rate
          `)
          .limit(100);

        if (musiciansError) throw musiciansError;

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            event_id,
            musician_id,
            cancel_requested_at,
            cancel_requested_by,
            cancel_requested_by_role,
            cancelled_at,
            cancelled_by,
            cancel_confirmed_by_role,
            cancellation_reason,
            applied_at,
            selected_at,
            confirmed_at,
            completed_at,
            completed_by,
            completed_by_role,
            proposed_rate,
            musician_pitch,
            musician:musicians(id, stage_name, city, state)
          `);

        if (bookingsError) throw bookingsError;

        setEvents(eventsData || []);
        setMusicians(musiciansData || []);
        setBookings(bookingsData || []);
        
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Helper function to get musician's application status for an event
  const getMusicianApplicationStatus = (eventId: string): { status: string; booking?: any } => {
    if (!user?.musician?.id) return { status: "available" };
    
    const booking = bookings.find(booking => 
      booking.event_id === eventId && 
      booking.musician_id === user.musician.id
    );
    
    if (!booking) return { status: "available" };
    
    return { status: booking.status, booking };
  };

  // Handle sort column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate summary statistics
  const totalEvents = events.length;
  const openEvents = events.filter(event => event.event_status === 'open').length;
  const invitedEvents = events.filter(event => event.event_status === 'invited').length;

  // Filter events based on search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || event.event_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort filtered events
  const sortedEvents = sortEvents(filteredEvents, sortField, sortDirection, getMusicianApplicationStatus);

  // Handle row click to open dialog
  const handleRowClick = (event: any) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // Handle dialog actions
  const handleApply = async () => {
    if (!selectedEvent || !user?.musician?.id) {
      console.error("Missing event or musician ID");
      return;
    }

    try {
      // Check if musician already has a booking for this event
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_id', selectedEvent.id)
        .eq('musician_id', user.musician.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("❌ Error checking existing booking:", checkError);
        alert("Failed to check existing application. Please try again.");
        return;
      }

      if (existingBooking) {
        alert("You have already applied to this event. Please check your applications.");
        setIsDialogOpen(false);
        setSelectedEvent(null);
        return;
      }

      // Create a booking record with status 'applied'
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([
          {
            event_id: selectedEvent.id,
            musician_id: user.musician.id,
            venue_id: selectedEvent.venue_id,
            booked_by: user.id,
            status: "applied",
            proposed_rate: user.musician.hourly_rate || 0,
            musician_pitch: `I'm excited to perform at ${selectedEvent.venue?.name || 'your venue'}! I have experience in ${user.musician.genres?.join(', ') || 'various genres'} and would love to contribute to your event.`,
            date: selectedEvent.date,
            start_time: selectedEvent.start_time,
            end_time: selectedEvent.end_time
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Booking creation failed:", error);
        alert("Failed to apply. Please try again.");
        return;
      }
      
      // Update local state to reflect the new booking
      setBookings(prev => [...prev, booking]);
      
      // Close dialog and show success message
      setIsDialogOpen(false);
      setSelectedEvent(null);
      
      // Show success message
      alert("Application submitted successfully! The venue will review your application.");
      
    } catch (error) {
      console.error("❌ Error applying to event:", error);
      alert("An error occurred while applying. Please try again.");
    }
  };

  const handleNotInterested = () => {
    // TODO: Implement not interested logic
    console.log("Not interested in event:", selectedEvent?.id);
    setIsDialogOpen(false);
  };

  const handleMessageVenue = () => {
    // TODO: Implement message venue logic
    console.log("Message venue for event:", selectedEvent?.id);
    setIsDialogOpen(false);
  };

  // Handle booking click to view details with activity log
  const handleViewBookingDetails = (booking: any) => {
    // Find the event for this booking
    const event = events.find(e => e.id === booking.event_id);
    
    if (!event) {
      console.error("Event not found for booking:", booking);
      return;
    }
    
    // Find musician data if not already included in booking
    const musician = booking.musician || musicians.find(m => m.id === booking.musician_id);
    
    // Combine booking with event data for activity log
    const bookingWithEvent = {
      ...booking,
      event: event,
      musician: musician,
      // Add any missing fields that might be needed for the activity log
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      venue: event.venue
    };
    
    console.log("Opening booking details with activity log:", bookingWithEvent);
    
    setSelectedBooking(bookingWithEvent);
    setIsBookingDialogOpen(true);
  };

  // Handle booking status update
  const handleBookingStatusUpdate = (updatedBooking: any) => {
    // Update bookings state
    setBookings(prev => 
      prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
    );
  };

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events and musicians...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if events query failed
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading Events</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the available events. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/musician-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Available Events</h1>
            <p className="text-muted-foreground">
              All events with matching musicians
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <EventSummary 
        invitedEvents={invitedEvents}
        openEvents={openEvents}
        totalEvents={totalEvents}
      />

      {/* Search and Filter */}
      <EventSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Events Table */}
      <EventsTable
        events={sortedEvents}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleRowClick={handleRowClick}
        handleViewBookingDetails={handleViewBookingDetails}
        user={user}
        bookings={bookings}
        getMusicianApplicationStatus={getMusicianApplicationStatus}
        getStatusDisplay={getStatusDisplay}
      />

      {/* Event Details Dialog */}
      <EventDetailDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedEvent={selectedEvent}
        user={user}
        bookings={bookings}
        musicians={musicians}
        handleApply={handleApply}
        handleNotInterested={handleNotInterested}
        handleMessageVenue={handleMessageVenue}
        handleViewBookingDetails={handleViewBookingDetails}
        handleBookingStatusUpdate={handleBookingStatusUpdate}
        getMusicianApplicationStatus={getMusicianApplicationStatus}
        getMatchingMusicians={(event) => getMatchingMusicians(event, musicians)}
      />
      
      {/* Booking Detail Dialog with Activity Log */}
      <BookingDetailDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        booking={selectedBooking}
        currentUser={user}
        onStatusUpdate={handleBookingStatusUpdate}
      />
    </div>
  );
} 
