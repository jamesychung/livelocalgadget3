import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Music, MapPin, Clock, DollarSign, Users, Search, Filter, Eye, Send } from "lucide-react";
import { Link, useOutletContext } from "react-router";
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

export default function MusicianAvailEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch public events that musicians can apply to
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { 
            isPublic: { equals: true }
        },
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            ticketPrice: true,
            status: true,
            proposedRate: true,
            musicianPitch: true,
            genres: true,
            venue: {
                id: true,
                name: true,
                city: true,
                state: true,
                type: true
            },
            musician: {
                id: true,
                stageName: true
            },
            bookings: {
                id: true,
                status: true,
                musician: {
                    id: true,
                    stageName: true
                }
            }
        },
        first: 50,
        sort: { date: "Ascending" }
    });

    const events: any[] = eventsData || [];

    // Helper function to check if genres match
    const doGenresMatch = (eventGenres: string[], musicianGenres: string[]): boolean => {
        if (!eventGenres || eventGenres.length === 0) return true; // If event has no genres, show to all
        if (!musicianGenres || musicianGenres.length === 0) return false; // If musician has no genres, don't show
        
        // Check if there's any overlap between event genres and musician genres
        return eventGenres.some(eventGenre => 
            musicianGenres.some(musicianGenre => 
                musicianGenre.toLowerCase().includes(eventGenre.toLowerCase()) ||
                eventGenre.toLowerCase().includes(musicianGenre.toLowerCase())
            )
        );
    };

    // Helper function to check if event time matches musician availability
    const doesTimeMatchAvailability = (eventDate: string, eventStartTime: string, eventEndTime: string, musicianAvailability: any): boolean => {
        if (!musicianAvailability || typeof musicianAvailability !== 'object') return true; // If no availability set, show all
        
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
            if (hasAnyAvailability) return false;
            
            // If musician hasn't set up any availability, show all events (default behavior)
            return true;
        }
        
        // Check if any time slot overlaps with the event time
        return dayAvailability.some((slot: TimeSlot) => {
            const slotStart = slot.startTime;
            const slotEnd = slot.endTime;
            
            // Simple time overlap check
            return eventStartTime <= slotEnd && eventEndTime >= slotStart;
        });
    };

    // Filter events based on matching criteria
    const getMatchingEvents = (allEvents: any[]): any[] => {
        if (!user?.musician) return allEvents;
        
        const musicianGenres = user.musician.genres || [];
        const musicianAvailability = user.musician.availability || {};
        
        return allEvents.filter(event => {
            // Check genre matching
            const genresMatch = doGenresMatch(event.genres || [], musicianGenres);
            
            // Check availability matching
            const timeMatches = event.date ? 
                doesTimeMatchAvailability(event.date, event.startTime || "00:00", event.endTime || "23:59", musicianAvailability) :
                true; // If no specific date, show the event
            
            return genresMatch && timeMatches;
        });
    };

    const matchingEvents = getMatchingEvents(events);

    // Calculate summary statistics based on matching events
    const totalEvents = matchingEvents.length;
    const openEvents = matchingEvents.filter(event => event.status === 'open').length;
    const invitedEvents = matchingEvents.filter(event => {
        // Check if this musician has been invited to this event
        return event.bookings?.some((booking: any) => 
            booking.musician?.id === user?.musician?.id && 
            booking.status === 'invited'
        );
    }).length;
    const upcomingEvents = matchingEvents.filter(event => {
        if (!event.date) return false;
        return new Date(event.date) > new Date();
    }).length;

    // Filter events based on search and status
    const filteredEvents = matchingEvents.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || event.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Show loading state while fetching
    if (eventsFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading available events...</p>
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
                            Events matching your genres and availability
                        </p>
                    </div>
                </div>
            </div>

            {/* Matching Info */}
            {user?.musician && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Smart Matching Active</span>
                        </div>
                        <p className="text-sm text-blue-700">
                            Showing events that match your genres ({user.musician.genres?.join(", ") || "None set"}) and availability schedule.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            {matchingEvents.length} of {events.length} total events match your criteria
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Matching Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Events for you
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open for Applications</CardTitle>
                        <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{openEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Accepting applications
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invited</CardTitle>
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
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{upcomingEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Future events
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
                                <option value="closed">Closed</option>
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
                    {filteredEvents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Venue</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Rate</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Applications</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.map((event) => {
                                        const applications = event.bookings?.length || 0;
                                        const isUpcoming = event.date && new Date(event.date) > new Date();
                                        
                                        return (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{event.title}</div>
                                                        {event.description && (
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                        {event.genres && event.genres.length > 0 && (
                                                            <div className="text-xs text-blue-600 mt-1">
                                                                <strong>Genres:</strong> {event.genres.join(", ")}
                                                            </div>
                                                        )}
                                                        {event.musicianPitch && (
                                                            <div className="text-xs text-blue-600 mt-1">
                                                                <strong>Looking for:</strong> {event.musicianPitch}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{event.venue?.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {event.venue?.city && event.venue?.state && 
                                                                `${event.venue.city}, ${event.venue.state}`}
                                                        </div>
                                                        {event.venue?.type && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {event.venue.type}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                                                        </div>
                                                        {event.startTime && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                                                            </div>
                                                        )}
                                                        {isUpcoming && (
                                                            <div className="text-xs text-blue-600">
                                                                Upcoming
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {event.proposedRate ? (
                                                        <div className="font-medium text-green-600">
                                                            ${event.proposedRate}
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted-foreground">TBD</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={event.status === 'open' ? 'default' : 'secondary'}
                                                        className={
                                                            event.status === 'open' ? 'bg-green-100 text-green-800' :
                                                            event.status === 'closed' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Unknown'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-center">
                                                        <div className="font-medium">{applications}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {applications === 1 ? 'application' : 'applications'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link to={`/event/${event.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {event.status === 'open' && (
                                                            <Button size="sm" asChild>
                                                                <Link to={`/event/${event.id}?apply=true`}>
                                                                    <Send className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
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
                            <h3 className="text-lg font-medium mb-2">No matching events found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria."
                                    : user?.musician 
                                        ? "No events currently match your genres and availability. Update your profile or availability to see more events."
                                        : "There are currently no events available. Check back later!"
                                }
                            </p>
                            {user?.musician && (
                                <div className="mt-4">
                                    <Button variant="outline" asChild>
                                        <Link to="/musician-profile/edit">
                                            Update Profile
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 