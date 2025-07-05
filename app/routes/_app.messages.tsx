import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { EventMessagingDialog } from "../components/shared/EventMessagingDialog";
import { useMessaging } from "../hooks/useMessaging";
import { useAuth } from "../lib/auth";
import {
  MessagesPageHeader,
  MessagesPageControls,
  MessagesListView,
  MessagesLoadingState,
  MessagesErrorState
} from "../components/messages";
import VenueEventCalendar from "../components/shared/VenueEventCalendar";

export default function MessagesPage() {
  const { user } = useAuth();
  const { events, loading, error, getTotalUnreadCount } = useMessaging(user);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Filter events based on status and messaging capability
  const filteredEvents = events.filter(event => {
    // Only show events with messaging capability (have any musicians attached)
    // This includes: current applications, confirmed musicians, or ANY past musicians
    const hasMessagingCapability = event.musician || 
                                  (event.applications && event.applications.length > 0) ||
                                  (event.allPastMusicians && event.allPastMusicians.length > 0);
    if (!hasMessagingCapability) return false;
    
    // Then apply status filter
    if (statusFilter === "all") return true;
    if (statusFilter === "with_messages") return (event.unread_count || 0) > 0;
    return event.status === statusFilter;
  });

  // Calculate total unread messages
  const totalUnreadMessages = getTotalUnreadCount();

  const handleEventClick = (calendarEvent: any) => {
    // Find the original event data from the filtered events using the ID
    const originalEvent = filteredEvents.find(e => e.id === calendarEvent.id);
    if (originalEvent) {
      // Allow messaging for events with musicians, applications, or past musicians
      if (originalEvent.musician || 
          (originalEvent.applications && originalEvent.applications.length > 0) ||
          (originalEvent.allPastMusicians && originalEvent.allPastMusicians.length > 0)) {
        setSelectedEvent(originalEvent);
        setIsEventDialogOpen(true);
      }
    }
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  // Loading state
  if (loading) {
    return <MessagesLoadingState />;
  }

  // Error state
  if (error) {
    return <MessagesErrorState error={error} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <MessagesPageHeader totalUnreadMessages={totalUnreadMessages} />

      {/* Controls */}
      <MessagesPageControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="calendar" className="mt-0">
              <VenueEventCalendar
                events={filteredEvents.map(event => ({
                  id: event.id,
                  title: event.title,
                  date: event.date,
                  startTime: event.start_time,
                  endTime: event.end_time,
                  eventStatus: event.status as 'confirmed' | 'proposed' | 'cancelled' | 'open' | null,
                  bookings: event.applications || [],
                  confirmedBookings: event.applications?.filter(app => app.status === 'confirmed').length || 0,
                  pendingApplications: event.applications?.filter(app => app.status === 'applied').length || 0,
                  hasConfirmedBooking: !!event.musician
                }))}
                onEditEvent={handleEventClick}
                title="Messages Calendar"
                description="Events with messaging capability"
              />
            </TabsContent>
            <TabsContent value="list" className="mt-0">
              <MessagesListView
                filteredEvents={filteredEvents}
                statusFilter={statusFilter}
                onEventClick={handleEventClick}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Messaging Dialog */}
      <EventMessagingDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        event={selectedEvent}
        onClose={closeEventDialog}
      />
    </div>
  );
} 
