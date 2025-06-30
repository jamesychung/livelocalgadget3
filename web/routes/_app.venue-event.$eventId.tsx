import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    ArrowLeft, 
    Music
} from "lucide-react";
import { api } from "@/api";

// Import venue-specific components
import { VenueEventDetailsCard } from "@/components/shared/VenueEventDetailsCard";
import { VenueInfoCard } from "@/components/shared/VenueInfoCard";
import { VenueBookedMusicianCard } from "@/components/shared/VenueBookedMusicianCard";
import { VenueEventActivity } from "@/components/shared/VenueEventActivity";
import { VenueCommunicationsCard } from "@/components/shared/VenueCommunicationsCard";
import { VenueEventHistoryTab } from "@/components/shared/VenueEventHistoryTab";

export default function VenueEventManagementPage() {
    const { eventId } = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    // Sorting state for bookings table
    const [sortColumn, setSortColumn] = useState('applied');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // State for real data
    const [bookingsData, setBookingsData] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [event, setEvent] = useState<any>(null);
    const [eventLoading, setEventLoading] = useState(true);

    // Mock form data - only initialize when event data is loaded
    const [editFormData, setEditFormData] = useState<any>(null);

    // Update editFormData when event data loads
    useEffect(() => {
        if (event) {
            // Handle date conversion properly for timezone
            let dateString = "";
            if (event.date) {
                let localDate;
                
                // Handle different date formats
                if (event.date instanceof Date) {
                    // If it's already a Date object
                    localDate = event.date;
                } else if (typeof event.date === 'string') {
                    // If it's a string, parse it
                    localDate = new Date(event.date);
                } else {
                    // Fallback
                    localDate = new Date(event.date);
                }
                
                // Format as YYYY-MM-DD for the date input
                dateString = localDate.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
            }
            
            setEditFormData({
                title: event.title || "",
                description: event.description || "",
                date: dateString,
                startTime: event.startTime || "",
                endTime: event.endTime || "",
                ticketPrice: event.ticketPrice ? event.ticketPrice.toString() : "",
                totalCapacity: event.totalCapacity ? event.totalCapacity.toString() : "",
                status: event.status || ""
            });
        }
    }, [event]);

    // Fetch real data on component mount
    useEffect(() => {
        if (eventId) {
            fetchEventData();
            fetchBookingsData();
        }
    }, [eventId]);

    const fetchEventData = async () => {
        if (!eventId) return;
        
        try {
            setEventLoading(true);
            const eventData = await api.event.findOne(eventId, {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    date: true,
                    startTime: true,
                    endTime: true,
                    ticketPrice: true,
                    totalCapacity: true,
                    availableTickets: true,
                    status: true,
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
                        hourlyRate: true,
                        profilePicture: true
                    }
                }
            });
            setEvent(eventData);
        } catch (error) {
            console.error("Error fetching event:", error);
            setEvent(null);
        } finally {
            setEventLoading(false);
        }
    };

    const fetchBookingsData = async () => {
        if (!eventId) return;
        
        try {
            setBookingsLoading(true);
            
            // Try to fetch bookings with event filter
            let bookings;
            try {
                bookings = await api.booking.findMany({
                    filter: {
                        event: { id: { equals: eventId } }
                    },
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
                    sort: { createdAt: "Descending" }
                });
            } catch (filterError) {
                console.warn("Event filter failed, fetching all bookings and filtering client-side:", filterError);
                
                // Fallback: fetch all bookings and filter client-side
                const allBookings = await api.booking.findMany({
                    select: {
                        id: true,
                        status: true,
                        proposedRate: true,
                        musicianPitch: true,
                        createdAt: true,
                        event: {
                            id: true
                        },
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
                    sort: { createdAt: "Descending" }
                });
                
                // Filter bookings for this event
                bookings = allBookings.filter(booking => booking.event?.id === eventId);
            }
            
            setBookingsData(bookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookingsData([]);
        } finally {
            setBookingsLoading(false);
        }
    };

    // Mock messages data
    const messages = [
        {
            id: "msg-1",
            content: "Hi! I'm very interested in performing at your jazz night. I have 10+ years of experience and can adapt my set to your audience.",
            createdAt: "2024-01-15T10:30:00Z",
            sender: "musician",
            senderName: "Jazz Master"
        },
        {
            id: "msg-2",
            content: "Thanks for your interest! Could you tell me more about your typical set length and any specific songs you'd like to include?",
            createdAt: "2024-01-15T14:20:00Z",
            sender: "venue",
            senderName: "Venue Manager"
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
            case "communicating":
                return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Communicating</Badge>;
            case "applied":
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Applied</Badge>;
            case "invited":
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Invited</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
        }
    };

    const getEventStatus = () => {
        if (event?.musician) return "confirmed";
        if (bookingsData.some(b => b.status === "communicating")) return "communicating";
        if (bookingsData.some(b => b.status === "applied")) return "pending";
        return "open";
    };

    const handleRowClick = (booking: any) => {
        console.log("Booking clicked:", booking);
        // Could open a detailed view or modal
    };

    const handleSaveEvent = async () => {
        if (!editFormData || !eventId) return;

        try {
            console.log("Saving event with data:", editFormData);
            
            // Prepare update data - only include defined, non-empty values
            const updateData: any = {};
            
            if (editFormData.title && editFormData.title.trim()) {
                updateData.title = editFormData.title.trim();
            }
            if (editFormData.description && editFormData.description.trim()) {
                updateData.description = editFormData.description.trim();
            }
            if (editFormData.date && editFormData.date.trim()) {
                // Convert date to ISO string with proper timezone handling
                // The date input gives us a local date (e.g., 2025-07-23)
                // We need to create a Date object at midnight in the local timezone
                const [year, month, day] = editFormData.date.split('-').map(Number);
                const localDate = new Date(year, month - 1, day); // month is 0-indexed
                
                // Convert to UTC for storage
                updateData.date = localDate.toISOString();
            }
            if (editFormData.startTime && editFormData.startTime.trim()) {
                updateData.startTime = editFormData.startTime.trim();
            }
            if (editFormData.endTime && editFormData.endTime.trim()) {
                updateData.endTime = editFormData.endTime.trim();
            }
            if (editFormData.ticketPrice && editFormData.ticketPrice.trim()) {
                updateData.ticketPrice = parseFloat(editFormData.ticketPrice);
            }
            if (editFormData.totalCapacity && editFormData.totalCapacity.trim()) {
                updateData.totalCapacity = parseInt(editFormData.totalCapacity);
            }
            if (editFormData.status && editFormData.status.trim()) {
                updateData.status = editFormData.status.trim();
            }

            console.log("Final update data:", updateData);

            if (Object.keys(updateData).length === 0) {
                console.log("No changes to save");
                setIsEditing(false);
                return;
            }

            const updatedEvent = await api.event.update(eventId, updateData);
            console.log("Event updated successfully:", updatedEvent);
            
            // Refresh event data
            await fetchEventData();
            setIsEditing(false);
            
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event. Please try again.");
        }
    };

    const handleBookMusician = async (bookingId: string) => {
        try {
            console.log("Confirming booking:", bookingId);
            
            // Update booking status to confirmed
            await api.booking.update(bookingId, {
                status: "confirmed"
            } as any);
            
            // Refresh bookings data
            await fetchBookingsData();
            
            console.log("Booking confirmed successfully");
            
        } catch (error) {
            console.error("Error confirming booking:", error);
            alert("Failed to confirm booking. Please try again.");
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        try {
            console.log("Rejecting booking:", bookingId);
            
            // Update booking status to rejected
            await api.booking.update(bookingId, {
                status: "rejected"
            } as any);
            
            // Refresh bookings data
            await fetchBookingsData();
            
            console.log("Booking rejected successfully");
            
        } catch (error) {
            console.error("Error rejecting booking:", error);
            alert("Failed to reject booking. Please try again.");
        }
    };

    const handleCommunicateBooking = async (bookingId: string) => {
        try {
            console.log("Setting booking to communicating:", bookingId);
            
            // Update booking status to communicating
            await api.booking.update(bookingId, {
                status: "communicating"
            } as any);
            
            // Refresh bookings data
            await fetchBookingsData();
            
            console.log("Booking set to communicating successfully");
            
        } catch (error) {
            console.error("Error setting booking to communicating:", error);
            alert("Failed to update booking status. Please try again.");
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        
        console.log("Sending message:", newMessage);
        // Here you would typically send the message via API
        // For now, just clear the input
        setNewMessage("");
    };

    // Early return if no eventId
    if (!eventId) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Invalid Event</h2>
                    <p className="text-muted-foreground">No event ID provided.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Loading State */}
            {eventLoading || !event ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Loading Event Data...</h2>
                        <p className="text-muted-foreground">Please wait while we fetch the event information.</p>
                    </div>
                </div>
            ) : (
                <>
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
                    </div>

                    {/* Event Title and Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    {isEditing ? (
                                        <Input
                                            value={editFormData?.title || ""}
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
                                    {getStatusBadge(getEventStatus())}
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
                            <TabsTrigger value="overview">Event Details</TabsTrigger>
                            <TabsTrigger value="bookings">Event Activity ({bookingsData?.length || 0})</TabsTrigger>
                            <TabsTrigger value="communications">Communications</TabsTrigger>
                            <TabsTrigger value="history">Event History</TabsTrigger>
                        </TabsList>

                        {/* Event Details Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            {eventLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                        <p>Loading event data...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Event Information */}
                                    <VenueEventDetailsCard
                                        event={event}
                                        isEditing={isEditing}
                                        editFormData={editFormData}
                                        setEditFormData={setEditFormData}
                                        setIsEditing={setIsEditing}
                                        handleSaveEvent={handleSaveEvent}
                                    />

                                    {/* Venue Information */}
                                    <VenueInfoCard venue={event.venue} />
                                </div>
                            )}

                            {/* Musician Information */}
                            {event?.musician && (
                                <VenueBookedMusicianCard musician={event.musician} />
                            )}
                        </TabsContent>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="space-y-6">
                            <VenueEventActivity
                                bookingsData={bookingsData}
                                bookingsLoading={bookingsLoading}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                setSortColumn={setSortColumn}
                                setSortDirection={setSortDirection}
                                handleRowClick={handleRowClick}
                                handleBookMusician={handleBookMusician}
                                handleRejectBooking={handleRejectBooking}
                                handleCommunicateBooking={handleCommunicateBooking}
                            />
                        </TabsContent>

                        {/* Communications Tab */}
                        <TabsContent value="communications" className="space-y-6">
                            <VenueCommunicationsCard
                                messages={messages}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                handleSendMessage={handleSendMessage}
                            />
                        </TabsContent>

                        {/* History Tab */}
                        <TabsContent value="history" className="space-y-6">
                            <VenueEventHistoryTab eventId={eventId} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}