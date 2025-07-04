import React from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { useVenueEventsStats } from "../hooks/useVenueEventsStats";
import { VenueEventsHeader } from "../components/shared/VenueEventsHeader";
import { VenueEventsSummaryDashboard } from "../components/shared/VenueEventsSummaryDashboard";
import { VenueEventsTabs } from "../components/shared/VenueEventsTabs";
import { VenueEventEditDialog } from "../components/shared/VenueEventEditDialog";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";
import { RefreshButton } from "../components/shared/RefreshButton";
import { WorkflowSelector } from "../components/shared/WorkflowSelector";

export default function VenueEventsCurrentPage() {
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
            <VenueProfilePrompt onCreateProfile={() => {}} />
        );
    }

    // Calculate stats using the custom hook
    const pendingApplicationsList = getPendingApplications();
    const stats = useVenueEventsStats(allEvents, venueBookings, pendingApplicationsList);

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
                    <RefreshButton onRefresh={() => setRefreshTrigger((prev: number) => prev + 1)} />
                </div>

                {/* Quick Stats */}
                <VenueEventsSummaryDashboard
                    totalEvents={stats.totalEvents}
                    eventsWithApplications={stats.eventsWithApplications}
                    totalApplications={stats.totalApplications}
                    pendingApplications={stats.pendingApplications}
                    eventsThisMonth={stats.eventsThisMonth}
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
        </div>
    );
} 