import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { ArrowLeft, Calendar, Music, MapPin, Clock, DollarSign, Users, Search, Filter, Eye, Send, MessageSquare, X, Check } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

type SortField = 'date' | 'venue' | 'rate' | 'musicianStatus';
type SortDirection = 'asc' | 'desc';

export default function MusicianAvailEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Check if API is properly initialized
    const isApiReady = api && api.event && api.musician && api.booking;

    // Debug user context
    console.log("👤 Musician Available Events - User context:", {
        user,
        userId: user?.id,
        musician: user?.musician,
        musicianId: user?.musician?.id,
        stageName: user?.musician?.stageName
    });

    // Fetch all events
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            eventStatus: true,
            rate: true,
            genres: true,
            venue: {
                id: true,
                name: true,
                city: true,
                state: true
            }
        },
        filter: {
            eventStatus: { in: ["open", "invited"] }
        },
        pause: !isApiReady,
    });

    // Fetch all musicians for matching
    const [{ data: musiciansData, fetching: musiciansFetching }] = useFindMany(api.musician, {
        select: {
            id: true,
            stageName: true,
            genres: true,
            availability: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            bio: true,
            hourlyRate: true
        },
        first: 100
    });

    // Fetch bookings to check application status
    const [{ data: bookingsData }] = useFindMany(api.booking, {
        select: {
            id: true,
            status: true,
            event: {
                id: true
            },
            musician: {
                id: true
            }
        },
        pause: !isApiReady || !user?.musician?.id,
    });

    const events: any[] = eventsData || [];
    const musicians: any[] = musiciansData || [];
    const bookings: any[] = bookingsData || [];

    // Helper function to get musician's application status for an event
    const getMusicianApplicationStatus = (eventId: string): string => {
        if (!user?.musician?.id) return "available";
        
        const booking = bookings.find(booking => 
            booking.event?.id === eventId && 
            booking.musician?.id === user.musician.id
        );
        
        if (!booking) return "available";
        
        switch (booking.status) {
            case "applied":
                return "applied";
            case "confirmed":
                return "confirmed";
            case "rejected":
                return "rejected";
            case "cancelled":
                return "cancelled";
            default:
                return "available";
        }
    };

    // Debug: Log what we're getting from the queries
    console.log("🔍 Debug - Events query result:", {
        eventsData,
        eventsCount: events.length,
        eventsFetching,
        eventsError
    });
    console.log("🔍 Debug - Musicians query result:", {
        musiciansData,
        musiciansCount: musicians.length,
        musiciansFetching
    });
    console.log("🔍 Debug - Sample events:", events.slice(0, 3));
    console.log("🔍 Debug - Sample musicians:", musicians.slice(0, 3));

    // Helper function to check if genres match
    const doGenresMatch = (eventGenres: string[], musicianGenres: string[]): boolean => {
        if (!eventGenres || eventGenres.length === 0) {
            return true; // If event has no genres, show to all
        }
        if (!musicianGenres || musicianGenres.length === 0) {
            return false; // If musician has no genres, don't show
        }
        
        // Check if there's any overlap between event genres and musician genres
        const hasMatch = eventGenres.some(eventGenre => 
            musicianGenres.some(musicianGenre => 
                musicianGenre.toLowerCase().includes(eventGenre.toLowerCase()) ||
                eventGenre.toLowerCase().includes(musicianGenre.toLowerCase())
            )
        );
        
        return hasMatch;
    };

    // Helper function to check if event time matches musician availability
    const doesTimeMatchAvailability = (eventDate: string, eventStartTime: string, eventEndTime: string, musicianAvailability: any): boolean => {
        if (!musicianAvailability || typeof musicianAvailability !== 'object') {
            return true; // If no availability set, show all
        }
        
        // Get the day of the week for the event
        const eventDay = new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        // Check if musician has availability for this day
        const dayAvailability = musicianAvailability[eventDay] || [];
        
        // If no specific availability for this day, check if there are any recurring slots
        if (dayAvailability.length === 0) {
            // Check if there are any recurring availability slots that might match
            const allDays = Object.keys(musicianAvailability);
            const hasAnyAvailability = allDays.some(day => 
                musicianAvailability[day] && musicianAvailability[day].length > 0
            );
            
            // If musician has some availability set up, but not for this specific day, don't show
            if (hasAnyAvailability) {
                return false;
            }
            
            // If musician hasn't set up any availability, show all events (default behavior)
            return true;
        }
        
        // Check if any time slot overlaps with the event time
        const hasTimeMatch = dayAvailability.some((slot: TimeSlot) => {
            const slotStart = slot.startTime;
            const slotEnd = slot.endTime;
            
            // Simple time overlap check
            const overlaps = eventStartTime <= slotEnd && eventEndTime >= slotStart;
            return overlaps;
        });
        
        return hasTimeMatch;
    };

    // Get matching musicians for a specific event
    const getMatchingMusicians = (event: any): any[] => {
        if (!event.date) {
            // If no specific date, only filter by genres
            return musicians.filter(musician => 
                doGenresMatch(event.genres || [], musician.genres || [])
            );
        }
        
        return musicians.filter(musician => {
            // Check genre matching
            const genresMatch = doGenresMatch(event.genres || [], musician.genres || []);
            
            // Check availability matching
            const timeMatches = doesTimeMatchAvailability(
                event.date, 
                event.startTime || "00:00", 
                event.endTime || "23:59", 
                musician.availability
            );
            
            return genresMatch && timeMatches;
        });
    };

    // Sort events
    const sortEvents = (eventsToSort: any[]): any[] => {
        return [...eventsToSort].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'date':
                    aValue = a.date ? new Date(a.date).getTime() : 0;
                    bValue = b.date ? new Date(b.date).getTime() : 0;
                    break;
                case 'venue':
                    aValue = a.venue?.name || '';
                    bValue = b.venue?.name || '';
                    break;
                case 'rate':
                    aValue = a.rate || 0;
                    bValue = b.rate || 0;
                    break;
                case 'musicianStatus':
                    aValue = getMusicianApplicationStatus(a.id);
                    bValue = getMusicianApplicationStatus(b.id);
                    break;
                default:
                    return 0;
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    };

    // Handle sort column click
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Calculate summary statistics
    const totalEvents = events.length;
    const openEvents = events.filter(event => event.eventStatus === 'open').length;
    const invitedEvents = events.filter(event => event.eventStatus === 'invited').length;

    // Filter events based on search and status
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || event.eventStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Sort filtered events
    const sortedEvents = sortEvents(filteredEvents);

    // Handle row click to open dialog
    const handleRowClick = (event: any) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    // Handle dialog actions
    const handleApply = async () => {
        console.log("🎵 handleApply called with:", {
            selectedEvent,
            user,
            musicianId: user?.musician?.id
        });

        if (!selectedEvent || !user?.musician?.id) {
            console.log("❌ Cannot apply - missing data:", {
                hasSelectedEvent: !!selectedEvent,
                hasUser: !!user,
                hasMusicianId: !!user?.musician?.id
            });
            alert("Unable to apply. Please ensure you have a musician profile.");
            return;
        }

        try {
            console.log("🎵 Creating booking with data:", {
                eventId: selectedEvent.id,
                musicianId: user.musician.id,
                userId: user.id,
                proposedRate: user.musician.hourlyRate || 0,
                pitch: `I'm excited to perform at ${selectedEvent.venue?.name || 'your venue'}! I have experience in ${user.musician.genres?.join(', ') || 'various genres'} and would love to contribute to your event.`
            });

            // Create a booking record
            const result = await api.booking.create({
                event: { _link: selectedEvent.id },
                musician: { _link: user.musician.id },
                bookedBy: { _link: user.id },
                status: "applied",
                proposedRate: user.musician.hourlyRate || 0,
                musicianPitch: `I'm excited to perform at ${selectedEvent.venue?.name || 'your venue'}! I have experience in ${user.musician.genres?.join(', ') || 'various genres'} and would love to contribute to your event.`
            });

            console.log("✅ Booking created successfully:", result);

            alert("Application submitted successfully! The venue will review your application.");
            setIsDialogOpen(false);
            
            // Refresh the page to update the musician status
            window.location.reload();
        } catch (error) {
            console.error("❌ Error applying to event:", error);
            alert("Failed to submit application. Please try again.");
        }
    };

    const handleNotInterested = () => {
        // TODO: Implement not interested logic
        console.log("Not interested in event:", selectedEvent?.id);
        setIsDialogOpen(false);
    };

    const handleMessageVenue = () => {
        // TODO: Implement message venue logic
        console.log("Message venue for event:", selectedEvent?.id);
        setIsDialogOpen(false);
    };

    // Show loading state while fetching
    if (eventsFetching || musiciansFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading events and musicians...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if events query failed
    if (eventsError) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Error Loading Events</h3>
                        <p className="text-muted-foreground mb-4">
                            There was an error loading the available events. Please try refreshing the page.
                        </p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/musician-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Available Events</h1>
                        <p className="text-muted-foreground">
                            All events with matching musicians
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invited Events</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{invitedEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Invited to events
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Events</CardTitle>
                        <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{openEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Open events
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            All events
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search events, venues, or descriptions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="invited">Invited</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedEvents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Date & Time
                                                {sortField === 'date' && (
                                                    <span className="text-xs">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('venue')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Venue & Location
                                                {sortField === 'venue' && (
                                                    <span className="text-xs">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('rate')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Rate
                                                {sortField === 'rate' && (
                                                    <span className="text-xs">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead>Event Status</TableHead>
                                        <TableHead 
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('musicianStatus')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Musician Status
                                                {sortField === 'musicianStatus' && (
                                                    <span className="text-xs">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedEvents.map((event, index) => {
                                        const isUpcoming = event.date && new Date(event.date) > new Date();
                                        
                                        return (
                                            <TableRow 
                                                key={event.id} 
                                                className={`cursor-pointer hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => handleRowClick(event)}
                                            >
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                                                        </div>
                                                        {event.startTime && (
                                                            <div className="text-sm text-muted-foreground">
                                                                Start: {event.startTime}
                                                            </div>
                                                        )}
                                                        {event.endTime && (
                                                            <div className="text-sm text-muted-foreground">
                                                                End: {event.endTime}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{event.venue?.name}</div>
                                                        {event.venue?.city && event.venue?.state && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {event.venue.city}, {event.venue.state}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {event.rate ? (
                                                        <div className="font-medium text-green-600">
                                                            ${event.rate}
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted-foreground">TBD</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={event.eventStatus === 'open' ? 'default' : 'secondary'}
                                                        className={
                                                            event.eventStatus === 'open' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {event.eventStatus?.charAt(0).toUpperCase() + event.eventStatus?.slice(1) || 'Unknown'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {(() => {
                                                        const status = getMusicianApplicationStatus(event.id);
                                                        let badgeVariant = "secondary";
                                                        let className = "bg-gray-100 text-gray-800";
                                                        
                                                        switch (status) {
                                                            case "available":
                                                                badgeVariant = "default";
                                                                className = "bg-green-100 text-green-800";
                                                                break;
                                                            case "applied":
                                                                badgeVariant = "default";
                                                                className = "bg-blue-100 text-blue-800";
                                                                break;
                                                            case "confirmed":
                                                                badgeVariant = "default";
                                                                className = "bg-green-100 text-green-800";
                                                                break;
                                                            case "rejected":
                                                                badgeVariant = "default";
                                                                className = "bg-red-100 text-red-800";
                                                                break;
                                                            case "cancelled":
                                                                badgeVariant = "default";
                                                                className = "bg-gray-100 text-gray-800";
                                                                break;
                                                            default:
                                                                badgeVariant = "secondary";
                                                                className = "bg-gray-100 text-gray-800";
                                                        }
                                                        
                                                        return (
                                                            <Badge 
                                                                variant={badgeVariant}
                                                                className={className}
                                                            >
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </Badge>
                                                        );
                                                    })()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No events found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria."
                                    : "There are currently no events available. Check back later!"
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Event Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {selectedEvent?.title}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedEvent && (
                        <div className="space-y-6">
                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Event Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Date:</span> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'TBD'}</div>
                                        <div><span className="font-medium">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</div>
                                        <div><span className="font-medium">Rate:</span> {selectedEvent.rate ? `$${selectedEvent.rate}` : 'TBD'}</div>
                                        <div><span className="font-medium">Status:</span> {selectedEvent.eventStatus}</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Venue Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Name:</span> {selectedEvent.venue?.name}</div>
                                        <div><span className="font-medium">Location:</span> {selectedEvent.venue?.city && selectedEvent.venue?.state ? `${selectedEvent.venue.city}, ${selectedEvent.venue.state}` : 'Not specified'}</div>
                                        <div><span className="font-medium">Type:</span> {selectedEvent.venue?.type || 'Not specified'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedEvent.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                                </div>
                            )}

                            {/* Genres */}
                            {selectedEvent.genres && selectedEvent.genres.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">Genres</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedEvent.genres.map((genre: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {genre}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Matching Musicians */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Matching Musicians ({getMatchingMusicians(selectedEvent).length})
                                </h3>
                                
                                {getMatchingMusicians(selectedEvent).length > 0 ? (
                                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                                        {getMatchingMusicians(selectedEvent).map((musician) => (
                                            <div key={musician.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h5 className="font-medium">{musician.stageName}</h5>
                                                        {musician.hourlyRate && (
                                                            <Badge variant="outline" className="text-green-600 border-green-300">
                                                                ${musician.hourlyRate}/hr
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                                        <div>
                                                            <span className="font-medium">Location:</span> {musician.city && musician.state ? `${musician.city}, ${musician.state}` : 'Not specified'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Contact:</span> {musician.email}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Genres:</span> {musician.genres?.join(", ") || "None specified"}
                                                        </div>
                                                    </div>
                                                    
                                                    {musician.bio && (
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {musician.bio}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-2 ml-4">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link to={`/musician/${musician.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <Users className="h-8 w-8 mx-auto mb-2" />
                                        <p>No musicians match this event's criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={handleNotInterested}>
                            <X className="h-4 w-4 mr-2" />
                            Not Interested
                        </Button>
                        <Button variant="outline" onClick={handleMessageVenue}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Venue
                        </Button>
                        <Button onClick={handleApply}>
                            <Check className="h-4 w-4 mr-2" />
                            Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
