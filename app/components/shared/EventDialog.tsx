import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, Clock, User, MapPin, DollarSign, MessageSquare, History, Music, Phone, Mail, Eye, Users, CheckCircle, XCircle } from "lucide-react";
import { BookingActionButtons } from "./BookingActionButtons";
import { ActivityLog, generateBookingActivityItems, generateEventActivityItems } from "./ActivityLog";
import { StatusDisplay } from "./StatusDisplay";
import { getStatusColorClasses, getStatusLabel, deriveEventStatusFromBookings } from "../../lib/utils";
import { Link } from "react-router-dom";
import { EventMessagingDialog } from "./EventMessagingDialog";
import { Badge } from "../ui/badge";

// Helper function to get status border colors for dialog
const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'border-l-blue-500 border-r-blue-500';
    case 'confirmed':
      return 'border-l-green-500 border-r-green-500';
    case 'invited':
      return 'border-l-indigo-500 border-r-indigo-500';
    case 'application_received':
      return 'border-l-purple-500 border-r-purple-500';
    case 'selected':
      return 'border-l-yellow-500 border-r-yellow-500';
    case 'cancel_requested':
      return 'border-l-orange-500 border-r-orange-500';
    case 'cancelled':
      return 'border-l-red-500 border-r-red-500';
    case 'completed':
      return 'border-l-cyan-500 border-r-cyan-500';
    default:
      return 'border-l-gray-300 border-r-gray-300';
  }
};

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  booking?: any; // The specific booking if viewing from booking context
  bookings?: any[]; // All bookings for this event (for venue view)
  currentUser: any;
  userRole: 'venue' | 'musician';
  
  // Action handlers
  onStatusUpdate?: (updatedBooking: any) => void;
  onAcceptApplication?: (bookingId: string) => void;
  onRejectApplication?: (bookingId: string) => void;
  onApply?: (event: any) => void;
  onMessageOtherParty?: (recipientId: string) => void; // Legacy - now handled internally
  
  // Display options
  showApplicationsList?: boolean; // Show applications list (from ApplicationDetailDialog)
  showBookingActions?: boolean; // Show booking action buttons
  
  // Alternative prop names for compatibility
  open?: boolean; // Alternative to isOpen for ApplicationDetailDialog compatibility
  onOpenChange?: (open: boolean) => void; // Alternative to onClose
  selectedEvent?: any; // Alternative to event
  getEventApplications?: (eventId: string) => any[]; // Alternative to bookings
}

// Helper function to properly parse UTC timestamps from database
const parseUTCTimestamp = (timestamp: string | Date): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If the timestamp doesn't end with 'Z', it's likely a UTC timestamp without the timezone indicator
  // Add 'Z' to ensure it's parsed as UTC
  const timestampString = timestamp.toString();
  if (timestampString && !timestampString.endsWith('Z') && !timestampString.includes('+') && !timestampString.includes('-', 10)) {
    return new Date(timestampString + 'Z');
  }
  
  return new Date(timestamp);
};

export const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  event,
  booking,
  bookings = [],
  currentUser,
  userRole,
  onStatusUpdate,
  onAcceptApplication,
  onRejectApplication,
  onApply,
  onMessageOtherParty, // Legacy prop - now handled internally
  showApplicationsList = false,
  showBookingActions = true,
  
  // Alternative props for compatibility
  open,
  onOpenChange,
  selectedEvent,
  getEventApplications
}) => {
  // Internal state for messaging dialog
  const [isMessagingDialogOpen, setIsMessagingDialogOpen] = React.useState(false);
  
  // Internal status update handler - if no onStatusUpdate is provided, we'll handle it internally
  const handleStatusUpdate = React.useCallback((updatedBooking: any) => {
    if (onStatusUpdate) {
      // Use the provided handler
      onStatusUpdate(updatedBooking);
    } else {
      // Handle internally - refresh the page to show updated data
      console.log('Booking status updated:', updatedBooking);
      window.location.reload();
    }
  }, [onStatusUpdate]);

  // Handle alternative prop names for compatibility
  const dialogOpen = isOpen ?? open ?? false;
  const dialogClose = onClose ?? ((open: boolean) => onOpenChange?.(open)) ?? (() => {});
  const dialogEvent = event ?? selectedEvent;
  const dialogBookings = bookings.length > 0 ? bookings : (getEventApplications && dialogEvent ? getEventApplications(dialogEvent.id) : []);
  if (!dialogEvent) return null;

  // Calculate the derived event status based on bookings
  const derivedEventStatus = deriveEventStatusFromBookings(dialogEvent, dialogBookings);
  
  // Get the status border color for the dialog
  const statusBorderColor = getStatusBorderColor(derivedEventStatus);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return parseUTCTimestamp(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Generate activity items for the ActivityLog
  const getActivityItems = () => {
    if (booking) {
      // If we have a specific booking, show its activity
      return generateBookingActivityItems(booking);
    } else {
      // Otherwise, show event activity with all bookings
      return generateEventActivityItems(dialogEvent, dialogBookings);
    }
  };

  const activityItems = getActivityItems();

  // Get the other party (venue or musician) for profile links and messaging
  const getOtherParty = () => {
    if (userRole === 'venue') {
      // For venues, try to get musician from specific booking first
      if (booking?.musician) {
        return booking.musician;
      }
      // If no specific booking, get musician from the first booking with a musician
      const bookingWithMusician = dialogBookings.find(b => b.musician);
      if (bookingWithMusician?.musician) {
        return bookingWithMusician.musician;
      }
    } else if (userRole === 'musician' && dialogEvent?.venue) {
      return dialogEvent.venue;
    }
    return null;
  };

  const otherParty = getOtherParty();
  
  // Debug information
  console.log('🎭 EventDialog Debug:', {
    userRole,
    hasBooking: !!booking,
    bookingsCount: dialogBookings.length,
    hasOtherParty: !!otherParty,
    eventTitle: dialogEvent?.title,
    bookingStatuses: dialogBookings.map(b => b.status)
  });

  const getDialogTitle = () => {
    if (showApplicationsList) {
      return `Applications for ${dialogEvent.title}`;
    }
    if (booking) {
      return `Booking Details - ${dialogEvent.title}`;
    }
    return dialogEvent.title;
  };

  // Internal message handler - opens the integrated messaging dialog
  const handleOpenMessaging = () => {
    setIsMessagingDialogOpen(true);
    
    // Call legacy onMessageOtherParty if provided (for backward compatibility)
    if (onMessageOtherParty && otherParty) {
      onMessageOtherParty(otherParty.id);
    }
  };

  // Render venue-specific content
  const renderVenueView = () => (
    <>
      {/* Event Information */}
      <div>
        <h3 className="font-semibold mb-3">Event Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span> {formatDate(dialogEvent.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Time:</span> {formatTime(dialogEvent.start_time)} - {formatTime(dialogEvent.end_time)}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Rate:</span> ${dialogEvent.rate || "TBD"}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <StatusDisplay status={derivedEventStatus} variant="button" />
            </div>
            {dialogEvent.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="text-muted-foreground mt-1">{dialogEvent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {showApplicationsList && dialogBookings.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Applications ({dialogBookings.length})</h3>
          <div className="space-y-4">
            {dialogBookings.map((application, index) => (
              <div key={application.id || index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {application.musician?.profile_picture ? (
                        <img 
                          src={application.musician.profile_picture} 
                          alt={application.musician.stage_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{application.musician?.stage_name || "Unknown Musician"}</h4>
                      <p className="text-sm text-muted-foreground">
                        Applied {application.applied_at ? formatDate(application.applied_at) : "Recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDisplay status={application.status} variant="button" />
                    {application.proposed_rate && (
                      <Badge variant="outline">${application.proposed_rate}</Badge>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mb-3">
                  {application.status === 'applied' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => onAcceptApplication?.(application.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRejectApplication?.(application.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/musician/${application.musician?.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Profile
                    </Link>
                  </Button>
                </div>
                
                {application.musician_pitch && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <span className="font-medium">Pitch:</span>
                    {application.musician_pitch}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Render musician-specific content
  const renderMusicianView = () => (
    <>
      {/* Event Information */}
      <div>
        <h3 className="font-semibold mb-3">Event Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span> {formatDate(dialogEvent.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Time:</span> {formatTime(dialogEvent.start_time)} - {formatTime(dialogEvent.end_time)}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Rate:</span> ${dialogEvent.rate || booking?.proposed_rate || "TBD"}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <StatusDisplay status={booking?.status || derivedEventStatus} variant="button" />
            </div>
            {dialogEvent.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="text-muted-foreground mt-1">{dialogEvent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Venue Information */}
      {otherParty && (
        <div>
          <h3 className="font-semibold mb-3">Venue Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span> {otherParty.name}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span> 
                {otherParty.city && otherParty.state ? 
                  `${otherParty.city}, ${otherParty.state}` : "N/A"}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {otherParty.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Capacity:</span> {otherParty.capacity}
                </div>
              )}
              {otherParty.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span> {otherParty.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Status */}
      {booking && (
        <div>
          <h3 className="font-semibold mb-3">Your Application</h3>
          <div className="bg-muted p-4 rounded-lg">
            {booking.proposed_rate && (
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Your Rate:</span>
                <span>${booking.proposed_rate}</span>
              </div>
            )}
            {booking.musician_pitch && (
              <div>
                <span className="font-medium">Your Message:</span>
                <p className="text-sm mt-1">{booking.musician_pitch}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={dialogClose}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${statusBorderColor} border-l-4 border-r-4`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription>
              View event details and activity log
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              {userRole === 'venue' ? renderVenueView() : renderMusicianView()}
              
              {/* Action Buttons */}
              {(() => {
                // Determine which booking to show action buttons for
                let targetBooking = booking;
                
                if (!targetBooking && dialogBookings.length > 0 && userRole === 'venue') {
                  // For venues, prioritize bookings that need action
                  targetBooking = dialogBookings.find(b => 
                    b.status === 'confirmed' || 
                    b.status === 'selected' || 
                    b.status === 'pending_cancel'
                  ) || dialogBookings.find(b => b.musician) || dialogBookings[0];
                }
                
                return targetBooking ? (
                  <BookingActionButtons
                    booking={targetBooking}
                    currentUser={currentUser}
                    onStatusUpdate={handleStatusUpdate}
                    className="mt-4"
                  />
                ) : null;
              })()}
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <ActivityLog activities={activityItems} />
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={dialogClose}>
              Close
            </Button>
            
            {/* Role-specific action buttons */}
            {userRole === 'venue' && otherParty && (
              <>
                <Button variant="outline" asChild>
                  <Link to={`/musician/${otherParty.id}`}>
                    <User className="h-4 w-4 mr-2" />
                    View Musician Profile
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleOpenMessaging}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Musician
                </Button>
              </>
            )}
            
            {userRole === 'musician' && (
              <>
                {otherParty && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={`/venue/${otherParty.id}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        View Venue Profile
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleOpenMessaging}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Venue
                    </Button>
                  </>
                )}
                
                {!booking && onApply && (
                  <Button onClick={() => onApply(dialogEvent)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply for Event
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integrated Messaging Dialog */}
      <EventMessagingDialog
        open={isMessagingDialogOpen}
        onOpenChange={setIsMessagingDialogOpen}
        event={dialogEvent}
        booking={booking}
        onClose={() => setIsMessagingDialogOpen(false)}
      />
    </>
  );
}; 