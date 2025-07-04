import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { ApplicationsTable } from "./ApplicationsTable";
import { ApplicationDetailDialog } from "./ApplicationDetailDialog";

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
                        <ApplicationsTable
                            events={sortedEvents}
                            getEventApplications={getEventApplications}
                            getPendingApplications={getPendingApplications}
                            onSort={handleSort}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onReview={handleRowClick}
                        />
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

            <ApplicationDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                selectedEvent={selectedEvent}
                getEventApplications={getEventApplications}
                onAcceptApplication={handleAccept}
                onRejectApplication={handleReject}
            />
        </div>
    );
} 
