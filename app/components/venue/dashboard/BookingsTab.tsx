import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar, List, Filter, Phone, Mail, MapPin, Clock, User, DollarSign, CheckCircle, Users, X, Plus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Booking, VenueProfile } from "./types";
import { formatDate } from "./utils";
import { Link } from "react-router-dom";
import { EventDialog } from "../../shared/EventDialog";
import { EventStatusLegend } from "../../shared/EventStatusLegend";
import { StatusDisplay } from "../../shared/StatusDisplay";
import { format } from "date-fns";
import { deriveEventStatusFromBookings, getStatusColorClasses } from "../../../lib/utils";

interface BookingsTabProps {
  bookings: Booking[];
  venue: VenueProfile;
  events?: any[]; // Add events prop for complete event pipeline
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ bookings, venue, events = [] }) => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
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
    const completedBookings = eventBookings.filter(booking => booking.status === 'completed');
    const cancelledBookings = eventBookings.filter(booking => booking.status === 'cancelled');
    const selectedBookings = eventBookings.filter(booking => booking.status === 'selected');
    const appliedBookings = eventBookings.filter(booking => booking.status === 'applied');
    const cancelRequestedBookings = eventBookings.filter(booking => booking.status === 'pending_cancel');
    
    // Use shared utility function to determine event status
    const eventStatus = deriveEventStatusFromBookings(event, bookings);
    
    const eventWithBookingInfo = {
      ...event,
      type: 'event',
      bookings: eventBookings,
      confirmedBookings: confirmedBookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: cancelledBookings.length,
      selectedBookings: selectedBookings.length,
      appliedBookings: appliedBookings.length,
      cancelRequestedBookings: cancelRequestedBookings.length,
      pendingApplications: appliedBookings.length + selectedBookings.length, // For backward compatibility
      hasConfirmedBooking: confirmedBookings.length > 0,
      hasCompletedBooking: completedBookings.length > 0,
      hasCancelledBooking: cancelledBookings.length > 0,
      hasSelectedBooking: selectedBookings.length > 0,
      hasAppliedBooking: appliedBookings.length > 0,
      hasCancelRequestedBooking: cancelRequestedBookings.length > 0,
      eventStatus: eventStatus,
      // Map field names to match VenueEventCalendar expectations
      startTime: event.start_time,
      endTime: event.end_time
    };
    
    return eventWithBookingInfo;
  });

  // Filter based on status
  const filteredItems = allEventsWithBookingInfo.filter(item => {
    if (statusFilter === "all") return !item.hasCompletedBooking && item.eventStatus !== 'cancelled'; // Exclude completed and cancelled from "all"
    if (statusFilter === "open") return item.eventStatus === 'open';
    if (statusFilter === "invited") return item.eventStatus === 'invited';
    if (statusFilter === "application_received") return item.eventStatus === 'application_received';
    if (statusFilter === "selected") return item.eventStatus === 'selected';
    if (statusFilter === "confirmed") return item.eventStatus === 'confirmed';
    if (statusFilter === "cancel_requested") return item.eventStatus === 'cancel_requested';
    if (statusFilter === "cancelled") return item.eventStatus === 'cancelled';
    if (statusFilter === "completed") return item.eventStatus === 'completed';
    return true;
  });

  // For calendar view, use filtered items but show all events when filter is "all"
  const calendarItems = statusFilter === "all" ? allEventsWithBookingInfo : filteredItems;

  // Event status stats are now handled by EventStatusLegend component

  // Calendar navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= lastDay || dates.length < 42) {
      dates.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return dates;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendarItems.filter(item => {
      const itemDate = new Date(item.date);
      return format(itemDate, 'yyyy-MM-dd') === dateStr;
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  const renderCalendarView = () => {
    const monthDates = getMonthDates();
    
    // Helper function to format time
    const formatTime = (timeString?: string) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes}${ampm}`;
    };

    // Helper function to format event display
    const formatEventDisplay = (event: any) => {
      const startTime = formatTime(event.startTime || event.start_time);
      const endTime = formatTime(event.endTime || event.end_time);
      const timeRange = startTime && endTime ? `${startTime}-${endTime}` : startTime || endTime || '';
      const showName = event.title || 'Event';
      
      if (timeRange) {
        return `${timeRange} - ${showName}`;
      }
      return showName;
    };
    
    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border rounded-lg overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {monthDates.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isTodayDate = isToday(date);
              const isCurrentMonthDate = isCurrentMonth(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[140px] p-2 border-r border-b ${
                    !isCurrentMonthDate 
                      ? 'bg-gray-50 text-gray-400' 
                      : isTodayDate 
                        ? 'bg-blue-50' 
                        : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isTodayDate ? 'text-blue-600' : isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-2 rounded cursor-pointer transition-colors ${getStatusColorClasses(event.eventStatus, 'calendar')}`}
                        title={formatEventDisplay(event)} // Full text on hover
                      >
                        <div className="space-y-1">
                          {/* Line 1: Time */}
                          <div className="font-medium leading-tight">
                            {formatTime(event.startTime || event.start_time)} - {formatTime(event.endTime || event.end_time)}
                          </div>
                          {/* Line 2: Event Title */}
                          <div className="leading-tight break-words">
                            {event.title}
                          </div>
                          {/* Line 3: Status with icon and label */}
                          <div className="leading-tight">
                            <StatusDisplay status={event.eventStatus} variant="compact" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Compact Header with Stats and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title and Description */}
            <div>
              <h2 className="text-2xl font-bold">Booking Management</h2>
              <p className="text-gray-600">Manage your confirmed bookings and calendar</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                        <Filter className="h-2.5 w-2.5 text-gray-600" />
                      </div>
                      <span>All Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="open">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                        <Calendar className="h-2.5 w-2.5 text-blue-600" />
                      </div>
                      <span>Open Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invited">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-indigo-100 rounded flex items-center justify-center">
                        <Mail className="h-2.5 w-2.5 text-indigo-600" />
                      </div>
                      <span>Invited Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="application_received">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                        <Users className="h-2.5 w-2.5 text-purple-600" />
                      </div>
                      <span>Application Received</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="selected">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-100 rounded flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-yellow-600" />
                      </div>
                      <span>Musician Selected</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="confirmed">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <span>Confirmed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cancel_requested">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                        <AlertCircle className="h-2.5 w-2.5 text-orange-600" />
                      </div>
                      <span>Cancel Requested</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-red-600" />
                      </div>
                      <span>Cancelled</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                      </div>
                      <span>Completed</span>
                    </div>
                  </SelectItem>
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

              {/* Create Event Button */}
              <Button asChild>
                <Link to="/create-event">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

                      {/* Event Status Legend */}
            {/* Stats Row */}
          <EventStatusLegend events={allEventsWithBookingInfo} />
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          {viewMode === "calendar" ? renderCalendarView() : (
            <BookingList 
              items={filteredItems} 
              onBookingSelect={handleEventClick}
            />
          )}
        </CardContent>
      </Card>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={closeEventDialog}
        event={selectedEvent}
        booking={selectedBooking}
        bookings={selectedEvent ? bookings.filter(booking => booking.event?.id === selectedEvent.id) : []}
        currentUser={{ venue: { id: venue.id } }}
        userRole="venue"
        onStatusUpdate={(updatedBooking: any) => {
          // Refresh the page to get updated data
          window.location.reload();
        }}
        onAcceptApplication={(bookingId: string) => {
          // Handle accept - this is for dashboard view so might not need implementation
          console.log('Accept application:', bookingId);
        }}
        onRejectApplication={(bookingId: string) => {
          // Handle reject - this is for dashboard view so might not need implementation  
          console.log('Reject application:', bookingId);
        }}
        onMessageOtherParty={(recipientId: string) => {
          window.open(`/messages?recipient=${recipientId}`, '_blank');
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
                <Badge variant="default" className={
                  item.eventStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                  item.eventStatus === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                  item.eventStatus === 'cancel_requested' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                  item.eventStatus === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                  item.eventStatus === 'selected' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                  item.eventStatus === 'application_received' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                  item.eventStatus === 'invited' ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' :
                  item.eventStatus === 'open' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }>
                  {item.eventStatus === 'completed' ? 'Completed' :
                   item.eventStatus === 'cancelled' ? 'Cancelled' :
                   item.eventStatus === 'cancel_requested' ? 'Cancel Requested' :
                   item.eventStatus === 'confirmed' ? 'Confirmed' :
                   item.eventStatus === 'selected' ? 'Musician Selected' :
                   item.eventStatus === 'application_received' ? 'Application Received' :
                   item.eventStatus === 'invited' ? 'Invited' :
                   item.eventStatus === 'open' ? 'Open' :
                   item.eventStatus}
                </Badge>
                {item.pendingApplications > 0 && (
                  <p className="text-xs text-orange-600 mt-1">{item.pendingApplications} pending</p>
                )}
                {item.confirmedBookings > 0 && !item.hasCompletedBooking && item.eventStatus !== 'cancelled' && (
                  <p className="text-xs text-green-600 mt-1">{item.confirmedBookings} confirmed</p>
                )}
                {item.completedBookings > 0 && (
                  <p className="text-xs text-emerald-600 mt-1">{item.completedBookings} completed</p>
                )}
                {item.cancelledBookings > 0 && (
                  <p className="text-xs text-red-600 mt-1">{item.cancelledBookings} cancelled</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 