import React, { useState } from "react";
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

    // Static mock data for demonstration
    const event = {
        id: eventId,
        title: "Jazz Night at The Grand Hall",
        description: "An evening of smooth jazz featuring local and regional talent. Perfect for date night or corporate events.",
        date: "2024-02-15T19:00:00Z",
        startTime: "19:00",
        endTime: "23:00",
        ticketPrice: 45,
        totalCapacity: 200,
        availableTickets: 150,
        status: "confirmed",
        venue: {
            name: "The Grand Hall",
            address: "123 Main Street",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            phone: "(512) 555-0123",
            email: "info@grandhall.com",
            website: "https://grandhall.com"
        },
        musician: {
            id: "musician-2",
            stageName: "Sarah Keys",
            genre: "Classical",
            city: "Houston",
            state: "TX",
            phone: "(713) 555-0202",
            email: "sarah@sarahkeys.com",
            hourlyRate: 175,
            profilePicture: null
        }
    };

    // Static mock bookings data
    const bookingsData = [
        {
            id: "booking-1",
            status: "applied",
            proposedRate: 150,
            musicianPitch: "I'm a versatile jazz guitarist with 10+ years of experience performing at venues like yours. I can adapt my set to match your audience perfectly.",
            createdAt: "2024-01-15T10:30:00Z",
            musician: {
                id: "musician-1",
                stageName: "Jazz Master Mike",
                genre: "Jazz",
                city: "Austin",
                state: "TX",
                phone: "(512) 555-0101",
                email: "mike@jazzmaster.com",
                hourlyRate: 140,
                profilePicture: null
            }
        },
        {
            id: "booking-2", 
            status: "confirmed",
            proposedRate: 180,
            musicianPitch: "Classical pianist with formal training. Perfect for elegant events and sophisticated audiences.",
            createdAt: "2024-01-14T14:20:00Z",
            musician: {
                id: "musician-2",
                stageName: "Sarah Keys",
                genre: "Classical",
                city: "Houston",
                state: "TX", 
                phone: "(713) 555-0202",
                email: "sarah@sarahkeys.com",
                hourlyRate: 175,
                profilePicture: null
            }
        },
        {
            id: "booking-3",
            status: "communicating", 
            proposedRate: 120,
            musicianPitch: "Country singer-songwriter with original material and covers. Great for casual, fun atmosphere.",
            createdAt: "2024-01-16T09:15:00Z",
            musician: {
                id: "musician-3",
                stageName: "Cowboy Chris",
                genre: "Country",
                city: "Dallas",
                state: "TX",
                phone: "(214) 555-0303", 
                email: "chris@cowboychris.com",
                hourlyRate: 110,
                profilePicture: null
            }
        },
        {
            id: "booking-4",
            status: "rejected",
            proposedRate: 200,
            musicianPitch: "Rock band looking for high-energy performances. We bring our own equipment.",
            createdAt: "2024-01-13T16:45:00Z", 
            musician: {
                id: "musician-4",
                stageName: "The Rockers",
                genre: "Rock",
                city: "San Antonio",
                state: "TX",
                phone: "(210) 555-0404",
                email: "band@therockers.com", 
                hourlyRate: 190,
                profilePicture: null
            }
        },
        {
            id: "booking-5",
            status: "invited",
            proposedRate: 95,
            musicianPitch: "Acoustic folk singer with warm vocals. Perfect for intimate settings and background music.",
            createdAt: "2024-01-17T11:00:00Z",
            musician: {
                id: "musician-5", 
                stageName: "Folk Emma",
                genre: "Folk",
                city: "Austin",
                state: "TX",
                phone: "(512) 555-0505",
                email: "emma@folkemma.com",
                hourlyRate: 90,
                profilePicture: null
            }
        }
    ];

    // Mock form data
    const [editFormData, setEditFormData] = useState({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        startTime: event.startTime,
        endTime: event.endTime,
        ticketPrice: event.ticketPrice.toString(),
        totalCapacity: event.totalCapacity.toString(),
        status: event.status
    });

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

    const handleSaveEvent = () => {
        console.log("Saving event:", editFormData);
        setIsEditing(false);
    };

    const handleBookMusician = (bookingId: string) => {
        console.log("Booking musician:", bookingId);
    };

    const handleRejectBooking = (bookingId: string) => {
        console.log("Rejecting booking:", bookingId);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log("Sending message:", newMessage);
            setNewMessage("");
        }
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
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">History ({bookingsData.length})</TabsTrigger>
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

                    {/* Booking Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {bookingsData.filter(b => b.status === "applied").length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Applied</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {bookingsData.filter(b => b.status === "invited").length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Invited</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {bookingsData.filter(b => b.status === "communicating").length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Communicating</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {bookingsData.filter(b => b.status === "confirmed").length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Confirmed</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                                                                            className="h-8 px-2 text-xs"
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
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRowClick(booking);
                                                                    }}
                                                                    className="h-8 px-2 text-xs"
                                                                >
                                                                    Message
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No musician applications yet.</p>
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
                            <CardTitle>Recent Communications</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                View and manage all communications with musicians
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {bookingsData.slice(0, 3).map((booking) => (
                                    <div key={booking.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <Music className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{booking.musician.stageName}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.status} • {new Date(booking.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRowClick(booking)}
                                            >
                                                View Messages
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
                        <CardContent className="space-y-6">
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Communication Dialog */}
            <Dialog open={communicationDialogOpen} onOpenChange={setCommunicationDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Communication with {selectedMusician?.musician.stageName}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Event: {event.title} • {new Date(event.date).toLocaleDateString()}
                        </p>
                    </DialogHeader>
                    {selectedMusician && (
                        <div className="space-y-6">
                            {/* Musician Info */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    {selectedMusician.musician.profilePicture ? (
                                        <img 
                                            src={selectedMusician.musician.profilePicture} 
                                            alt={selectedMusician.musician.stageName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Music className="h-8 w-8 text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{selectedMusician.musician.stageName}</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Genre:</span>
                                            <span className="ml-2 font-medium">{selectedMusician.musician.genre}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Location:</span>
                                            <span className="ml-2 font-medium">
                                                {selectedMusician.musician.city}, {selectedMusician.musician.state}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Rate:</span>
                                            <span className="ml-2 font-medium">${selectedMusician.proposedRate}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className="ml-2">{getStatusBadge(selectedMusician.status)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Musician's Pitch */}
                            {selectedMusician.musicianPitch && (
                                <div>
                                    <h4 className="font-medium mb-2">Musician's Pitch</h4>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm">{selectedMusician.musicianPitch}</p>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            <div>
                                <h4 className="font-medium mb-2">Messages</h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex ${message.sender === 'venue' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs p-3 rounded-lg ${
                                                message.sender === 'venue' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}>
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender === 'venue' ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Send Message */}
                            <div className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t">
                                {selectedMusician.status === "applied" && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                handleBookMusician(selectedMusician.id);
                                                setCommunicationDialogOpen(false);
                                            }}
                                        >
                                            Confirm Booking
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                handleRejectBooking(selectedMusician.id);
                                                setCommunicationDialogOpen(false);
                                            }}
                                        >
                                            Reject Application
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setCommunicationDialogOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
} 