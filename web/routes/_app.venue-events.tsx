import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Music, Building, Search, Calendar, Clock, MapPin, DollarSign, Users, Edit, X } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import VenueEventCalendar from "../components/shared/VenueEventCalendar";

export default function VenueEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("calendar");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
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

    // Fetch musicians for event creation
    const [{ data: musiciansData, fetching: musiciansFetching }] = useFindMany(api.musician, {
        select: {
            id: true,
            name: true,
            stageName: true,
            genre: true,
            city: true,
            state: true,
            hourlyRate: true
        },
        first: 50,
    });

    // Only initialize useAction hooks when user is authenticated
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
                                <Link to="/venue-profile/edit">
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
            setEditDialogOpen(false);
            setEditingEvent(null);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    // Handle edit event button click
    const handleEditEvent = (event: any) => {
        setEditingEvent(event);
        setEditFormData({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            ticketPrice: event.ticketPrice?.toString() || "",
            totalCapacity: event.totalCapacity?.toString() || "",
            musicianId: event.musician?.id || "none",
            status: event.status || "confirmed"
        });
        setEditDialogOpen(true);
    };

    // Handle edit form submission
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        const updates = {
            title: editFormData.title,
            description: editFormData.description,
            date: editFormData.date,
            startTime: editFormData.startTime,
            endTime: editFormData.endTime,
            ticketPrice: parseFloat(editFormData.ticketPrice) || 0,
            totalCapacity: parseInt(editFormData.totalCapacity) || 0,
            status: editFormData.status,
            ...(editFormData.musicianId && editFormData.musicianId !== "none" && { musician: { id: editFormData.musicianId } })
        };

        await handleUpdateEvent(editingEvent.id, updates);
    };

    // Handle event creation
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
                venue: { id: venue.id },
                ...(eventData.musicianId && { musician: { id: eventData.musicianId } })
            };

            await createEvent(newEvent);
            setIsEditing(false);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            confirmed: "bg-green-100 text-green-800",
            proposed: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
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
                <div className="flex gap-2">
                    <Button asChild>
                        <Link to="/create-event">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Event
                        </Link>
                    </Button>
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

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="actions">Quick Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="space-y-6">
                    <VenueEventCalendar
                        events={allEvents}
                        onAddEvent={handleAddEvent}
                        onUpdateEvent={handleUpdateEvent}
                        onEditEvent={handleEditEvent}
                        isEditing={isEditing}
                        onEditToggle={() => setIsEditing(!isEditing)}
                        title="Venue Events & Bookings"
                        description="Manage your venue's events, bookings, and scheduling. View both confirmed events and proposed bookings."
                    />
                </TabsContent>

                <TabsContent value="list" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Events & Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {allEvents.map((event) => (
                                        <div key={event.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{event.title}</h3>
                                                    {getStatusBadge(event.status)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditEvent(event)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {event.startTime && event.endTime ? 
                                                        `${event.startTime} - ${event.endTime}` : 
                                                        'Time TBD'
                                                    }
                                                </div>
                                                {event.musician && (
                                                    <div className="flex items-center gap-2">
                                                        <Music className="h-4 w-4" />
                                                        <Link 
                                                            to={`/musician/${event.musician.id}`}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {event.musician.stageName || event.musician.name}
                                                        </Link>
                                                    </div>
                                                )}
                                                {event.totalAmount && (
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        ${event.totalAmount}
                                                    </div>
                                                )}
                                            </div>
                                            {event.notes && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {event.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No events found</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit Event Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="edit-title">Event Title *</Label>
                                            <Input
                                                id="edit-title"
                                                value={editFormData.title}
                                                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                                placeholder="Enter event title"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-status">Status</Label>
                                            <Select 
                                                value={editFormData.status} 
                                                onValueChange={(value) => setEditFormData({...editFormData, status: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="proposed">Proposed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                            placeholder="Enter event description"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                {/* Date and Time */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Date & Time</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="edit-date">Date *</Label>
                                            <Input
                                                id="edit-date"
                                                type="date"
                                                value={editFormData.date}
                                                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-start-time">Start Time</Label>
                                            <Select 
                                                value={editFormData.startTime} 
                                                onValueChange={(value) => setEditFormData({...editFormData, startTime: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select start time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({length: 48}, (_, i) => {
                                                        const hour = Math.floor(i / 2);
                                                        const minute = i % 2 === 0 ? '00' : '30';
                                                        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                                                        return (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-end-time">End Time</Label>
                                            <Select 
                                                value={editFormData.endTime} 
                                                onValueChange={(value) => setEditFormData({...editFormData, endTime: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select end time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({length: 48}, (_, i) => {
                                                        const hour = Math.floor(i / 2);
                                                        const minute = i % 2 === 0 ? '00' : '30';
                                                        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                                                        return (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing and Capacity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Pricing & Capacity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="edit-ticket-price">Ticket Price ($)</Label>
                                            <Input
                                                id="edit-ticket-price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={editFormData.ticketPrice}
                                                onChange={(e) => setEditFormData({...editFormData, ticketPrice: e.target.value})}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-capacity">Total Capacity</Label>
                                            <Input
                                                id="edit-capacity"
                                                type="number"
                                                min="1"
                                                value={editFormData.totalCapacity}
                                                onChange={(e) => setEditFormData({...editFormData, totalCapacity: e.target.value})}
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Musician Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Musician</h3>
                                    <div>
                                        <Label htmlFor="edit-musician">Select Musician</Label>
                                        <Select 
                                            value={editFormData.musicianId} 
                                            onValueChange={(value) => setEditFormData({...editFormData, musicianId: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a musician (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No musician</SelectItem>
                                                {musiciansData?.map((musician: any) => (
                                                    <SelectItem key={musician.id} value={musician.id}>
                                                        {musician.stageName || musician.name} - {musician.genre} - ${musician.hourlyRate}/hr
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Update Event
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
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
                                    <Link to="/venue-profile/edit">
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
                </TabsContent>
            </Tabs>
        </div>
    );
} 