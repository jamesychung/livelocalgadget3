import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useVenueEvents(user: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("calendar");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        totalCapacity: "",
        musicianId: "none",
        status: ""
    });

    // State for data fetching
    const [venue, setVenue] = useState<any>(null);
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [eventsFetching, setEventsFetching] = useState(false);
    const [bookingsFetching, setBookingsFetching] = useState(false);
    const [eventsError, setEventsError] = useState<any>(null);
    const [bookingsError, setBookingsError] = useState<any>(null);

    // Check if user is authenticated
    const isUserAuthenticated = !!user?.id;

    // Fetch venue data
    useEffect(() => {
        const fetchVenue = async () => {
            if (!isUserAuthenticated) return;

            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const { data: venueData, error } = await supabase
                    .from('venues')
                    .select('id, name, city, state')
                    .eq('owner_id', authUser.id)
                    .single();

                if (error) {
                    console.error("Error fetching venue:", error);
                    return;
                }

                setVenue(venueData);
            } catch (error) {
                console.error("Error fetching venue:", error);
            }
        };

        fetchVenue();
    }, [isUserAuthenticated]);

    // Fetch events for this venue
    useEffect(() => {
        const fetchEvents = async () => {
            if (!venue?.id) return;

            setEventsFetching(true);
            setEventsError(null);

            try {
                const { data: eventsData, error } = await supabase
                    .from('events')
                    .select(`
                        id,
                        title,
                        description,
                        date,
                        start_time,
                        end_time,
                        event_status,
                        total_capacity,
                        available_tickets,
                        ticket_price,
                        venue_id,
                        venue:venues(id, name),
                        musician:musicians(id, stage_name, genre, city, state)
                    `)
                    .eq('venue_id', venue.id);
                
                console.log("🔍 Events query result:", { eventsData, error, venueId: venue.id });

                if (error) {
                    setEventsError(error);
                    console.error("Error fetching events:", error);
                    return;
                }

                // Transform data to match expected format
                const transformedEvents = eventsData?.map(event => ({
                    ...event,
                    startTime: event.start_time,
                    endTime: event.end_time,
                    eventStatus: event.event_status,
                    totalCapacity: event.total_capacity,
                    availableTickets: event.available_tickets,
                    ticketPrice: event.ticket_price
                })) || [];

                setAllEvents(transformedEvents);
            } catch (error) {
                setEventsError(error);
                console.error("Error fetching events:", error);
            } finally {
                setEventsFetching(false);
            }
        };

        fetchEvents();
    }, [venue?.id]);

        // Fetch bookings data
    useEffect(() => {
        const fetchBookings = async () => {
            if (!venue?.id) {
                return;
            }

            setBookingsFetching(true);
            setBookingsError(null);

            try {
                // First get all events for this venue
                const { data: venueEvents, error: eventsError } = await supabase
                    .from('events')
                    .select('id')
                    .eq('venue_id', venue.id);

                if (eventsError) {
                    setBookingsError(eventsError);
                    console.error("Error fetching venue events:", eventsError);
                    return;
                }

                const venueEventIds = venueEvents?.map(event => event.id) || [];

                if (venueEventIds.length === 0) {
                    setAllBookings([]);
                    return;
                }

                // Then get all bookings for those events
                const { data: bookingsData, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        proposed_rate,
                        musician_pitch,
                        created_at,
                        event:events(id, title, date, venue:venues(id, name)),
                        musician:musicians(id, stage_name, genres, city, state, hourly_rate),
                        booked_by
                    `)
                    .in('event_id', venueEventIds);

                if (error) {
                    setBookingsError(error);
                    console.error("Error fetching bookings:", error);
                    return;
                }

                // Transform data to match expected format
                const transformedBookings = bookingsData?.map(booking => ({
                    ...booking,
                    proposedRate: booking.proposed_rate,
                    musicianPitch: booking.musician_pitch,
                    createdAt: booking.created_at
                })) || [];

                setAllBookings(transformedBookings);
            } catch (error) {
                setBookingsError(error);
                console.error("Error fetching bookings:", error);
            } finally {
                setBookingsFetching(false);
            }
        };

        fetchBookings();
    }, [venue?.id]);

                    // Debug logging
                console.log("=== VENUE EVENTS DEBUG ===");
                console.log("User ID:", user?.id);
                console.log("Venue:", venue);
                console.log("Venue ID:", venue?.id);
                console.log("All Events:", allEvents);
                console.log("Events Fetching:", eventsFetching);
                console.log("Events Error:", eventsError);
                console.log("All Bookings:", allBookings);

    // Filter bookings for this venue's events
    const venueBookings = allBookings.filter(booking => {
        if (venue && booking.event?.venue?.id) {
            return booking.event.venue.id === venue.id;
        }
        return true;
    });

    // Mock applications data (keeping this working)
    const applications: any[] = [];

    // Add static proposedRate and musicianPitch to applications data
    const applicationsWithStaticData = applications.map((app: any) => ({
        ...app,
        proposedRate: app.musician?.hourlyRate || 150,
        musicianPitch: "I'm excited to perform at your venue and provide great entertainment for your event!"
    }));

    // Mock musicians data (keeping this working)
    const musiciansData: any[] = [];

    // Supabase action functions
    const updateEvent = async (data: any) => {
        try {
            const { error } = await supabase
                .from('events')
                .update({
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    event_status: data.eventStatus,
                    total_capacity: data.totalCapacity,
                    ticket_price: data.ticketPrice
                })
                .eq('id', data.id);

            if (error) throw error;
            return { id: data.id };
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    };

    const createEvent = async (data: any) => {
        try {
            const { data: newEvent, error } = await supabase
                .from('events')
                .insert([{
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    event_status: data.eventStatus,
                    total_capacity: data.totalCapacity,
                    ticket_price: data.ticketPrice,
                    venue_id: venue?.id
                }])
                .select()
                .single();

            if (error) throw error;
            return newEvent;
        } catch (error) {
            console.error("Error creating event:", error);
            throw error;
        }
    };

    const updateBooking = async (data: any) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({
                    status: data.status,
                    proposed_rate: data.proposedRate
                })
                .eq('id', data.id);

            if (error) throw error;
            return { id: data.id };
        } catch (error) {
            console.error("Error updating booking:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (eventsError) console.error("Error loading events data:", eventsError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
    }, [eventsError, bookingsError]);

    // Helper functions for application management
    const getApplicationCount = (eventId: string) => {
        return venueBookings.filter(booking => booking.event?.id === eventId).length;
    };

    const getEventsWithApplications = () => {
        return allEvents.filter(event => getApplicationCount(event.id) > 0);
    };

    const getPendingApplications = () => {
        const appliedBookings = allBookings.filter((booking: any) => 
            booking.status === "applied" || booking.status === "pending_confirmation"
        );
        return appliedBookings;
    };

    const getEventsWithPendingApplications = () => {
        const pendingAppEventIds = getPendingApplications().map(app => app.event?.id).filter(Boolean);
        return allEvents.filter(event => pendingAppEventIds.includes(event.id));
    };

    // Debug logging for bookings and applications
    console.log("Venue Bookings (filtered):", venueBookings);
    console.log("Pending Applications:", getPendingApplications());
    console.log("Events with Applications:", getEventsWithApplications());

    // Event handlers
    const handleUpdateEvent = async (eventId: string, updates: any) => {
        try {
            console.log("Updating event:", eventId, updates);
            await updateEvent({ id: eventId, ...updates });
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleEventClick = (event: any) => {
        console.log("Event clicked:", event);
        // Navigate to event detail page or open edit dialog
    };

    const handleEditEvent = (event: any) => {
        setEditingEvent(event);
        setEditFormData({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            ticketPrice: event.ticketPrice ? event.ticketPrice.toString() : "",
            totalCapacity: event.totalCapacity ? event.totalCapacity.toString() : "",
            musicianId: event.musicianId || "none",
            status: event.eventStatus || ""
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingEvent) return;

        try {
            await updateEvent({
                id: editingEvent.id,
                title: editFormData.title,
                description: editFormData.description,
                date: editFormData.date,
                startTime: editFormData.startTime,
                endTime: editFormData.endTime,
                ticketPrice: parseFloat(editFormData.ticketPrice) || 0,
                totalCapacity: parseInt(editFormData.totalCapacity) || 0,
                eventStatus: editFormData.status
            });

            setEditDialogOpen(false);
            setEditingEvent(null);
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleAddEvent = async (eventData: any) => {
        try {
            console.log("Adding event:", eventData);
            await createEvent(eventData);
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const getStatusBadge = (status: string | null | undefined) => {
        if (!status) {
            return {
                className: "bg-gray-100 text-gray-800",
                text: "No Status"
            };
        }
        
        const statusColors: Record<string, string> = {
            confirmed: "bg-green-100 text-green-800",
            proposed: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
            open: "bg-blue-100 text-blue-800",
        };
        
        return {
            className: statusColors[status] || "bg-gray-100 text-gray-800",
            text: status.charAt(0).toUpperCase() + status.slice(1)
        };
    };

    const toggleApplicationExpansion = (eventId: string) => {
        const newExpanded = new Set(expandedApplications);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedApplications(newExpanded);
    };

    const handleBookApplication = async (applicationId: string, eventId: string) => {
        try {
            console.log("Booking application:", applicationId, "for event:", eventId);
            await updateBooking({
                id: applicationId,
                status: "confirmed"
            });
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error booking application:", error);
        }
    };

    const handleRejectApplication = async (applicationId: string) => {
        try {
            console.log("Rejecting application:", applicationId);
            await updateBooking({
                id: applicationId,
                status: "rejected"
            });
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting application:", error);
        }
    };

    return {
        // State
        isEditing,
        setIsEditing,
        activeTab,
        setActiveTab,
        editDialogOpen,
        setEditDialogOpen,
        editingEvent,
        setEditingEvent,
        expandedApplications,
        editFormData,
        setEditFormData,

        // Data
        venue,
        allEvents,
        allBookings,
        venueBookings,
        applicationsWithStaticData,
        musiciansData,
        eventsFetching,
        bookingsFetching,
        eventsError,
        bookingsError,

        // Helper functions
        getApplicationCount,
        getEventsWithApplications,
        getPendingApplications,
        getEventsWithPendingApplications,
        getStatusBadge,

        // Event handlers
        handleUpdateEvent,
        handleEventClick,
        handleEditEvent,
        handleEditSubmit,
        handleAddEvent,
        toggleApplicationExpansion,
        handleBookApplication,
        handleRejectApplication,
    };
} 