import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { OverviewTabProps, Booking, Event } from "./types";
import { formatDate } from "./utils";
import { StatusDisplay } from "../../shared/StatusDisplay";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Mail, AlertCircle, Users } from "lucide-react";
import { EventDialog } from "../../shared/EventDialog";
import { useVenueEvents } from "../../../hooks/useVenueEvents";
import { BookingCard } from "../../shared/BookingCard";


export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  venue, 
  user,
  recentEvents, 
  pendingBookings,
  selectedBookings,
  confirmedBookings,
  pendingCancelBookings,
  allBookings = []
}) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [selectedEventForApplications, setSelectedEventForApplications] = useState<any>(null);

  // Use venue events hook to get pending applications data
  const {
    getEventsWithPendingApplications,
    getPendingApplications,
    getApplicationCount,
    handleBookApplication,
    handleRejectApplication,
  } = useVenueEvents(user);

  const handleEventClick = (booking: Booking) => {
    setSelectedEvent(booking.event);
    setSelectedBooking(booking);
    setIsEventDialogOpen(true);
  };

  const handleRecentEventClick = (event: Event) => {
    setSelectedEvent(event);
    // Find the first booking for this event to show activity log
    const eventBookings = allBookings.filter(booking => booking.event?.id === event.id);
    setSelectedBooking(eventBookings.length > 0 ? eventBookings[0] : null);
    setIsEventDialogOpen(true);
  };

  const handleViewApplications = (event: any) => {
    setSelectedEventForApplications(event);
    setApplicationsDialogOpen(true);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Confirmed Bookings - Top Priority Section (TEMPORARILY SHOWING PENDING FOR TESTING) */}
      {(confirmedBookings.length > 0 || pendingBookings.length > 0) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-800">
              <div className="flex items-center gap-2">
                <span>🎵 Confirmed Bookings - Don't Miss These! (TESTING)</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {(confirmedBookings.length > 0 ? confirmedBookings : pendingBookings).length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(confirmedBookings.length > 0 ? confirmedBookings : pendingBookings).slice(0, 5).map((booking) => (
                <ConfirmedBookingItem 
                  key={booking.id} 
                  booking={booking} 
                  onEventClick={() => handleEventClick(booking)}
                />
              ))}
            </div>
          </CardContent>
                </Card>
      )}

             {/* Applications Received Section */}
       {getEventsWithPendingApplications().length > 0 && (
         <Card className="border-purple-200 bg-purple-50">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-purple-800">
               <AlertCircle className="h-5 w-5" />
               Applications Received - Action Required
               <Badge variant="destructive" className="bg-purple-100 text-purple-800">
                 {getPendingApplications().length} total
               </Badge>
             </CardTitle>
             <p className="text-sm text-purple-700">
               These events have musician applications waiting for your review
             </p>
           </CardHeader>
           <CardContent>
             <div className="space-y-3">
               {getEventsWithPendingApplications().map((event) => {
                 const pendingCount = getApplicationCount(event.id);
                 
                 return (
                   <div key={event.id} className="bg-white border border-purple-200 rounded-lg p-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 flex-1">
                         <div className="flex -space-x-2">
                           {allBookings
                             .filter(booking => booking.event?.id === event.id && booking.status === 'applied')
                             .slice(0, 3)
                             .map((booking, index) => (
                               <div 
                                 key={booking.id} 
                                 className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-2 border-white"
                                 style={{ zIndex: 3 - index }}
                               >
                                 {booking.musician?.profile_picture ? (
                                   <img 
                                     src={booking.musician.profile_picture} 
                                     alt={booking.musician.stage_name} 
                                     className="w-full h-full object-cover"
                                   />
                                 ) : (
                                   <span className="text-purple-600 font-semibold text-xs">
                                     {booking.musician?.stage_name?.charAt(0) || "M"}
                                   </span>
                                 )}
                               </div>
                             ))
                           }
                           {pendingCount > 3 && (
                             <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center border-2 border-white">
                               <span className="text-purple-700 font-semibold text-xs">
                                 +{pendingCount - 3}
                               </span>
                             </div>
                           )}
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium text-gray-900">{event.title}</h4>
                           <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                             <span>{formatDate(event.date)}</span>
                             <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge variant="destructive" className="bg-purple-100 text-purple-800">
                           {pendingCount} pending
                         </Badge>
                         <Button
                           size="sm"
                           onClick={() => handleViewApplications(event)}
                           className="bg-purple-600 hover:bg-purple-700"
                         >
                           Review Applications
                         </Button>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
           </CardContent>
         </Card>
       )}

              <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          event={selectedEvent}
          booking={selectedBooking}
          bookings={selectedEvent ? allBookings.filter(booking => booking.event?.id === selectedEvent.id) : []}
          currentUser={{ venue: { id: venue.id } }}
          userRole="venue"
          onStatusUpdate={(updatedBooking: any) => {
            // Handle status update - could refresh data or update state
            console.log('Status updated:', updatedBooking);
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

        {/* Applications Dialog */}
        <EventDialog
          isOpen={applicationsDialogOpen}
          onClose={() => setApplicationsDialogOpen(false)}
          event={selectedEventForApplications}
          bookings={selectedEventForApplications ? allBookings.filter(b => b.event?.id === selectedEventForApplications.id) : []}
          onAcceptApplication={(bookingId: string) => handleBookApplication(bookingId, selectedEventForApplications?.id || '')}
          onRejectApplication={handleRejectApplication}
          currentUser={{ venue: { id: venue.id } }}
          userRole="venue"
          showApplicationsList={true}
        />
    </div>
  );
};

const ConfirmedBookingItem: React.FC<{ 
  booking: Booking; 
  onEventClick: () => void;
}> = ({ booking, onEventClick }) => {
  return (
    <BookingCard
      booking={booking}
      onEventClick={onEventClick}
      viewMode="venue"
      variant="confirmed"
      showStatusBadge={true}
      showActions={false}
      showPitch={false}
      clickText="Click for event details and activity log"
    />
  );
};



const BookingItem: React.FC<{ 
  booking: Booking; 
  onEventClick: () => void;
}> = ({ booking, onEventClick }) => {
  return (
    <div 
      className="flex items-center justify-between border-b pb-2 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
      onClick={onEventClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {booking.musician?.profile_picture ? (
            <img 
              src={booking.musician.profile_picture} 
              alt={booking.musician.stage_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xs">
              {booking.musician?.stage_name?.charAt(0) || "M"}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-medium">{booking.musician?.stage_name}</h4>
          <div className="flex items-center text-xs text-gray-500">
            <span>{booking.event?.title || "Event"}</span>
            <span className="mx-1">•</span>
                            <StatusDisplay status={booking.status} variant="badge" />
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click for event details and activity log
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEventClick();
          }}
        >
          View
        </Button>
      </div>
    </div>
  );
}; 