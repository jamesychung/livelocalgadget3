import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { useVenueEventsStats } from "../hooks/useVenueEventsStats";
import { VenueEventsHeader } from "../components/shared/VenueEventsHeader";
import { VenueEventsSummaryDashboard } from "../components/shared/VenueEventsSummaryDashboard";
import { VenueEventEditDialog } from "../components/shared/VenueEventEditDialog";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";
import { RefreshButton } from "../components/shared/RefreshButton";
import { WorkflowSelector } from "../components/shared/WorkflowSelector";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Calendar, Users, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../components/venue/dashboard/StatusBadge";
import { ApplicationDetailDialog } from "../components/shared/ApplicationDetailDialog";
import { EventBookingDialog } from "../components/shared/EventBookingDialog";

export default function VenueEventsEventCentricPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
    const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
    
    // Add state for event detail dialog
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);
    
    const {
        // State
        isEditing,
        setIsEditing,
        activeTab,
        setActiveTab,
        editDialogOpen,
        setEditDialogOpen,
        editingEvent,
        setEditingEvent,
        expandedApplications,
        editFormData,
        setEditFormData,
        refreshTrigger,
        setRefreshTrigger,

        // Data
        venue,
        allEvents,
        allBookings,
        venueBookings,
        applicationsWithStaticData,
        musiciansData,
        eventsFetching,
        bookingsFetching,
        eventsError,
        bookingsError,

        // Helper functions
        getApplicationCount,
        getEventsWithApplications,
        getPendingApplications,
        getEventsWithPendingApplications,
        getStatusBadge,

        // Event handlers
        handleUpdateEvent,
        handleEventClick,
        handleEditEvent,
        handleEditSubmit,
        handleAddEvent,
        toggleApplicationExpansion,
        handleBookApplication,
        handleRejectApplication,
    } = useVenueEvents(user);

    // If no venue profile found, show a message with option to create one
    if (!venue) {
        return (
            <VenueProfilePrompt onCreateProfile={() => {}} />
        );
    }

    // Calculate stats using the custom hook
    const pendingApplicationsList = getPendingApplications();
    const stats = useVenueEventsStats(allEvents, venueBookings, pendingApplicationsList);

    // Filter events based on status
    const filteredEvents = allEvents.filter(event => {
        if (statusFilter === "all") return true;
        return event.eventStatus === statusFilter;
    });

    const handleViewApplications = (event: any) => {
        setSelectedEventForApplications(event);
        setApplicationsDialogOpen(true);
    };

    // Override handleEventClick to open event detail dialog
    const handleEventClickOverride = (event: any) => {
        setSelectedEvent(event);
        setIsEventDetailDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="flex gap-6 p-6">
            {/* Side Panel */}
            <div className="flex-shrink-0">
                <WorkflowSelector />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <VenueEventsHeader venueName={(venue as any)?.name || "your venue"} />
                    <div className="flex items-center gap-2">
                        <RefreshButton onRefresh={() => setRefreshTrigger((prev: number) => prev + 1)} />
                        <Button asChild>
                            <Link to="/create-event">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <VenueEventsSummaryDashboard
                    totalEvents={stats.totalEvents}
                    eventsWithApplications={stats.eventsWithApplications}
                    totalApplications={stats.totalApplications}
                    pendingApplications={stats.pendingApplications}
                    eventsThisMonth={stats.eventsThisMonth}
                />

                {/* Filter and Events List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Events Overview</CardTitle>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredEvents.length > 0 ? (
                            <div className="space-y-4">
                                {filteredEvents.map((event) => {
                                    const applicationCount = getApplicationCount(event.id);
                                    const pendingCount = getPendingApplications().filter(b => b.event?.id === event.id).length;
                                    
                                    return (
                                        <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                    {event.title}
                                                                </h3>
                                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-4 w-4" />
                                                                        <span>{formatDate(event.date)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <span>
                                                                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                                        </span>
                                                                    </div>
                                                                    {event.venue && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span>{event.venue.name}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <StatusBadge status={event.eventStatus} />
                                                                {applicationCount > 0 && (
                                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                                        <Users className="h-3 w-3 mr-1" />
                                                                        {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}
                                                                        {pendingCount > 0 && (
                                                                            <span className="ml-1">({pendingCount} pending)</span>
                                                                        )}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                            {event.musician && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-medium">Musician:</span>
                                                                    <span>{event.musician.stageName}</span>
                                                                    {event.musician.city && event.musician.state && (
                                                                        <span className="text-gray-500">
                                                                            ({event.musician.city}, {event.musician.state})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {event.totalCapacity && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-medium">Capacity:</span>
                                                                    <span>{event.totalCapacity}</span>
                                                                </div>
                                                            )}
                                                            {event.ticketPrice && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-medium">Price:</span>
                                                                    <span>${event.ticketPrice}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEventClickOverride(event)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditEvent(event)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                            {applicationCount > 0 && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => handleViewApplications(event)}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Users className="h-4 w-4" />
                                                                    Review Applications ({pendingCount > 0 ? pendingCount : applicationCount})
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {statusFilter === "all" 
                                        ? "Create your first event to get started." 
                                        : `No events with status "${statusFilter}" found.`
                                    }
                                </p>
                                {statusFilter === "all" && (
                                    <Button asChild>
                                        <Link to="/create-event">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Event
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Event Dialog */}
                <VenueEventEditDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    editingEvent={editingEvent}
                    editFormData={editFormData}
                    onEditFormDataChange={setEditFormData}
                    onSubmit={handleEditSubmit}
                />

                {/* Applications Dialog */}
                <ApplicationDetailDialog
                    open={applicationsDialogOpen}
                    onOpenChange={setApplicationsDialogOpen}
                    selectedEvent={selectedEventForApplications}
                    getEventApplications={(eventId) => venueBookings.filter(b => b.event?.id === eventId)}
                    onAcceptApplication={(bookingId) => handleBookApplication(bookingId, selectedEventForApplications?.id || '')}
                    onRejectApplication={handleRejectApplication}
                />

                {/* Event Detail Dialog */}
                <ApplicationDetailDialog
                    open={isEventDetailDialogOpen}
                    onOpenChange={setIsEventDetailDialogOpen}
                    selectedEvent={selectedEvent}
                    getEventApplications={(eventId) => venueBookings.filter(b => b.event?.id === eventId)}
                    onAcceptApplication={(bookingId) => handleBookApplication(bookingId, selectedEvent?.id || '')}
                    onRejectApplication={handleRejectApplication}
                />
            </div>
        </div>
    );
} 