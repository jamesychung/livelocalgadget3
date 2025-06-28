import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Save, X, CheckCircle, Clock, Users, Music, MapPin, Calendar, DollarSign, MessageSquare, Phone, Mail, ExternalLink } from "lucide-react";
import { useOutletContext } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { BookingMessaging } from "../components/shared/BookingMessaging";

export default function VenueEventManagementPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useOutletContext<AuthOutletContext>();
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        totalCapacity: "",
        status: ""
    });

    // Check if API is properly initialized
    const isApiReady = api && api.event && api.booking && api.musician;
    const isUserAuthenticated = !!user?.id;

    // Fetch event data
    const [{ data: eventsData, fetching: eventFetching, error: eventError }] = useFindMany(api.event, {
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            totalCapacity: true,
            availableTickets: true,
            ticketPrice: true,
            venue: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                phone: true,
                email: true,
                website: true
            },
            musician: {
                id: true,
                stageName: true,
                genre: true,
                city: true,
                state: true,
                phone: true,
                email: true,
                hourlyRate: true
            }
        },
        filter: {
            id: { equals: eventId }
        },
        pause: !isApiReady || !eventId,
    });

    // Get the first (and should be only) event from the results
    const event = eventsData?.[0];

    // Fetch bookings for this event
    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(api.booking, {
        select: {
            id: true,
            status: true,
            proposedRate: true,
            musicianPitch: true,
            createdAt: true,
            musician: {
                id: true,
                stageName: true,
                genre: true,
                city: true,
                state: true,
                phone: true,
                email: true,
                hourlyRate: true,
                profilePicture: true
            }
        },
        filter: {
            event: { id: { equals: eventId } }
        },
        pause: true, // Temporarily disable to test event query
    });

    // Mock action functions (keeping these as mock to prevent useAction errors)
    const updateEvent = async (data: any) => { console.log("Mock updateEvent:", data); };
    const updateBooking = async (data: any) => { console.log("Mock updateBooking:", data); };

    useEffect(() => {
        console.log("=== VENUE EVENT MANAGEMENT DEBUG ===");
        console.log("Event ID:", eventId);
        console.log("User ID:", user?.id);
        console.log("API Ready:", isApiReady);
        console.log("Events Data:", eventsData);
        console.log("Event (first):", event);
        console.log("Event Fetching:", eventFetching);
        console.log("Event Error:", eventError);
        console.log("Bookings Data:", bookingsData);
        console.log("Bookings Fetching:", bookingsFetching);
        console.log("Bookings Error:", bookingsError);
        
        if (eventError) console.error("Error loading event data:", eventError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
    }, [eventId, user?.id, isApiReady, eventsData, event, eventFetching, eventError, bookingsData, bookingsFetching, bookingsError]);

    // Initialize edit form when event data loads
    useEffect(() => {
        if (event) {
            setEditFormData({
                title: event.title || "",
                description: event.description || "",
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
                startTime: event.startTime || "",
                endTime: event.endTime || "",
                ticketPrice: event.ticketPrice?.toString() || "",
                totalCapacity: event.totalCapacity?.toString() || "",
                status: event.status || "confirmed"
            });
        }
    }, [event]);

    // If user is not authenticated, show authentication message
    if (!isUserAuthenticated) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                        <p className="text-muted-foreground mb-6">
                            Please sign in to access event management.
                        </p>
                        <Button asChild>
                            <Link to="/sign-in">
                                Sign In
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // If event is loading, show loading state
    if (eventFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Loading Event...</h1>
                        <p className="text-muted-foreground">Please wait while we load the event information.</p>
                    </div>
                </div>
            </div>
        );
    }

    // If event not found, show error
    if (!event) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            The event you're looking for doesn't exist or you don't have permission to view it.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/venue-events">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Events
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSaveEvent = async () => {
        try {
            await updateEvent({
                id: event.id,
                ...editFormData,
                ticketPrice: parseFloat(editFormData.ticketPrice) || 0,
                totalCapacity: parseInt(editFormData.totalCapacity) || 0,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleBookMusician = async (bookingId: string) => {
        try {
            const booking = bookingsData?.find((b: any) => b.id === bookingId);
            if (booking) {
                // Update booking status to confirmed
                await updateBooking({
                    id: bookingId,
                    status: "confirmed"
                });

                // Update event to have the selected musician
                await updateEvent({
                    id: event.id,
                    status: "confirmed",
                    musician: { _link: booking.musician.id }
                });

                // Refresh the page
                window.location.reload();
            }
        } catch (error) {
            console.error("Error booking musician:", error);
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        try {
            await updateBooking({
                id: bookingId,
                status: "rejected"
            });
            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting booking:", error);
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

    const confirmedBookings = bookingsData?.filter((b: any) => b.status === "confirmed") || [];
    const pendingBookings = bookingsData?.filter((b: any) => 
        b.status === "interest_expressed" || b.status === "pending_confirmation"
    ) || [];
    const rejectedBookings = bookingsData?.filter((b: any) => b.status === "rejected") || [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link to="/venue-events">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Event Management</h1>
                        <p className="text-muted-foreground">
                            Manage event details, bookings, and communications
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSaveEvent}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                        </Button>
                    )}
                </div>
            </div>

            {/* Event Title and Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            {isEditing ? (
                                <Input
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                    className="text-2xl font-bold border-0 p-0 h-auto"
                                    placeholder="Event Title"
                                />
                            ) : (
                                <CardTitle className="text-2xl">{event.title}</CardTitle>
                            )}
                            <p className="text-muted-foreground mt-2">
                                {event.venue?.name} • {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(event.status)}
                            {event.musician && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <Music className="mr-1 h-3 w-3" />
                                    Musician Booked
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings ({bookingsData?.length || 0})</TabsTrigger>
                    <TabsTrigger value="communications">Communications</TabsTrigger>
                    <TabsTrigger value="details">Event Details</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Event Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                                        <p className="font-medium">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                                        <p className="font-medium">
                                            {event.startTime} - {event.endTime}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                                        <p className="font-medium">
                                            {event.totalCapacity} people
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Ticket Price</Label>
                                        <p className="font-medium">
                                            ${event.ticketPrice}
                                        </p>
                                    </div>
                                </div>
                                {event.description && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                        <p className="text-sm">{event.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Venue Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Venue Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Venue Name</Label>
                                    <p className="font-medium">{event.venue?.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                    <p className="text-sm">
                                        {event.venue?.address}<br />
                                        {event.venue?.city}, {event.venue?.state} {event.venue?.zipCode}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{event.venue?.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{event.venue?.email}</span>
                                </div>
                                {event.venue?.website && (
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        <a 
                                            href={event.venue.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {event.venue.website}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Musician Information */}
                    {event.musician && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Booked Musician</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            {event.musician.profilePicture ? (
                                                <img 
                                                    src={event.musician.profilePicture} 
                                                    alt={event.musician.stageName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <Music className="h-6 w-6 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{event.musician.stageName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {event.musician.genre} • {event.musician.city}, {event.musician.state}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                ${event.musician.hourlyRate}/hour
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Message
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{bookingsData?.length || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{pendingBookings.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                                <X className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{rejectedBookings.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Musician Applications</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Review and manage musician applications for this event
                            </p>
                        </CardHeader>
                        <CardContent>
                            {bookingsData && bookingsData.length > 0 ? (
                                <div className="space-y-4">
                                    {bookingsData.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                        {booking.musician.profilePicture ? (
                                                            <img 
                                                                src={booking.musician.profilePicture} 
                                                                alt={booking.musician.stageName}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <Music className="h-6 w-6 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{booking.musician.stageName}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {booking.musician.genre} • {booking.musician.city}, {booking.musician.state}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ${booking.musician.hourlyRate}/hour • Proposed: ${booking.proposedRate}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Applied: {new Date(booking.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(booking.status)}
                                                    {booking.status === "interest_expressed" && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRejectBooking(booking.id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleBookMusician(booking.id)}
                                                            >
                                                                Book Musician
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {booking.musicianPitch && (
                                                <div className="border-t pt-3 mt-3">
                                                    <Label className="text-sm font-medium">Musician's Pitch:</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">{booking.musicianPitch}</p>
                                                </div>
                                            )}
                                            
                                            {/* Messaging Component */}
                                            <div className="border-t pt-3 mt-3">
                                                <BookingMessaging
                                                    bookingId={booking.id}
                                                    eventTitle={event.title}
                                                    musicianName={booking.musician.stageName}
                                                    bookingData={booking}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No applications yet.</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Musicians will be able to apply once the event is published.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Communications Tab */}
                <TabsContent value="communications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Communications</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage all communications related to this event
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Communications feature coming soon.</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    You'll be able to manage all messages and communications here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Event Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Edit event information and settings
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="title">Event Title</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="title"
                                                    value={editFormData.title}
                                                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                                    placeholder="Enter event title"
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{event.title}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            {isEditing ? (
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
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{event.status}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="description"
                                                value={editFormData.description}
                                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                                placeholder="Enter event description"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">{event.description || "No description provided"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Date and Time */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Date & Time</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="date">Date</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={editFormData.date}
                                                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="start-time">Start Time</Label>
                                            {isEditing ? (
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
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{event.startTime}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="end-time">End Time</Label>
                                            {isEditing ? (
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
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{event.endTime}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing and Capacity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Pricing & Capacity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="ticket-price">Ticket Price ($)</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="ticket-price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={editFormData.ticketPrice}
                                                    onChange={(e) => setEditFormData({...editFormData, ticketPrice: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">${event.ticketPrice}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="capacity">Total Capacity</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="capacity"
                                                    type="number"
                                                    min="1"
                                                    value={editFormData.totalCapacity}
                                                    onChange={(e) => setEditFormData({...editFormData, totalCapacity: e.target.value})}
                                                    placeholder="100"
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{event.totalCapacity} people</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 