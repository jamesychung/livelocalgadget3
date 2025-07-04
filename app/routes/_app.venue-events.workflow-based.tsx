import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { useVenueEventsStats, createVenueEventStats } from "../hooks/useVenueEventsStats";
import { VenueEventsHeader } from "../components/shared/VenueEventsHeader";
import { VenueEventsSummaryDashboard } from "../components/shared/VenueEventsSummaryDashboard";
import { VenueStatsSettings } from "../components/shared/VenueStatsSettings";
import { VenueEventEditDialog } from "../components/shared/VenueEventEditDialog";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";
import { RefreshButton } from "../components/shared/RefreshButton";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Calendar, Users, Clock, CheckCircle, AlertCircle, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { EventStatusBadge } from "../components/shared/EventStatusBadge";
import { ApplicationDetailDialog } from "../components/shared/ApplicationDetailDialog";
import VenueEventCalendar from "../components/shared/VenueEventCalendar";
import { EventDetailDialog } from "../components/musician/events/EventDetailDialog";

export default function VenueEventsWorkflowBasedPage() {
    console.log("VenueEventsWorkflowBasedPage render");
    const { user } = useOutletContext<AuthOutletContext>();
    const [activeWorkflowTab, setActiveWorkflowTab] = useState("my-events");
    const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);
    const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
    const [showStatsSettings, setShowStatsSettings] = useState(false);
    
    // Add separate state for event detail dialog
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEventDetailDialogOpen, setIsEventDetailDialogOpen] = useState(false);
    
    // Default selected stats (can be stored in user preferences later)
    const [selectedStatIds, setSelectedStatIds] = useState<string[]>([
        "totalEvents",
        "pendingReviews", 
        "upcomingEvents",
        "eventsThisMonth"
    ]);
    
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
        handleEventClick: originalHandleEventClick,
        handleEditEvent,
        handleEditSubmit,
        handleAddEvent,
        toggleApplicationExpansion,
        handleBookApplication,
        handleRejectApplication,
    } = useVenueEvents(user);

    // Override handleEventClick to use our new state
    const handleEventClick = (event: any) => {
        console.log("Set selectedEvent:", event);
        setSelectedEvent(event);
        setIsEventDetailDialogOpen(true);
    };

    // Calculate stats using the custom hook - MUST be called before any conditional returns
    const pendingApplicationsList = getPendingApplications();
    const stats = useVenueEventsStats(allEvents, venueBookings, pendingApplicationsList);
    const allAvailableStats = createVenueEventStats(stats);
    const selectedStats = allAvailableStats.filter(stat => selectedStatIds.includes(stat.id));

    // If no venue profile found, show a message with option to create one
    if (!venue) {
        return (
            <VenueProfilePrompt onCreateProfile={() => {}} />
        );
    }

    // Filter events by status
    const activeEvents = allEvents.filter(event => 
        event.eventStatus === 'open' || event.eventStatus === 'confirmed'
    );
    
    const eventsWithPendingApplications = getEventsWithPendingApplications();
    
    const pastEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        return eventDate < now || event.eventStatus === 'completed' || event.eventStatus === 'cancelled';
    });

    const handleViewApplications = (event: any) => {
        setSelectedEventForApplications(event);
        setApplicationsDialogOpen(true);
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
        <div className="container mx-auto p-6 space-y-6">
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

                {/* Quick Stats (up to 8 cards) with inline customization */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Dashboard Stats</h2>
                        <Button size="sm" variant="outline" onClick={() => setShowStatsSettings((v: boolean) => !v)}>
                            Customize
                        </Button>
                    </div>
                    <VenueEventsSummaryDashboard
                        stats={selectedStats}
                        maxStats={8}
                    />
                    {showStatsSettings && (
                        <div className="mt-2">
                            <VenueStatsSettings
                                availableStats={allAvailableStats}
                                selectedStatIds={selectedStatIds}
                                onStatsChange={setSelectedStatIds}
                                maxStats={8}
                                onClose={() => setShowStatsSettings(false)}
                            />
                        </div>
                    )}
                </div>

                {/* Workflow Tabs */}
                <Tabs value={activeWorkflowTab} onValueChange={setActiveWorkflowTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="my-events" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            My Events
                            {activeEvents.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {activeEvents.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Applications
                            {pendingApplicationsList.length > 0 && (
                                <Badge variant="destructive" className="ml-1">
                                    {pendingApplicationsList.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="planning" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Planning
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            History
                            {pastEvents.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {pastEvents.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* My Events Tab */}
                    <TabsContent value="my-events" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Events</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Your current and upcoming events
                                </p>
                            </CardHeader>
                            <CardContent>
                                {activeEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeEvents.map((event) => {
                                            const applicationCount = getApplicationCount(event.id);
                                            const pendingCount = getPendingApplications().filter(b => b.event?.id === event.id).length;
                                            
                                            return (
                                                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                                                    <CardContent className="pt-6">
                                                        <div
                                                            className="flex flex-col gap-2"
                                                            onClick={() => { console.log('Card clicked', event); handleEventClick(event); }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
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
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <EventStatusBadge status={event.eventStatus} />
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Action buttons outside clickable area */}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={e => { e.stopPropagation(); handleEditEvent(event); }}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                            {applicationCount > 0 && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={e => { e.stopPropagation(); handleViewApplications(event); }}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Users className="h-4 w-4" />
                                                                    Review Applications ({applicationCount})
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No Active Events</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Create your first event to get started.
                                        </p>
                                        <Button asChild>
                                            <Link to="/create-event">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Event
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Applications to Review</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Musician applications awaiting your review
                                </p>
                            </CardHeader>
                            <CardContent>
                                {eventsWithPendingApplications.length > 0 ? (
                                    <div className="space-y-4">
                                        {eventsWithPendingApplications.map((event) => {
                                            const pendingCount = getPendingApplications().filter(b => b.event?.id === event.id).length;
                                            
                                            return (
                                                <Card key={event.id} className="border-l-4 border-l-orange-500">
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
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                                        {pendingCount} pending review
                                                                    </Badge>
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => handleViewApplications(event)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <Users className="h-4 w-4" />
                                                                        Review Applications
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEventClick(event)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        View Event
                                                                    </Button>
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
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                                        <p className="text-muted-foreground">
                                            No pending applications to review.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Planning Tab */}
                    <TabsContent value="planning" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Planning</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Calendar view for planning and scheduling
                                </p>
                            </CardHeader>
                            <CardContent>
                                <VenueEventCalendar
                                    events={allEvents}
                                    onEditEvent={handleEditEvent}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event History</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Past events and completed bookings
                                </p>
                            </CardHeader>
                            <CardContent>
                                {pastEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {pastEvents.map((event) => (
                                            <Card key={event.id} className="border-l-4 border-l-gray-300">
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
                                                                    </div>
                                                                </div>
                                                                <EventStatusBadge status={event.eventStatus} />
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEventClick(event)}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View Details
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                                        <p className="text-muted-foreground">
                                            Your event history will appear here once you have completed events.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

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
                {selectedEvent && <div style={{position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'yellow'}}>Dialog Open</div>}
                {console.log("Rendering EventDetailDialog", { selectedEvent })}
                <EventDetailDialog
                    isOpen={isEventDetailDialogOpen}
                    setIsOpen={setIsEventDetailDialogOpen}
                    selectedEvent={selectedEvent}
                    user={user}
                    bookings={allBookings}
                    musicians={musiciansData}
                    handleApply={() => {}}
                    handleNotInterested={() => {}}
                    handleMessageVenue={() => {}}
                    handleViewBookingDetails={() => {}}
                    handleBookingStatusUpdate={() => {}}
                    getMusicianApplicationStatus={() => ({ status: "none" })}
                    getMatchingMusicians={() => []}
                />
        </div>
    );
} 