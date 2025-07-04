import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { TabsContent } from "../components/ui/tabs";
import { Music } from "lucide-react";
import { api } from "../api";
import { supabase } from "../lib/supabase";

// Import venue-specific components
import { VenueEventDetailsCard } from "../components/shared/VenueEventDetailsCard";
import { VenueInfoCard } from "../components/shared/VenueInfoCard";
import { VenueBookedMusicianCard } from "../components/shared/VenueBookedMusicianCard";
import { VenueEventActivity } from "../components/shared/VenueEventActivity";
import { VenueCommunicationsCard } from "../components/shared/VenueCommunicationsCard";
import { VenueEventHistoryTab } from "../components/shared/VenueEventHistoryTab";

// Import refactored components
import {
  LoadingState,
  PageHeader,
  EventTitleCard,
  TabNavigation,
  StatusBadge,
  fetchEventData,
  fetchBookingsData,
  createEditFormData,
  getEventStatus,
  updateBookingStatus,
  Event,
  Booking,
  EditFormData,
  Message
} from "../components/venue/event-management";

export default function VenueEventManagementPage() {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Sorting state for bookings table
  const [sortColumn, setSortColumn] = useState('applied');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for real data
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  // Form data for editing
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);

  // Update editFormData when event data loads
  useEffect(() => {
    if (event) {
      setEditFormData(createEditFormData(event));
    }
  }, [event]);

  // Fetch real data on component mount
  useEffect(() => {
    if (eventId) {
      loadEventData();
      loadBookingsData();
    }
  }, [eventId]);

  const loadEventData = async () => {
    if (!eventId) return;
    
    try {
      setEventLoading(true);
      
      const { data, error } = await fetchEventData(eventId);
      
      if (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } else {
        setEvent(data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setEvent(null);
    } finally {
      setEventLoading(false);
    }
  };

  const loadBookingsData = async () => {
    if (!eventId) return;
    
    try {
      setBookingsLoading(true);
      
      const { data, error } = await fetchBookingsData(eventId);
      
      if (error) {
        console.error("Error fetching bookings:", error);
        setBookingsData([]);
      } else {
        setBookingsData(data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookingsData([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Mock messages data
  const messages: Message[] = [
    {
      id: "msg-1",
      content: "Hi! I'm very interested in performing at your jazz night. I have 10+ years of experience and can adapt my set to your audience.",
      createdAt: "2024-01-15T10:30:00Z",
      sender: "musician",
      senderName: "Jazz Master"
    },
    {
      id: "msg-2",
      content: "Thanks for your interest! Could you tell me more about your typical set length and any specific songs you'd like to include?",
      createdAt: "2024-01-15T14:20:00Z",
      sender: "venue",
      senderName: "Venue Manager"
    }
  ];

  const handleRowClick = (booking: any) => {
    console.log("Booking clicked:", booking);
    // Could open a detailed view or modal
  };

  const handleSaveEvent = async () => {
    if (!editFormData || !eventId) return;

    try {
      console.log("Saving event with data:", editFormData);
      
      // Prepare update data - only include defined, non-empty values
      const updateData: any = {};
      
      if (editFormData.title && editFormData.title.trim()) {
        updateData.title = editFormData.title.trim();
      }
      if (editFormData.description && editFormData.description.trim()) {
        updateData.description = editFormData.description.trim();
      }
      if (editFormData.date && editFormData.date.trim()) {
        // Convert date to ISO string with proper timezone handling
        // The date input gives us a local date (e.g., 2025-07-23)
        // We need to create a Date object at midnight in the local timezone
        const [year, month, day] = editFormData.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day); // month is 0-indexed
        
        // Convert to UTC for storage
        updateData.date = localDate.toISOString();
      }
      if (editFormData.startTime && editFormData.startTime.trim()) {
        updateData.startTime = editFormData.startTime.trim();
      }
      if (editFormData.endTime && editFormData.endTime.trim()) {
        updateData.endTime = editFormData.endTime.trim();
      }
      if (editFormData.ticketPrice && editFormData.ticketPrice.trim()) {
        updateData.ticketPrice = parseFloat(editFormData.ticketPrice);
      }
      if (editFormData.totalCapacity && editFormData.totalCapacity.trim()) {
        updateData.totalCapacity = parseInt(editFormData.totalCapacity);
      }
      if (editFormData.status && editFormData.status.trim()) {
        updateData.status = editFormData.status.trim();
      }
      if (editFormData.genres && Array.isArray(editFormData.genres)) {
        updateData.genres = editFormData.genres;
      }

      // Special handling for status changes
      if (updateData.status) {
        // If changing from confirmed to another status, automatically set to "open"
        // This handles cases where a musician cancels or venue wants to reopen applications
        if (event?.status === 'confirmed' && updateData.status !== 'confirmed') {
          updateData.status = 'open';
          console.log("Event status automatically changed to 'open' (was confirmed)");
        }
      }

      // Debug: Log the status change logic
      console.log("Status change debug:", {
        currentEventStatus: event?.status,
        newStatus: updateData.status,
        editFormDataStatus: editFormData?.status,
        shouldChangeToOpen: event?.status === 'confirmed' && updateData.status && updateData.status !== 'confirmed',
        editFormDataKeys: Object.keys(editFormData || {}),
        editFormDataFull: editFormData
      });

      console.log("Final update data:", updateData);

      if (Object.keys(updateData).length === 0) {
        console.log("No changes to save");
        setIsEditing(false);
        return;
      }

      // Use direct Supabase call instead since the API doesn't have an event update method
      const { data: updatedEvent, error: updateError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .select();
        
      if (updateError) {
        throw updateError;
      }
      console.log("Event updated successfully:", updatedEvent);
      
      // Refresh event data
      await loadEventData();
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleBookMusician = async (bookingId: string) => {
    if (!eventId) {
      console.error("No event ID available");
      return;
    }

    try {
      console.log("Selecting musician for booking:", bookingId);
      
      const { data, error } = await updateBookingStatus(bookingId, "selected");
      
      if (error) {
        throw error;
      }
      
      // Refresh data
      await loadEventData();
      await loadBookingsData();
      
      console.log("Musician selected successfully - waiting for confirmation");
      
    } catch (error) {
      console.error("Error selecting musician:", error);
      alert("Failed to select musician. Please try again.");
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      console.log("Rejecting booking:", bookingId);
      
      const { data, error } = await updateBookingStatus(bookingId, "rejected");
      
      if (error) {
        throw error;
      }
      
      // Refresh bookings data
      await loadBookingsData();
      
      console.log("Booking rejected successfully");
      
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };

  const handleCommunicateBooking = async (bookingId: string) => {
    try {
      console.log("Setting booking to communicating:", bookingId);
      
      const { data, error } = await updateBookingStatus(bookingId, "communicating");
      
      if (error) {
        throw error;
      }
      
      // Refresh bookings data
      await loadBookingsData();
      
      console.log("Booking set to communicating successfully");
      
    } catch (error) {
      console.error("Error setting booking to communicating:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log("Sending message:", newMessage);
    // Here you would typically send the message via API
    // For now, just clear the input
    setNewMessage("");
  };

  // Early return if no eventId
  if (!eventId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid Event</h2>
          <p className="text-muted-foreground">No event ID provided.</p>
        </div>
      </div>
    );
  }

  // Get current event status
  const getCurrentEventStatus = () => {
    if (!event) return "loading";
    return getEventStatus(event, bookingsData);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Loading State */}
      {eventLoading || !event ? (
        <LoadingState />
      ) : (
        <>
          {/* Header */}
          <PageHeader />

          {/* Event Title and Status */}
          <EventTitleCard
            event={event}
            isEditing={isEditing}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            getStatusBadge={(status) => <StatusBadge status={status} />}
            getEventStatus={getCurrentEventStatus}
          />

          {/* Main Content Tabs */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bookingsCount={bookingsData?.length || 0}
          >
            {/* Event Details Tab */}
            <TabsContent value="overview" className="space-y-6">
              {eventLoading ? (
                <LoadingState title="Loading event data..." message="Please wait..." />
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Event Information */}
                  <VenueEventDetailsCard
                    event={event}
                    isEditing={isEditing}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    setIsEditing={setIsEditing}
                    handleSaveEvent={handleSaveEvent}
                  />

                  {/* Venue Information */}
                  <VenueInfoCard venue={event.venue} />
                </div>
              )}

              {/* Musician Information */}
              {event?.musician && (
                <VenueBookedMusicianCard musician={event.musician} />
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <VenueEventActivity
                bookingsData={bookingsData}
                bookingsLoading={bookingsLoading}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                setSortColumn={setSortColumn}
                setSortDirection={setSortDirection}
                handleRowClick={handleRowClick}
                handleBookMusician={handleBookMusician}
                handleRejectBooking={handleRejectBooking}
                handleCommunicateBooking={handleCommunicateBooking}
                eventGenres={event?.genres}
              />
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-6">
              <VenueCommunicationsCard
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <VenueEventHistoryTab eventId={eventId} />
            </TabsContent>
          </TabNavigation>
        </>
      )}
    </div>
  );
} 
