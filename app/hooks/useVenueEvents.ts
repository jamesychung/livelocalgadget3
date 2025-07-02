import { useState, useEffect } from "react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

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

    // Check if API is properly initialized
    const isApiReady = api && api.venue && api.event && api.booking && api.musician;
    const isUserAuthenticated = !!user?.id;

    // Real venue data - fetch from API
    const [{ data: venueData }] = useFindMany(api.venue, {
        select: {
            id: true,
            name: true,
            city: true,
            state: true
        },
        filter: {
            owner: { id: { equals: user?.id } }
        },
        pause: !isApiReady || !user?.id,
    });

    const venue = venueData?.[0]; // Get the first venue for this user

    // Fetch events for this venue (real API call)
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true,
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            eventStatus: true,
            totalCapacity: true,
            availableTickets: true,
            ticketPrice: true,
            venue: {
                id: true,
                name: true
            },
            musician: {
                id: true,
                stageName: true,
                genre: true,
                city: true,
                state: true
            }
        },
        pause: !venue?.id,
    });

    const allEvents: any[] = eventsData || [];

    // Debug logging
    console.log("=== VENUE EVENTS DEBUG ===");
    console.log("API Ready:", isApiReady);
    console.log("User ID:", user?.id);
    console.log("Venue:", venue);
    console.log("Venue ID:", venue?.id);
    console.log("Events Data:", eventsData);
    console.log("All Events:", allEvents);
    console.log("Events Fetching:", eventsFetching);
    console.log("Events Error:", eventsError);

    // Fetch bookings data
    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(api.booking, {
        select: {
            id: true,
            status: true,
            proposedRate: true,
            musicianPitch: true,
            createdAt: true,
            event: {
                id: true,
                title: true,
                date: true,
                venue: {
                    id: true,
                    name: true
                }
            },
            musician: {
                id: true,
                stageName: true,
                genres: true,
                city: true,
                state: true,
                hourlyRate: true
            },
            bookedBy: {
                id: true
            }
        },
        pause: !isApiReady,
    });

    const allBookings: any[] = bookingsData || [];

    // Filter bookings for this venue's events
    const venueBookings = allBookings.filter(booking => {
        // Filter bookings for events that belong to this venue
        if (venue && booking.event?.venue?.id) {
            return booking.event.venue.id === venue.id;
        }
        // For now, include all bookings if venue filtering isn't set up
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

    // Mock action functions (keeping these as mock to prevent useAction errors)
    const updateEvent = async (data: any) => { console.log("Mock updateEvent:", data); };
    const createEvent = async (data: any) => { console.log("Mock createEvent:", data); };
    const updateBooking = async (data: any) => { console.log("Mock updateBooking:", data); };

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

    // Event handlers
    const handleUpdateEvent = async (eventId: string, updates: any) => {
        try {
            console.log("Updating event:", eventId, updates);
            await updateEvent({ id: eventId, ...updates });
            // Refresh data or update local state
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
            await handleUpdateEvent(editingEvent.id, editFormData);
            setEditDialogOpen(false);
            setEditingEvent(null);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleAddEvent = async (eventData: any) => {
        try {
            const newEvent = {
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                ticketPrice: parseFloat(eventData.ticketPrice) || 0,
                totalCapacity: parseInt(eventData.totalCapacity) || 0,
                venue: { id: venue?.id ?? "no-venue" },
                ...(eventData.musicianId && { musician: { id: eventData.musicianId } })
            };

            await createEvent(newEvent);
            setIsEditing(false);
        } catch (error) {
            console.error("Error creating event:", error);
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
        setExpandedApplications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    const handleBookApplication = async (applicationId: string, eventId: string) => {
        try {
            // Update the booking status to confirmed
            await updateBooking({
                id: applicationId,
                status: "confirmed"
            });

            // Update the event to have the selected musician
            const application = applicationsWithStaticData.find(app => app.id === applicationId);
            if (application) {
                await updateEvent({
                    id: eventId,
                    status: "confirmed",
                    musician: { _link: application.musician.id }
                });
            }

            // Refresh the page or update local state
            window.location.reload();
        } catch (error) {
            console.error("Error booking application:", error);
            alert("Error booking application. Please try again.");
        }
    };

    const handleRejectApplication = async (applicationId: string) => {
        try {
            await updateBooking({
                id: applicationId,
                status: "rejected"
            });

            // Refresh the page or update local state
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting application:", error);
            alert("Error rejecting application. Please try again.");
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

        // Mock functions
        updateEvent,
        createEvent,
        updateBooking,
    };
} 