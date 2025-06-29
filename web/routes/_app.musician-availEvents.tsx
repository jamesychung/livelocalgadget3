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

    // Calculate summary statistics
    const totalEvents = events.length;
    const openEvents = events.filter(event => event.status === 'open').length;
    const invitedEvents = events.filter(event => {
        // Check if this musician has been invited to this event
        return event.bookings?.some(booking => 
            booking.musician?.id === user?.musician?.id && 
            booking.status === 'invited'
        );
    }).length;
    const upcomingEvents = events.filter(event => {
        if (!event.date) return false;
        return new Date(event.date) > new Date();
    }).length;

    // Filter events based on search and status
    const filteredEvents = events.filter(event => {
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
                            Browse events you can apply to perform at
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            All available events
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
        </div>
    );
} 