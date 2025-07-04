import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowUpDown, Calendar, Clock, MapPin, Music, DollarSign, Users, Eye, Check, X } from "lucide-react";
import { Link } from 'react-router-dom';

interface VenueEventsWithApplicationsProps {
    events: any[];
    bookings: any[];
    onAcceptApplication: (bookingId: string, eventId: string) => void;
    onRejectApplication: (bookingId: string) => void;
}

type SortField = 'date' | 'title' | 'applications' | 'status';
type SortDirection = 'asc' | 'desc';

export function VenueEventsWithApplications({ 
    events, 
    bookings, 
    onAcceptApplication, 
    onRejectApplication 
}: VenueEventsWithApplicationsProps) {
    console.log('VenueEventsWithApplications rendered with bookings:', bookings.map(b => ({ id: b.id, status: b.status, event: b.event?.title })));
    
    useEffect(() => {
        console.log('VenueEventsWithApplications bookings updated:', bookings.map(b => ({ id: b.id, status: b.status, event: b.event?.title })));
    }, [bookings]);
    
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Helper function to get applications for an event
    const getEventApplications = (eventId: string) => {
        return bookings.filter(booking => booking.event?.id === eventId);
    };

    // Helper function to get pending applications for an event
    const getPendingApplications = (eventId: string) => {
        return bookings.filter(booking => 
            booking.event?.id === eventId && 
            (booking.status === "applied" || booking.status === "pending_confirmation")
        );
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
                case 'title':
                    aValue = a.title || '';
                    bValue = b.title || '';
                    break;
                case 'applications':
                    aValue = getEventApplications(a.id).length;
                    bValue = getEventApplications(b.id).length;
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
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

    // Filter events that have applications
    const eventsWithApplications = events.filter(event => getEventApplications(event.id).length > 0);
    const sortedEvents = sortEvents(eventsWithApplications);
    


    // Handle row click to open dialog
    const handleRowClick = (event: any) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    // Handle accept application (venue selects musician)
    const handleAccept = async (bookingId: string) => {
        console.log('🎯 handleAccept called with bookingId:', bookingId);
        console.log('🎯 selectedEvent:', selectedEvent);
        console.log('🎯 calling onAcceptApplication with:', { bookingId, eventId: selectedEvent.id });
        
        try {
            await onAcceptApplication(bookingId, selectedEvent.id);
            console.log('✅ onAcceptApplication completed successfully');
        } catch (error) {
            console.error('❌ onAcceptApplication failed:', error);
        }
        
        setIsDialogOpen(false);
    };

    // Handle reject application
    const handleReject = async (bookingId: string) => {
        await onRejectApplication(bookingId);
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Events with Applications</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Review and select musicians for your events. Click on any event to see applications.
                    </p>
                </CardHeader>
                <CardContent>
                    {sortedEvents.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => handleSort('title')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Event Title
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => handleSort('date')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Date & Time
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => handleSort('applications')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Applications
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => handleSort('status')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Status
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedEvents.map((event) => {
                                    const applications = getEventApplications(event.id);
                                    const pendingApplications = getPendingApplications(event.id);
                                    
                                    return (
                                        <TableRow 
                                            key={event.id} 
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleRowClick(event)}
                                        >
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{event.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {event.venue?.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-sm">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                        {event.startTime && event.endTime && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {event.startTime} - {event.endTime}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{applications.length}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {pendingApplications.length} pending
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={event.eventStatus === 'open' ? 'default' : 'secondary'}>
                                                    {event.eventStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Events with Applications</h3>
                            <p className="text-muted-foreground">
                                When musicians apply to your events, they will appear here for review.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Applications Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Applications for {selectedEvent?.title}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedEvent && (
                        <div className="space-y-6">
                            {/* Event Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Event Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(selectedEvent.date).toLocaleDateString()}
                                                {selectedEvent.startTime && selectedEvent.endTime && (
                                                    <span className="text-muted-foreground">
                                                        • {selectedEvent.startTime} - {selectedEvent.endTime}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground">Venue</div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {selectedEvent.venue?.name}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Applications List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Musician Applications ({getEventApplications(selectedEvent.id).length})
                                </h3>
                                
                                {getEventApplications(selectedEvent.id).map((booking) => (
                                    <Card key={booking.id} className="border-l-4 border-l-blue-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="font-semibold text-lg">
                                                            {booking.musician?.stageName}
                                                        </div>
                                                        <Badge variant={
                                                            booking.status === "applied" ? "default" :
                                                            booking.status === "selected" ? "secondary" :
                                                            booking.status === "confirmed" ? "default" :
                                                            "secondary"
                                                        }>
                                                            {booking.status === "applied" ? "📝 Applied" :
                                                             booking.status === "selected" ? "⭐ Selected" :
                                                             booking.status === "confirmed" ? "✅ Confirmed" :
                                                             booking.status}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Music className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {booking.musician?.genres?.join(', ') || 'No genres specified'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {booking.musician?.city}, {booking.musician?.state}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                ${booking.proposedRate || booking.musician?.hourly_rate}/hr
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {booking.musicianPitch && (
                                                        <div className="mb-4">
                                                            <div className="text-sm font-medium text-muted-foreground mb-2">
                                                                Musician's Pitch
                                                            </div>
                                                            <div className="text-sm bg-muted p-3 rounded-lg">
                                                                {booking.musicianPitch}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Link 
                                                            to={`/musician/${booking.musician?.id}`}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                                        >
                                                            View Musician Profile →
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                                {booking.status === "applied" && (
                                                    <div className="flex gap-2 ml-4">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                console.log('🎯 Select Musician button clicked for booking:', booking.id);
                                                                console.log('🎯 Booking details:', booking);
                                                                handleAccept(booking.id);
                                                            }}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Select Musician
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleReject(booking.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                                
                                                {booking.status === "selected" && (
                                                    <div className="flex gap-2 ml-4">
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                            ⭐ Awaiting Musician Confirmation
                                                        </Badge>
                                                    </div>
                                                )}
                                                
                                                {booking.status === "confirmed" && (
                                                    <div className="flex gap-2 ml-4">
                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                            ✅ Booking Confirmed
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
} 
