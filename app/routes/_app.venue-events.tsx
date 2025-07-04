import React from "react";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { VenueEventsHeader } from "../components/shared/VenueEventsHeader";
import { VenueEventsStats } from "../components/shared/VenueEventsStats";
import { VenueEventsTabs } from "../components/shared/VenueEventsTabs";
import { VenueEventEditDialog } from "../components/shared/VenueEventEditDialog";
import { RefreshCw } from "lucide-react";

export default function VenueEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    
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
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Venue Events Management</h1>
                        <p className="text-muted-foreground mb-6">
                            It looks like you haven't created your venue profile yet. Create your profile to start managing your events and bookings.
                        </p>
                        <Button asChild>
                            <Link to="/venue-profile/create">
                                Create Venue Profile
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalEvents = allEvents.length;
    const eventsWithApplicationsCount = getEventsWithApplications().length;
    const totalApplications = venueBookings.length;
    const pendingApplications = getPendingApplications().length;
    const eventsThisMonth = allEvents.filter(e => {
        const eventDate = new Date(e.date);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && 
               eventDate.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <VenueEventsHeader venueName={(venue as any)?.name || "your venue"} />
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setRefreshTrigger((prev: number) => prev + 1)}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Quick Stats */}
            <VenueEventsStats
                totalEvents={totalEvents}
                eventsWithApplications={eventsWithApplicationsCount}
                totalApplications={totalApplications}
                pendingApplications={pendingApplications}
                eventsThisMonth={eventsThisMonth}
            />

            {/* Main Content Tabs */}
            <VenueEventsTabs
                key={`tabs-${refreshTrigger}`}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                allEvents={allEvents}
                venueBookings={allBookings}
                getApplicationCount={getApplicationCount}
                onEventClick={handleEventClick}
                onEditEvent={handleEditEvent}
                getStatusBadge={getStatusBadge}
                expandedApplications={expandedApplications}
                toggleApplicationExpansion={toggleApplicationExpansion}
                handleBookApplication={handleBookApplication}
                handleRejectApplication={handleRejectApplication}
            />

            {/* Edit Event Dialog */}
            <VenueEventEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                editingEvent={editingEvent}
                editFormData={editFormData}
                onEditFormDataChange={setEditFormData}
                onSubmit={handleEditSubmit}
            />
        </div>
    );
} 
