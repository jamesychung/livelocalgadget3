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

export default function MusicianMessagesPage() {
  const { user } = useAuth();
  const { events, loading, error, getTotalUnreadCount } = useMessaging(user);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Filter events based on status and messaging capability
  const filteredEvents = events.filter(event => {
    // For musicians: they should see all events they're involved in (they already have bookings)
    // No need to check messaging capability since they got here through bookings
    
    // Apply status filter
    if (statusFilter === "all") return true;
    if (statusFilter === "with_messages") return (event.unread_count || 0) > 0;
    return event.status === statusFilter || event.booking_status === statusFilter;
  });



  // Calculate total unread messages
  const totalUnreadMessages = getTotalUnreadCount();

  const handleEventClick = (event: any) => {
    // Allow messaging for events with musicians, applications, or past musicians
    if (event.musician || 
        (event.applications && event.applications.length > 0) ||
        (event.allPastMusicians && event.allPastMusicians.length > 0)) {
      setSelectedEvent(event);
      setIsEventDialogOpen(true);
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
      <MessagesPageHeader totalUnreadMessages={totalUnreadMessages} userType="musician" />

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
                title="Musician Messages Calendar"
                description="Your events with messaging capability"
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