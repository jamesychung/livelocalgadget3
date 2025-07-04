import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar, List, Filter, Phone, Mail, MapPin, Clock, User, DollarSign, CheckCircle, Users, X } from "lucide-react";
import { Booking, VenueProfile } from "./types";
import { formatDate } from "./utils";
import { Link } from "react-router-dom";
import VenueEventCalendar from "../../shared/VenueEventCalendar";
import { EventBookingDialog } from "../../shared/EventBookingDialog";

interface BookingsTabProps {
  bookings: Booking[];
  venue: VenueProfile;
  events?: any[]; // Add events prop for complete event pipeline
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ bookings, venue, events = [] }) => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleEventClick = (event: any) => {
    // Find the corresponding booking for this event
    const eventBooking = bookings.find(booking => booking.event?.id === event.id);
    setSelectedEvent(event);
    setSelectedBooking(eventBooking || null);
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
  };

  // Combine events and bookings for complete view
  const allEventsWithBookingInfo = events.map(event => {
    const eventBookings = bookings.filter(booking => booking.event?.id === event.id);
    const confirmedBookings = eventBookings.filter(booking => booking.status === 'confirmed');
    const pendingApplications = eventBookings.filter(booking => 
      booking.status === 'applied' || booking.status === 'selected'
    );
    
    const eventWithBookingInfo = {
      ...event,
      type: 'event',
      bookings: eventBookings,
      confirmedBookings: confirmedBookings.length,
      pendingApplications: pendingApplications.length,
      hasConfirmedBooking: confirmedBookings.length > 0,
      eventStatus: event.eventStatus || (confirmedBookings.length > 0 ? 'confirmed' : 'open'), // Use proper eventStatus
      // Map field names to match VenueEventCalendar expectations
      startTime: event.start_time,
      endTime: event.end_time
    };
    
    return eventWithBookingInfo;
  });

  // Filter based on status
  const filteredItems = allEventsWithBookingInfo.filter(item => {
    if (statusFilter === "all") return true;
    if (statusFilter === "confirmed") return item.hasConfirmedBooking;
    if (statusFilter === "open") return item.eventStatus === 'open';
    if (statusFilter === "invited") return item.eventStatus === 'invited';
    if (statusFilter === "completed") return item.eventStatus === 'completed';
    if (statusFilter === "cancelled") return item.eventStatus === 'cancelled';
    return true;
  });

  // Get confirmed bookings for stats
  const confirmedItems = filteredItems.filter(item => item.hasConfirmedBooking);
  const openEvents = filteredItems.filter(item => item.eventStatus === 'open');
  const invitedEvents = filteredItems.filter(item => item.eventStatus === 'invited');

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-gray-600">Manage your confirmed bookings and calendar</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="open">Open Events</SelectItem>
              <SelectItem value="invited">Invited Events</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{confirmedItems.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Events</p>
                <p className="text-2xl font-bold text-blue-600">{openEvents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Invited Events</p>
                <p className="text-2xl font-bold text-purple-600">{invitedEvents.length}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {/* Calendar/List View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {viewMode === "calendar" ? <Calendar className="h-5 w-5" /> : <List className="h-5 w-5" />}
              {viewMode === "calendar" ? "Calendar View" : "List View"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "calendar" ? (
              <VenueEventCalendar 
                events={filteredItems}
                bookings={bookings}
                onEditEvent={(event) => handleEventClick(event as any)}
                title="Booking Calendar"
                description="Event Planning & Booking Management"
              />
            ) : (
              <BookingList 
                items={filteredItems} 
                onBookingSelect={handleEventClick}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <EventBookingDialog
        isOpen={isEventDialogOpen}
        onClose={closeEventDialog}
        event={selectedEvent}
        booking={selectedBooking}
        viewMode="venue"
        onStatusUpdate={(updatedBooking) => {
          // For now, just refresh the page to update the data
          // In a more sophisticated app, you'd update the state
          window.location.reload();
        }}
      />
    </div>
  );
};



const BookingList: React.FC<{
  items: any[];
  onBookingSelect: (event: any) => void;
}> = ({ items, onBookingSelect }) => {
  return (
    <div className="space-y-4">
      {items.map(item => {
        // For events with confirmed bookings, show the first confirmed musician
        const confirmedMusician = item.bookings?.find((booking: any) => booking.status === 'confirmed')?.musician;
        
        return (
          <div
            key={item.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => onBookingSelect(item)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {confirmedMusician?.profile_picture ? (
                    <img 
                      src={confirmedMusician.profile_picture} 
                      alt={confirmedMusician.stage_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {item.title?.charAt(0) || "E"}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">
                    {confirmedMusician ? `with ${confirmedMusician.stage_name}` : 
                     item.eventStatus === 'open' ? 'Open for applications' :
                     item.eventStatus === 'invited' ? 'Invited musicians' :
                     `${item.pendingApplications} pending applications`}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={item.hasConfirmedBooking ? 'default' : 'secondary'}>
                  {item.hasConfirmedBooking ? 'Confirmed' : 
                   item.eventStatus === 'open' ? 'Open' :
                   item.eventStatus === 'invited' ? 'Invited' :
                   item.eventStatus}
                </Badge>
                {item.pendingApplications > 0 && (
                  <p className="text-xs text-orange-600 mt-1">{item.pendingApplications} pending</p>
                )}
                {item.confirmedBookings > 0 && (
                  <p className="text-xs text-green-600 mt-1">{item.confirmedBookings} confirmed</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 