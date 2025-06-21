import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Music, Building, Search, Calendar } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import VenueEventCalendar from "../components/shared/VenueEventCalendar";

export default function VenueEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Fetch venue data
    const [{ data: venueData, fetching: venueFetching, error: venueError }] = useFindMany(api.venue, {
        filter: { owner: { id: { equals: user?.id } } },
        select: {
            id: true, 
            name: true, 
            city: true,
            state: true
        },
        first: 1,
        pause: !user?.id,
    });

    const venue: any = venueData?.[0];

    // Fetch events for this venue
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true,
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            totalCapacity: true,
            availableTickets: true,
            ticketPrice: true,
            musician: {
                id: true,
                name: true,
                stageName: true
            }
        },
        pause: !venue?.id,
    });

    // Fetch bookings for this venue
    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(api.booking, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            totalAmount: true,
            musician: {
                id: true,
                name: true,
                stageName: true
            }
        },
        pause: !venue?.id,
    });

    const [updateEventResult, updateEvent] = useAction(api.event.update);
    const [createEventResult, createEvent] = useAction(api.event.create);

    useEffect(() => {
        if (venueError) console.error("Error loading venue data:", venueError);
        if (eventsError) console.error("Error loading events data:", eventsError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
    }, [venueError, eventsError, bookingsError]);

    // Show loading state while fetching
    if (venueFetching || eventsFetching || bookingsFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your venue events...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no venue profile found, show a message with option to create one
    if (!venue) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Venue Events Management</h1>
                        <p className="text-muted-foreground mb-6">
                            It looks like you haven't created your venue profile yet. Create your profile to start managing your events and bookings.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/venue-profile/create">
                                    Create Venue Profile
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/venue-dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Combine events and bookings into a single events array
    const allEvents = [
        ...(eventsData || []).map((event: any) => ({
            id: event.id,
            title: event.title,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            status: event.status || 'confirmed',
            musician: event.musician,
            totalAmount: event.ticketPrice,
            notes: `Capacity: ${event.totalCapacity}, Available: ${event.availableTickets}`
        })),
        ...(bookingsData || []).map((booking: any) => ({
            id: `booking-${booking.id}`,
            title: `Booking - ${booking.musician?.stageName || booking.musician?.name || 'Musician'}`,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status || 'proposed',
            musician: booking.musician,
            totalAmount: booking.totalAmount,
            notes: 'Venue booking'
        }))
    ];

    // Handle event updates
    const handleUpdateEvent = async (eventId: string, updates: any) => {
        try {
            await updateEvent({
                id: eventId,
                ...updates
            });
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    // Handle event creation
    const handleAddEvent = async (eventData: any) => {
        try {
            await createEvent({
                ...eventData,
                venue: { id: venue.id }
            });
        } catch (error) {
            console.error("Error creating event:", error);
        }
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
                        <h1 className="text-3xl font-bold">Venue Events Management</h1>
                        <p className="text-muted-foreground">
                            Manage events and bookings for {venue.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allEvents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All events and bookings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confirmed Events</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {allEvents.filter(e => e.status === 'confirmed').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Confirmed events
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proposed Events</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {allEvents.filter(e => e.status === 'proposed').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pending confirmation
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {allEvents.filter(e => {
                                const eventDate = new Date(e.date);
                                const now = new Date();
                                return eventDate.getMonth() === now.getMonth() && 
                                       eventDate.getFullYear() === now.getFullYear();
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Events this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Venue Event Calendar */}
            <VenueEventCalendar
                events={allEvents}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
                title="Venue Events & Bookings"
                description="Manage your venue's events, bookings, and scheduling. View both confirmed events and proposed bookings."
            />

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button asChild className="h-20">
                            <Link to="/search/musicians">
                                <div className="text-center">
                                    <Search className="h-6 w-6 mx-auto mb-2" />
                                    <div>Find Musicians</div>
                                    <div className="text-xs text-muted-foreground">Book new talent</div>
                                </div>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-20">
                            <Link to="/venue-dashboard?tab=bookings">
                                <div className="text-center">
                                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                                    <div>View Bookings</div>
                                    <div className="text-xs text-muted-foreground">Manage requests</div>
                                </div>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-20">
                            <Link to="/profile">
                                <div className="text-center">
                                    <Building className="h-6 w-6 mx-auto mb-2" />
                                    <div>Venue Profile</div>
                                    <div className="text-xs text-muted-foreground">Update details</div>
                                </div>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 