import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    ArrowLeft, 
    Edit, 
    Save, 
    X, 
    Music, 
    Users, 
    Phone, 
    Mail, 
    ExternalLink,
    MessageCircle,
    Send,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { api } from "@/api";
import { EventHistoryViewer } from "@/components/shared/EventHistoryViewer";

export default function VenueEventManagementPage() {
    const { eventId } = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false);
    const [selectedMusician, setSelectedMusician] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");

    // Sorting state for bookings table
    const [sortColumn, setSortColumn] = useState('applied'); // default sort by Applied
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
            console.log("Initializing editFormData with event:", event);
            setEditFormData({
                title: event.title || "",
                description: event.description || "",
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
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
        fetchEventData();
        fetchBookingsData();
    }, [eventId]);

    const fetchEventData = async () => {
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
        try {
            setBookingsLoading(true);
            
            // Try to fetch bookings with event filter
            let bookings;
            try {
                bookings = await api.booking.findMany({
                    filter: {
                        event: eventId
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
            senderName: "Jazz Master Mike"
        },
        {
            id: "msg-2",
            content: "Thanks for reaching out! We'd love to hear more about your set list and availability.",
            createdAt: "2024-01-15T11:00:00Z",
            sender: "venue",
            senderName: "The Grand Hall"
        },
        {
            id: "msg-3",
            content: "I can do a mix of classic jazz standards and some original compositions. I'm available for the full 4-hour slot.",
            createdAt: "2024-01-15T11:30:00Z",
            sender: "musician",
            senderName: "Jazz Master Mike"
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
            case "pending":
                return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>;
            case "open":
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
        }
    };

    const getEventStatus = () => {
        if (!event) return "loading";
        if (event.musician) {
            return "confirmed";
        } else if (bookingsData && bookingsData.length > 0) {
            return "pending";
        } else {
            return "open";
        }
    };

    const handleRowClick = (booking: any) => {
        setSelectedMusician(booking);
        setCommunicationDialogOpen(true);
    };

    const handleSaveEvent = async () => {
        if (!event?.id || !editFormData) {
            console.error("No event ID or edit data available");
            return;
        }

        try {
            console.log("=== DEBUG: Event Update ===");
            console.log("Event ID:", event.id);
            console.log("Edit form data:", editFormData);
            
            // Prepare all the form data for update (temporarily excluding date)
            const updateData: any = {};

            // Only add fields that have actual values (not empty strings)
            if (editFormData.title && editFormData.title.trim() !== "") {
                updateData.title = editFormData.title.trim();
            }
            
            if (editFormData.description && editFormData.description.trim() !== "") {
                updateData.description = editFormData.description.trim();
            }
            
            if (editFormData.status && editFormData.status.trim() !== "") {
                updateData.status = editFormData.status.trim();
            }
            
            if (editFormData.startTime && editFormData.startTime.trim() !== "") {
                updateData.startTime = editFormData.startTime.trim();
            }
            
            if (editFormData.endTime && editFormData.endTime.trim() !== "") {
                updateData.endTime = editFormData.endTime.trim();
            }

            // Handle numeric fields
            if (editFormData.ticketPrice && editFormData.ticketPrice.trim() !== "") {
                const ticketPrice = parseFloat(editFormData.ticketPrice);
                if (!isNaN(ticketPrice)) {
                    updateData.ticketPrice = ticketPrice;
                }
            }
            
            if (editFormData.totalCapacity && editFormData.totalCapacity.trim() !== "") {
                const totalCapacity = parseInt(editFormData.totalCapacity);
                if (!isNaN(totalCapacity)) {
                    updateData.totalCapacity = totalCapacity;
                }
            }

            // Handle date conversion with proper timezone handling
            if (editFormData.date && editFormData.date.trim() !== "") {
                // Create a proper ISO DateTime string for the selected date at midnight local time
                const dateObj = new Date(editFormData.date + 'T00:00:00');
                updateData.date = dateObj.toISOString();
                
                console.log("Date conversion:", {
                    input: editFormData.date,
                    dateObj: dateObj,
                    output: updateData.date,
                    localTime: dateObj.toLocaleString()
                });
            }

            console.log("=== FINAL UPDATE DATA ===");
            console.log("UpdateData:", updateData);
            console.log("UpdateData JSON:", JSON.stringify(updateData, null, 2));
            console.log("UpdateData keys:", Object.keys(updateData));
            console.log("UpdateData values:", Object.values(updateData));
            
            // Check for undefined/null values
            for (const [key, value] of Object.entries(updateData)) {
                console.log(`Field ${key}:`, {
                    value: value,
                    type: typeof value,
                    isUndefined: value === undefined,
                    isNull: value === null,
                    isString: typeof value === 'string',
                    isEmptyString: value === '',
                    isNaN: typeof value === 'number' && isNaN(value)
                });
            }

            // Test if the API object exists and has the update method
            console.log("=== API DEBUG ===");
            console.log("API object:", api);
            console.log("API.event:", api.event);
            console.log("API.event.update:", typeof api.event.update);
            
            if (!api.event || typeof api.event.update !== 'function') {
                throw new Error("API event update method not available");
            }

            // Call the API to update the event
            console.log("Calling api.event.update with ID:", event.id);
            console.log("Calling api.event.update with data:", updateData);
            
            // Send the data directly, not nested under 'event'
            const updatedEvent = await api.event.update(event.id, updateData);

            console.log("=== API RESPONSE ===");
            console.log("Updated event result:", updatedEvent);
            console.log("Updated event type:", typeof updatedEvent);

            if (updatedEvent) {
                console.log("✅ Event updated successfully:", updatedEvent);
                
                // Refresh the event data from the database to ensure we have the latest values
                await fetchEventData();
                
                // Exit edit mode
                setIsEditing(false);
                
                // Show success message
                alert("✅ Event updated successfully!");
            } else {
                console.error("❌ Failed to update event - no result returned");
                alert("❌ Failed to update event. Please try again.");
            }
            
        } catch (error) {
            console.error("❌ Error updating event:", error);
            console.error("❌ Error details:", {
                eventId: event?.id,
                editFormData: editFormData,
                errorMessage: error.message,
                errorStack: error.stack,
                errorName: error.name,
                errorCode: error.code
            });
            
            // More specific error handling
            if (error.message && error.message.includes("Cannot convert undefined or null to object")) {
                alert("❌ Error: The API is receiving undefined or null values. This might be a field type mismatch.");
            } else if (error.message && error.message.includes("Network")) {
                alert("❌ Network error: Please check your internet connection.");
            } else if (error.message && error.message.includes("401")) {
                alert("❌ Authentication error: Please log in again.");
            } else if (error.message && error.message.includes("403")) {
                alert("❌ Permission error: You don't have permission to update this event.");
            } else if (error.message && error.message.includes("404")) {
                alert("❌ Event not found: The event may have been deleted.");
            } else {
                alert(`❌ Error updating event: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleBookMusician = async (bookingId: string) => {
        // Check if there's already a confirmed booking
        const hasConfirmedBooking = bookingsData.some(b => b.status === "confirmed");
        if (hasConfirmedBooking) {
            console.log("Cannot confirm another musician - there's already a confirmed booking");
            return;
        }

        console.log("Booking musician:", bookingId);
        console.log("🔍 Debug: Booking ID type:", typeof bookingId);
        console.log("🔍 Debug: All bookings data:", bookingsData);
        
        // Find the booking to confirm
        const bookingToConfirm = bookingsData.find(b => b.id === bookingId);
        if (!bookingToConfirm) {
            console.error("Booking not found:", bookingId);
            return;
        }

        console.log("🔍 Debug: Found booking to confirm:", bookingToConfirm);
        console.log("🔍 Debug: Current status:", bookingToConfirm.status);

        try {
            console.log("🔍 Debug: About to call api.booking.update with ID:", bookingToConfirm.id);
            console.log("🔍 Debug: About to call api.booking.update with status: confirmed");
            
            // Update the booking status to confirmed
            const updatedBooking = await api.booking.update(bookingToConfirm.id, {
                status: 'confirmed'
            });

            console.log("🔍 Debug: API call result:", updatedBooking);

            if (updatedBooking) {
                console.log(`✅ Musician ${bookingToConfirm.musician.stageName} confirmed successfully`);
                alert("✅ Musician confirmed successfully! Email will be sent automatically.");
                
                // Note: Since this is static data, we'd need to refresh the page to see the updated status
                // In a real app, you'd want to refetch the data or use proper state management
            } else {
                console.error("❌ Failed to confirm musician - no result returned");
                alert("❌ Failed to confirm musician. Please try again.");
            }
            
        } catch (error) {
            console.error("❌ Error confirming musician:", error);
            console.error("❌ Error details:", error);
            alert("❌ Error confirming musician. Please try again.");
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        console.log("Rejecting booking:", bookingId);
        console.log("🔍 Debug: Booking ID type:", typeof bookingId);
        console.log("🔍 Debug: All bookings data:", bookingsData);
        
        // Find the booking to reject
        const bookingToReject = bookingsData.find(b => b.id === bookingId);
        if (!bookingToReject) {
            console.error("Booking not found:", bookingId);
            return;
        }

        console.log("🔍 Debug: Found booking to reject:", bookingToReject);
        console.log("🔍 Debug: Current status:", bookingToReject.status);

        try {
            console.log("🔍 Debug: About to call api.booking.update with ID:", bookingToReject.id);
            console.log("🔍 Debug: About to call api.booking.update with status: rejected");
            
            // Update the booking status to rejected
            const updatedBooking = await api.booking.update(bookingToReject.id, {
                status: 'rejected'
            });

            console.log("🔍 Debug: API call result:", updatedBooking);

            if (updatedBooking) {
                console.log(`✅ Booking rejected for ${bookingToReject.musician.stageName}`);
                alert("✅ Booking rejected successfully! Email will be sent automatically.");
                
                // Note: Since this is static data, we'd need to refresh the page to see the updated status
                // In a real app, you'd want to refetch the data or use proper state management
            } else {
                console.error("❌ Failed to reject booking - no result returned");
                alert("❌ Failed to reject booking. Please try again.");
            }
            
        } catch (error) {
            console.error("❌ Error rejecting booking:", error);
            console.error("❌ Error details:", error);
            alert("❌ Error rejecting booking. Please try again.");
        }
    };

    const handleCommunicateBooking = async (bookingId: string) => {
        console.log("Setting booking to communicating:", bookingId);
        
        // Find the booking to set to communicating
        const bookingToCommunicate = bookingsData.find(b => b.id === bookingId);
        if (!bookingToCommunicate) {
            console.error("Booking not found:", bookingId);
            return;
        }

        console.log("🔍 Debug: Found booking to communicate:", bookingToCommunicate);
        console.log("🔍 Debug: Current status:", bookingToCommunicate.status);

        try {
            console.log("🔍 Debug: About to call api.booking.update with ID:", bookingToCommunicate.id);
            console.log("🔍 Debug: About to call api.booking.update with status: communicating");
            
            // Update the booking status to communicating
            const updatedBooking = await api.booking.update(bookingToCommunicate.id, {
                status: 'communicating'
            });

            console.log("🔍 Debug: API call result:", updatedBooking);

            if (updatedBooking) {
                console.log(`✅ Booking set to communicating for ${bookingToCommunicate.musician.stageName}`);
                alert("✅ Booking status updated to communicating! You can now message the musician.");
                
                // Open the communication dialog
                setSelectedMusician(bookingToCommunicate);
                setCommunicationDialogOpen(true);
            } else {
                console.error("❌ Failed to update booking status - no result returned");
                alert("❌ Failed to update booking status. Please try again.");
            }
            
        } catch (error) {
            console.error("❌ Error updating booking status:", error);
            console.error("❌ Error details:", error);
            alert("❌ Error updating booking status. Please try again.");
        }
    };

    const handleSendMessage = () => {
        console.log("Sending message to selected musician");
        // TODO: Implement messaging functionality
        alert("Messaging functionality coming soon!");
        setCommunicationDialogOpen(false);
    };

    // Helper to get value for sorting
    const getSortValue = (booking, column) => {
        switch (column) {
            case 'musician':
                return booking.musician.stageName.toLowerCase();
            case 'genre':
                return booking.musician.genre.toLowerCase();
            case 'location':
                return `${booking.musician.city}, ${booking.musician.state}`.toLowerCase();
            case 'rate':
                return booking.proposedRate;
            case 'status':
                return booking.status.toLowerCase();
            case 'applied':
                return new Date(booking.createdAt).getTime();
            default:
                return '';
        }
    };

    // Sort bookingsData for table display
    const sortedBookings = [...bookingsData].sort((a, b) => {
        const aValue = getSortValue(a, sortColumn);
        const bValue = getSortValue(b, sortColumn);
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Helper to render sort indicator
    const renderSortIndicator = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? (
                <span style={{ fontWeight: 700, marginLeft: 2 }}>▲</span>
            ) : (
                <span style={{ fontWeight: 700, marginLeft: 2 }}>▼</span>
            );
        }
        // Faint up/down arrows for unsorted columns
        return <span style={{ color: '#bbb', marginLeft: 2, fontSize: '0.9em' }}>▲▼</span>;
    };

    const confirmedBookings = bookingsData.filter(b => b.status === "confirmed");
    const pendingBookings = bookingsData.filter(b => 
        b.status === "interest_expressed" || b.status === "pending_confirmation"
    );
    const rejectedBookings = bookingsData.filter(b => b.status === "rejected");

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
                            <TabsTrigger value="bookings">History ({bookingsData?.length || 0})</TabsTrigger>
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
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Event Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            type="date"
                                                            value={editFormData?.date || ""}
                                                            onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                                                        />
                                                    ) : (
                                                        <p className="font-medium">
                                                            {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }) : 'N/A'}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <Input
                                                                    value={editFormData?.startTime || ""}
                                                                    onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                                                                    placeholder="Start Time"
                                                                />
                                                                <Input
                                                                    value={editFormData?.endTime || ""}
                                                                    onChange={(e) => setEditFormData({...editFormData, endTime: e.target.value})}
                                                                    placeholder="End Time"
                                                                />
                                                            </>
                                                        ) : (
                                                            <p className="font-medium">
                                                                {event?.startTime || 'N/A'} - {event?.endTime || 'N/A'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            value={editFormData?.totalCapacity || ""}
                                                            onChange={(e) => setEditFormData({...editFormData, totalCapacity: e.target.value})}
                                                            placeholder="Capacity"
                                                        />
                                                    ) : (
                                                        <p className="font-medium">
                                                            {event?.totalCapacity || 'N/A'} people
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Ticket Price</Label>
                                                    {isEditing ? (
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={editFormData?.ticketPrice || ""}
                                                            onChange={(e) => setEditFormData({...editFormData, ticketPrice: e.target.value})}
                                                            placeholder="Price"
                                                        />
                                                    ) : (
                                                        <p className="font-medium">
                                                            ${event?.ticketPrice || 'N/A'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                                {isEditing ? (
                                                    <textarea
                                                        value={editFormData?.description || ""}
                                                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                                        className="w-full border rounded p-2 min-h-[80px]"
                                                        placeholder="Event description"
                                                    />
                                                ) : (
                                                    <p className="text-sm">{event?.description || 'No description'}</p>
                                                )}
                                            </div>
                                            
                                            {/* Edit Event Button - positioned at bottom right */}
                                            <div className="flex justify-end pt-4 border-t">
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={() => setIsEditing(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleSaveEvent}>
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={() => setIsEditing(true)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Event
                                                    </Button>
                                                )}
                                            </div>
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
                                                <p className="font-medium">{event?.venue?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                                <p className="text-sm">
                                                    {event?.venue?.address || 'N/A'}<br />
                                                    {event?.venue?.city || 'N/A'}, {event?.venue?.state || 'N/A'} {event?.venue?.zipCode || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{event?.venue?.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{event?.venue?.email || 'N/A'}</span>
                                            </div>
                                            {event?.venue?.website && (
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
                            )}

                            {/* Musician Information */}
                            {event?.musician && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Booked Musician</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                {event.musician.profilePicture ? (
                                                    <img 
                                                        src={event.musician.profilePicture} 
                                                        alt={event.musician.stageName}
                                                        className="w-16 h-16 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <Music className="h-8 w-8 text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold">{event.musician.stageName}</h3>
                                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Genre:</span>
                                                        <span className="ml-2 font-medium">{event.musician.genre}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Location:</span>
                                                        <span className="ml-2 font-medium">
                                                            {event.musician.city}, {event.musician.state}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Rate:</span>
                                                        <span className="ml-2 font-medium">${event.musician.hourlyRate}/hour</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Contact:</span>
                                                        <span className="ml-2 font-medium">{event.musician.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline">
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Message
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
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
                                    {sortedBookings.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Summary Stats - Moved to top */}
                                            <div className="grid grid-cols-5 gap-4 pb-4 border-b">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {bookingsData.filter((b: any) => b.status === "applied").length}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Applied</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-600">
                                                        {bookingsData.filter((b: any) => b.status === "invited").length}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Invited</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {bookingsData.filter((b: any) => b.status === "communicating").length}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Communicating</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {bookingsData.filter((b: any) => b.status === "confirmed").length}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Confirmed</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-red-600">
                                                        {bookingsData.filter((b: any) => b.status === "rejected").length}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Rejected</div>
                                                </div>
                                            </div>
                                            
                                            {/* Table View */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'musician') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('musician');
                                                            }}>Musician{renderSortIndicator('musician')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'genre') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('genre');
                                                            }}>Genre{renderSortIndicator('genre')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'location') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('location');
                                                            }}>Location{renderSortIndicator('location')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'rate') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('rate');
                                                            }}>Rate{renderSortIndicator('rate')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'status') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('status');
                                                            }}>Status{renderSortIndicator('status')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm cursor-pointer select-none" onClick={() => {
                                                                if (sortColumn === 'applied') setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                                setSortColumn('applied');
                                                            }}>Applied{renderSortIndicator('applied')}</th>
                                                            <th className="text-left py-3 px-2 font-medium text-sm">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedBookings.map((booking) => (
                                                            <tr 
                                                                key={booking.id} 
                                                                className="border-b hover:bg-gray-50 cursor-pointer"
                                                                onClick={() => handleRowClick(booking)}
                                                            >
                                                                <td className="py-3 px-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                                            {booking.musician.profilePicture ? (
                                                                                <img 
                                                                                    src={booking.musician.profilePicture} 
                                                                                    alt={booking.musician.stageName}
                                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <Music className="h-5 w-5 text-gray-500" />
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium">{booking.musician.stageName}</div>
                                                                            <div className="text-sm text-muted-foreground">
                                                                                ${booking.proposedRate}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-2 text-sm">
                                                                    {booking.musician.genre || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-2 text-sm">
                                                                    {booking.musician.city && booking.musician.state 
                                                                        ? `${booking.musician.city}, ${booking.musician.state}`
                                                                        : 'N/A'
                                                                    }
                                                                </td>
                                                                <td className="py-3 px-2 text-sm">
                                                                    <div className="font-medium">${booking.proposedRate}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Proposed Rate
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    {getStatusBadge(booking.status)}
                                                                </td>
                                                                <td className="py-3 px-2 text-sm text-muted-foreground">
                                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td className="py-3 px-2">
                                                                    <div className="flex items-center gap-1">
                                                                        {booking.status === "applied" && (
                                                                            <>
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleBookMusician(booking.id);
                                                                                    }}
                                                                                    disabled={bookingsData.some(b => b.status === "confirmed")}
                                                                                    className={`h-8 px-2 text-xs ${
                                                                                        bookingsData.some(b => b.status === "confirmed") 
                                                                                            ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500" 
                                                                                            : ""
                                                                                    }`}
                                                                                    title={bookingsData.some(b => b.status === "confirmed") ? "Another musician is already confirmed for this event" : ""}
                                                                                >
                                                                                    Confirm
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleCommunicateBooking(booking.id);
                                                                                    }}
                                                                                    className="h-8 px-2 text-xs"
                                                                                >
                                                                                    Communicate
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRejectBooking(booking.id);
                                                                                    }}
                                                                                    className="h-8 px-2 text-xs"
                                                                                >
                                                                                    Reject
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {booking.status === "rejected" && (
                                                                            <>
                                                                                <Button
                                                                                    size="sm"
                                                                                    disabled={true}
                                                                                    className="h-8 px-2 text-xs opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                                                                    title="Cannot confirm a rejected booking"
                                                                                >
                                                                                    Confirm
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    disabled={true}
                                                                                    className="h-8 px-2 text-xs bg-red-600 text-white cursor-not-allowed"
                                                                                    title="Booking has been rejected"
                                                                                >
                                                                                    Rejected
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {booking.status === "confirmed" && (
                                                                            <>
                                                                                <Button
                                                                                    size="sm"
                                                                                    disabled={true}
                                                                                    className="h-8 px-2 text-xs bg-green-600 text-white cursor-not-allowed"
                                                                                    title="Booking has been confirmed"
                                                                                >
                                                                                    Confirmed
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    disabled={true}
                                                                                    className="h-8 px-2 text-xs opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                                                                    title="Cannot reject a confirmed booking"
                                                                                >
                                                                                    Reject
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {booking.status === "invited" && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    console.log("Resending invitation for booking:", booking.id);
                                                                                }}
                                                                                className="h-8 px-2 text-xs"
                                                                            >
                                                                                Resend Invitation
                                                                            </Button>
                                                                        )}
                                                                        {booking.status === "communicating" && (
                                                                            <>
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleBookMusician(booking.id);
                                                                                    }}
                                                                                    disabled={bookingsData.some(b => b.status === "confirmed")}
                                                                                    className={`h-8 px-2 text-xs ${
                                                                                        bookingsData.some(b => b.status === "confirmed") 
                                                                                            ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500" 
                                                                                            : ""
                                                                                    }`}
                                                                                    title={bookingsData.some(b => b.status === "confirmed") ? "Another musician is already confirmed for this event" : ""}
                                                                                >
                                                                                    Confirm
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRejectBooking(booking.id);
                                                                                    }}
                                                                                    className="h-8 px-2 text-xs"
                                                                                >
                                                                                    Reject
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            No bookings found.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Communications Tab */}
                        <TabsContent value="communications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Musician Communications</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Manage communications with the booked musician
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {/* Implementation of communications tab */}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* History Tab */}
                        <TabsContent value="history" className="space-y-6">
                            <EventHistoryViewer eventId={eventId} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}