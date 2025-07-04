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
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            console.log('Attempting to update booking:', data);
            
            const { data: updateResult, error } = await supabase
                .from('bookings')
                .update({
                    status: data.status,
                    proposed_rate: data.proposedRate
                })
                .eq('id', data.id)
                .select();

            if (error) {
                console.error("Supabase error updating booking:", error);
                throw error;
            }
            
            console.log('Booking update result:', updateResult);
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
            booking.status === "applied"
        );
        return appliedBookings;
    };

    const getEventsWithPendingApplications = () => {
        const pendingAppEventIds = getPendingApplications().map(app => app.event?.id).filter(Boolean);
        return allEvents.filter(event => pendingAppEventIds.includes(event.id));
    };



    // Event handlers
    const handleUpdateEvent = async (eventId: string, updates: any) => {
        try {
            await updateEvent({ id: eventId, ...updates });
            // Update local state immediately
            setAllEvents((prevEvents: any[]) => 
                prevEvents.map((event: any) => 
                    event.id === eventId 
                        ? { ...event, ...updates }
                        : event
                )
            );
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleEventClick = (event: any) => {
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
            // Update local state immediately
            setAllEvents((prevEvents: any[]) => 
                prevEvents.map((event: any) => 
                    event.id === editingEvent.id 
                        ? { 
                            ...event, 
                            title: editFormData.title,
                            description: editFormData.description,
                            date: editFormData.date,
                            startTime: editFormData.startTime,
                            endTime: editFormData.endTime,
                            ticketPrice: parseFloat(editFormData.ticketPrice) || 0,
                            totalCapacity: parseInt(editFormData.totalCapacity) || 0,
                            eventStatus: editFormData.status
                        }
                        : event
                )
            );
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleAddEvent = async (eventData: any) => {
        try {
            const newEvent = await createEvent(eventData);
            // Add to local state immediately
            setAllEvents((prevEvents: any[]) => [...prevEvents, newEvent]);
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
            applied: "bg-blue-100 text-blue-800",
            booked: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            completed: "bg-gray-100 text-gray-800",
            open: "bg-blue-100 text-blue-800",
        };
        
        const statusLabels: Record<string, string> = {
            applied: "📝 Applied",
            booked: "⭐ Selected",
            confirmed: "✅ Confirmed",
            cancelled: "❌ Cancelled",
            completed: "🎉 Completed",
            open: "Open",
        };
        
        return {
            className: statusColors[status] || "bg-gray-100 text-gray-800",
            text: statusLabels[status] || status.charAt(0).toUpperCase() + status.slice(1)
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
            console.log('Venue selecting musician for booking:', applicationId);
            console.log('Current user:', user);
            console.log('Current venue:', venue);
            
            // First, let's check if the booking exists and get its current data
            const { data: currentBooking, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', applicationId)
                .single();
                
            if (fetchError) {
                console.error('Error fetching current booking:', fetchError);
                return;
            }
            
            console.log('Current booking data:', currentBooking);
            console.log('Booking venue_id:', currentBooking.venue_id);
            console.log('Current venue id:', venue?.id);
            console.log('Are they the same?', currentBooking.venue_id === venue?.id);
            console.log('Booking booked_by:', currentBooking.booked_by);
            console.log('Current user id:', user?.id);
            console.log('Are they the same?', currentBooking.booked_by === user?.id);
            
            // Try to update the booking status first (using booked_by field for RLS)
            console.log('Updating booking status...');
            console.log('Update data:', { status: 'selected' });
            console.log('Booking ID:', applicationId);
            console.log('Current user ID:', user.id);
            
            // Update venue_id and set selected_at timestamp (trigger will set status to 'selected')
            console.log('Updating booking venue_id and selected_at...');
            const { data: updateResult, error: updateError } = await supabase
                .from('bookings')
                .update({ 
                    venue_id: venue.id,
                    selected_at: new Date().toISOString()
                })
                .eq('id', applicationId)
                .select();
                
            if (updateError) {
                console.error('Failed to update booking:', updateError);
                console.error('Error details:', {
                    message: updateError.message,
                    details: updateError.details,
                    hint: updateError.hint,
                    code: updateError.code
                });
                return;
            } else {
                console.log('Successfully updated booking:', updateResult);
            }
            
            console.log('Booking updated in database, updating local state...');
            
            // Update local state immediately
            setAllBookings((prevBookings: any[]) => {
                const updatedBookings = prevBookings.map((booking: any) => 
                    booking.id === applicationId 
                        ? { ...booking, status: 'selected', venue_id: venue.id }
                        : booking
                );
                console.log('Updated bookings in local state:', updatedBookings.filter(b => b.id === applicationId));
                return updatedBookings;
            });
            
            // Force re-render of components
            setRefreshTrigger(prev => prev + 1);
            
            console.log('Local state updated successfully');
            
            // Trigger a refetch of bookings to ensure we have the latest data
            setTimeout(() => {
                // Re-fetch bookings to ensure we have the latest data
                const refetchBookings = async () => {
                    try {
                        const { data: refetchData, error: refetchError } = await supabase
                            .from('bookings')
                            .select(`
                                *,
                                event:events (
                                    id,
                                    title,
                                    date,
                                    start_time,
                                    end_time,
                                    description,
                                    venue:venues (
                                        id, 
                                        name, 
                                        address,
                                        city,
                                        state
                                    )
                                ),
                                musician:musicians (
                                    id,
                                    stage_name,
                                    email,
                                    profile_picture
                                )
                            `)
                            .eq('venue_id', venue?.id);

                        if (refetchError) {
                            console.error("Error refetching bookings:", refetchError);
                        } else {
                            console.log('Refetched bookings:', refetchData);
                            setAllBookings(refetchData || []);
                        }
                    } catch (error) {
                        console.error("Error refetching bookings:", error);
                    }
                };
                refetchBookings();
            }, 500);
            
            // Verify the update by fetching the booking again
            setTimeout(async () => {
                const { data: verifyBooking, error: verifyError } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', applicationId)
                    .single();
                    
                if (verifyError) {
                    console.error('Error verifying booking update:', verifyError);
                } else {
                    console.log('Verified booking in database:', verifyBooking);
                }
            }, 1000);
        } catch (error) {
            console.error("Error booking application:", error);
        }
    };

    const handleRejectApplication = async (applicationId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ cancelled_at: new Date().toISOString() })
                .eq('id', applicationId);
                
            if (error) throw error;
            
            // Update local state immediately
            setAllBookings((prevBookings: any[]) => 
                prevBookings.map((booking: any) => 
                    booking.id === applicationId 
                        ? { ...booking, status: 'cancelled' }
                        : booking
                )
            );
            
            // Force re-render of components
            setRefreshTrigger(prev => prev + 1);
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
        refreshTrigger,
        setRefreshTrigger,

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