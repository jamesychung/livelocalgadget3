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
import { ArrowLeft, Plus, Music, Building, Search, Calendar, Clock, MapPin, DollarSign, Users, Edit, X, CheckCircle } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import VenueEventCalendar from "../components/shared/VenueEventCalendar";
import { BookingMessaging } from "../components/shared/BookingMessaging";
// import MonthlyCalendar from "../components/shared/MonthlyCalendar";
// import { CreateEventForm } from "../components/shared/CreateEventForm";

export default function VenueEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
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

    // Mock venue data (keeping this working)
    const venue: any = { id: "mock-venue-1", name: "The Grand Hall", city: "Austin", state: "TX" };

    // Fetch events for this venue (real API call)
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
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
                stageName: true
            }
        },
        pause: !isApiReady,
    });

    const allEvents: any[] = eventsData || [];

    // Mock applications data (keeping this working)
    const applications: any[] = [];

    // Mock musicians data (keeping this working)
    const musiciansData: any[] = [];

    // Mock action functions (keeping these as mock to prevent useAction errors)
    const updateEvent = async (data: any) => { console.log("Mock updateEvent:", data); };
    const createEvent = async (data: any) => { console.log("Mock createEvent:", data); };
    const updateBooking = async (data: any) => { console.log("Mock updateBooking:", data); };

    useEffect(() => {
        console.log("=== VENUE EVENTS DEBUG ===");
        console.log("User ID:", user?.id);
        console.log("API Ready:", isApiReady);
        console.log("User Authenticated:", isUserAuthenticated);
        console.log("Events Data:", eventsData);
        console.log("All Events:", allEvents);
        console.log("Events Fetching:", eventsFetching);
        console.log("Events Error:", eventsError);
        
        if (eventsError) console.error("Error loading events data:", eventsError);
    }, [eventsError, user?.id, isApiReady, isUserAuthenticated, eventsData, allEvents, eventsFetching]);

    // If user is not authenticated, show authentication message
    // if (!isUserAuthenticated) {
    //     return (
    //         <div className="container mx-auto p-6">
    //             <div className="flex items-center justify-center min-h-[400px]">
    //                 <div className="text-center max-w-md">
    //                     <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
    //                     <p className="text-muted-foreground mb-6">
    //                         Please sign in to access venue events management.
    //                     </p>
    //                     <Button asChild>
    //                         <Link to="/sign-in">
    //                             Sign In
    //                         </Link>
    //                     </Button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

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
                            <Button asChild>
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

    // TODO: Re-enable data processing once API is configured
    /*
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
        }))
    ];

    const applications: any[] = (applicationsData || []).filter((app: any) => {
        const matchesVenue = app.event?.venue?.id === venue?.id;
        console.log(`Application ${app.id} venue check:`, {
            appVenueId: app.event?.venue?.id,
            venueId: venue?.id,
            matches: matchesVenue
        });
        return matchesVenue;
    });

    // Debug logging to troubleshoot application linking
    console.log("=== VENUE EVENTS DEBUG ===");
    console.log("Venue ID:", venue?.id);
    console.log("Events data:", eventsData);
    console.log("All applications data:", applicationsData);
    console.log("Filtered applications for this venue:", applications);
    console.log("All events:", allEvents);
    
    // Log each application's event relationship
    applications.forEach((app, index) => {
        console.log(`Application ${index}:`, {
            id: app.id,
            eventId: app.event?.id,
            eventTitle: app.event?.title,
            eventVenueId: app.event?.venue?.id,
            musicianName: app.musician?.stageName,
            status: app.status
        });
    });
    */

    // Helper functions for application management
    const getApplicationCount = (eventId: string) => {
        return applications.filter(app => app.event?.id === eventId).length;
    };

    const getEventsWithApplications = () => {
        return allEvents.filter(event => getApplicationCount(event.id) > 0);
    };

    const getPendingApplications = () => {
        return applications.filter(app => 
            app.status === "interest_expressed" || app.status === "pending_confirmation"
        );
    };

    const getEventsWithPendingApplications = () => {
        const pendingAppEventIds = getPendingApplications().map(app => app.event?.id);
        return allEvents.filter(event => pendingAppEventIds.includes(event.id));
    };

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
                venue: { id: venue?.id ?? "no-venue" },
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

    // Toggle application expansion
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

    // Handle booking an application
    const handleBookApplication = async (applicationId: string, eventId: string) => {
        try {
            // Update the booking status to confirmed
            await updateBooking({
                id: applicationId,
                status: "confirmed"
            });

            // Update the event to have the selected musician
            const application = applications.find(app => app.id === applicationId);
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

    // Handle rejecting an application
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

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link to="/venue-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Venue Events Management</h1>
                        <p className="text-muted-foreground">
                            Manage events and bookings for {venue?.name ?? "your venue"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Create Event button moved to calendar section */}
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
                            All events
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Events with Applications</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {getEventsWithApplications().length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {applications.length} total applications
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {getPendingApplications().length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting your decision
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
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
                    <TabsTrigger value="pending-events">Events with Applications</TabsTrigger>
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
                                    {allEvents.map((event) => {
                                        const applicationCount = getApplicationCount(event.id);
                                        return (
                                            <div key={event.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{event.title}</h3>
                                                        {applicationCount > 0 && (
                                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                                {applicationCount} Musician{applicationCount !== 1 ? 's' : ''} Applied
                                                            </Badge>
                                                        )}
                                                        {getStatusBadge(event.status)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm text-muted-foreground">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                        <Button
                                                            className="h-8 px-3 text-xs"
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
                                                                {event.musician.stageName}
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
                                                {applicationCount > 0 && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <Button 
                                                            asChild
                                                            onClick={() => setActiveTab("pending-events")}
                                                        >
                                                            Review {applicationCount} Application{applicationCount !== 1 ? 's' : ''}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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
                                                onValueChange={(value: string) => setEditFormData({...editFormData, status: value})}
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
                                                onValueChange={(value: string) => setEditFormData({...editFormData, startTime: value})}
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
                                                onValueChange={(value: string) => setEditFormData({...editFormData, endTime: value})}
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
                                            onValueChange={(value: string) => setEditFormData({...editFormData, musicianId: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a musician (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No musician</SelectItem>
                                                {musiciansData?.map((musician: any) => (
                                                    <SelectItem key={musician.id} value={musician.id}>
                                                        {musician.stageName} - {musician.genre} - ${musician.hourlyRate}/hr
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

                <TabsContent value="pending-events" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Events with Applications</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Review and select musicians for your events
                            </p>
                        </CardHeader>
                        <CardContent>
                            {getEventsWithApplications().length > 0 ? (
                                <div className="space-y-4">
                                    {getEventsWithApplications().map((event) => {
                                        const eventApplications = applications.filter(app => app.event?.id === event.id);
                                        const pendingCount = eventApplications.filter(app => 
                                            app.status === "interest_expressed" || app.status === "pending_confirmation"
                                        ).length;
                                        const isExpanded = expandedApplications.has(event.id);
                                        
                                        return (
                                            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-lg">{event.title}</h3>
                                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                                Musicians Applied
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                                weekday: 'short', month: 'short', day: 'numeric',
                                                                hour: 'numeric', minute: '2-digit'
                                                            })}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                {eventApplications.length} total application{eventApplications.length !== 1 ? 's' : ''}
                                                            </span>
                                                            {pendingCount > 0 && (
                                                                <span className="flex items-center gap-1 text-orange-600">
                                                                    <Clock className="h-4 w-4" />
                                                                    {pendingCount} pending review
                                                                </span>
                                                            )}
                                                            {pendingCount === 0 && eventApplications.length > 0 && (
                                                                <span className="flex items-center gap-1 text-green-600">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                    All reviewed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        className="h-8 px-3 text-xs"
                                                        onClick={() => toggleApplicationExpansion(event.id)}
                                                    >
                                                        {isExpanded ? "Hide Applications" : "Review Applications"}
                                                    </Button>
                                                </div>
                                                
                                                {/* Expanded Applications View */}
                                                {isExpanded && (
                                                    <div className="border-t pt-4 mt-4">
                                                        <div className="space-y-4">
                                                            {/* Event Details */}
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <h4 className="font-semibold mb-3">Event Details</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <strong>Title:</strong> {event.title}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Time:</strong> {event.startTime} - {event.endTime}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Status:</strong> {event.status}
                                                                    </div>
                                                                    {event.notes && (
                                                                        <div className="md:col-span-2">
                                                                            <strong>Notes:</strong> {event.notes}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Applications List */}
                                                            <div>
                                                                <h4 className="font-semibold mb-3">Musician Applications</h4>
                                                                <div className="space-y-3">
                                                                    {eventApplications.map((app) => (
                                                                        <div key={app.id} className="border rounded-lg p-4 bg-white">
                                                                            <div className="flex items-start justify-between mb-3">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-2">
                                                                                        <h5 className="font-medium">
                                                                                            {app.musician?.stageName}
                                                                                        </h5>
                                                                                        <Badge className="text-xs">
                                                                                            {app.status.replace("_", " ").toUpperCase()}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                                                        <div>
                                                                                            <strong>Proposed Rate:</strong> ${app.proposedRate}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Location:</strong> {app.musician?.city}, {app.musician?.state}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Genre:</strong> {app.musician?.genre}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Button
                                                                                        className="h-8 px-3 text-xs"
                                                                                        onClick={() => window.open(`/musician/${app.musician?.id}`, '_blank')}
                                                                                    >
                                                                                        Musician Profile
                                                                                    </Button>
                                                                                    {app.status === "interest_expressed" && (
                                                                                        <>
                                                                                            <Button
                                                                                                className="h-8 px-3 text-xs text-red-600 hover:text-red-700"
                                                                                                onClick={() => handleRejectApplication(app.id)}
                                                                                            >
                                                                                                Reject
                                                                                            </Button>
                                                                                            <Button
                                                                                                className="h-8 px-3 text-xs"
                                                                                                onClick={() => handleBookApplication(app.id, event.id)}
                                                                                            >
                                                                                                Book
                                                                                            </Button>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {app.musicianPitch && (
                                                                                <div className="border-t pt-3 mt-3">
                                                                                    <strong className="text-sm">Musician's Pitch:</strong>
                                                                                    <p className="text-sm text-muted-foreground mt-1">{app.musicianPitch}</p>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {/* Messaging Component */}
                                                                            <BookingMessaging
                                                                                bookingId={app.id}
                                                                                eventTitle={event.title}
                                                                                musicianName={app.musician?.stageName}
                                                                                bookingData={app}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No events with applications yet.</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Create open events to start receiving musician applications!
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link to="/create-event">
                                            Create Event
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 