import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { EventMessagingDialog } from "../components/shared/EventMessagingDialog";
import { useMessaging } from "../hooks/useMessaging";
import { useAuth } from "../lib/auth";
import {
  MessagesPageControls,
  MessagesCalendarView,
  MessagesListView,
  MessagesLoadingState,
  MessagesErrorState
} from "../components/messages";
import { Badge } from "../components/ui/badge";
import { Mail } from "lucide-react";

export default function MusicianMessagesPage() {
  const { user } = useAuth();
  const { events, loading, error, getTotalUnreadCount } = useMessaging(user);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Filter events based on status - musicians see events they're involved in
  const filteredEvents = events.filter(event => {
    if (statusFilter === "all") return true;
    if (statusFilter === "with_messages") return (event.unread_count || 0) > 0;
    return event.status === statusFilter || event.booking_status === statusFilter;
  });

  // Calculate total unread messages
  const totalUnreadMessages = getTotalUnreadCount();

  const handleEventClick = (event: any) => {
    // Musicians can message for events they're involved in
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with venues about your bookings</p>
        </div>
        {totalUnreadMessages > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {totalUnreadMessages} unread
          </Badge>
        )}
      </div>

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
              <MessagesCalendarView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                filteredEvents={filteredEvents}
                onEventClick={handleEventClick}
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