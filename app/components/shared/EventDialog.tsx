import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, Clock, User, MapPin, DollarSign, MessageSquare, History, Music, Phone, Mail, Eye, Users, CheckCircle, XCircle } from "lucide-react";
import { BookingActionButtons } from "./BookingActionButtons";
import { ActivityLog, generateBookingActivityItems, generateEventActivityItems } from "./ActivityLog";
import { StatusDisplay } from "./StatusDisplay";
import { getStatusColorClasses, getStatusLabel, deriveEventStatusFromBookings } from "../../lib/utils";
import { Link } from "react-router-dom";

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
  onMessageOtherParty?: (recipientId: string) => void;
  
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
  onMessageOtherParty,
  showApplicationsList = false,
  showBookingActions = true,
  
  // Alternative props for compatibility
  open,
  onOpenChange,
  selectedEvent,
  getEventApplications
}) => {
  // Handle alternative prop names for compatibility
  const dialogOpen = isOpen ?? open ?? false;
  const dialogClose = onClose ?? ((open: boolean) => onOpenChange?.(open)) ?? (() => {});
  const dialogEvent = event ?? selectedEvent;
  const dialogBookings = bookings.length > 0 ? bookings : (getEventApplications && dialogEvent ? getEventApplications(dialogEvent.id) : []);
  if (!dialogEvent) return null;

  // Calculate the derived event status based on bookings
  const derivedEventStatus = deriveEventStatusFromBookings(dialogEvent, dialogBookings);

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

  // Generate activity log based on context
  const getActivityItems = () => {
    if (booking) {
      // If we have a specific booking, show its activity
      return generateBookingActivityItems(booking);
    } else {
      // If viewing event without specific booking, show event + all applications
      return generateEventActivityItems(dialogEvent, dialogBookings);
    }
  };

  const activityItems = getActivityItems();

  // Get the relevant person to display (venue for musician, musician for venue)
  const getOtherParty = () => {
    if (userRole === 'venue') {
      return booking?.musician || (dialogBookings.length === 1 ? dialogBookings[0].musician : null);
    } else {
      return dialogEvent.venue || booking?.venue;
    }
  };

  const otherParty = getOtherParty();

  // Get dialog title based on context
  const getDialogTitle = () => {
    if (userRole === 'venue') {
      if (booking?.musician) {
        return `Booking with ${booking.musician.stage_name}`;
      } else if (dialogBookings.length > 0) {
        return `Applications for ${dialogEvent.title}`;
      } else {
        return dialogEvent.title;
      }
    } else {
      return dialogEvent.title;
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

      {/* Musician Information (if specific booking) */}
      {booking?.musician && (
        <div>
          <h3 className="font-semibold mb-3">Musician Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span> {booking.musician.stage_name}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span> 
                {booking.musician.city && booking.musician.state ? 
                  `${booking.musician.city}, ${booking.musician.state}` : "N/A"}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Proposed Rate:</span> ${booking.proposed_rate || "N/A"}
              </div>
            </div>
          </div>
          
          {booking.musician_pitch && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Musician's Message</h4>
              <div className="bg-muted p-3 rounded-lg text-sm">
                {booking.musician_pitch}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Applications (if no specific booking) */}
      {!booking && dialogBookings.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Applications ({dialogBookings.length})</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {dialogBookings.map((application) => (
              <div key={application.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {application.musician?.profile_picture ? (
                        <img 
                          src={application.musician.profile_picture} 
                          alt={application.musician.stage_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{application.musician?.stage_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${application.proposed_rate} • {application.musician?.city}, {application.musician?.state}
                      </p>
                      <StatusDisplay status={application.status} variant="badge" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {application.status === 'applied' && onAcceptApplication && (
                      <Button size="sm" onClick={() => onAcceptApplication(application.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    )}
                    {application.status === 'applied' && onRejectApplication && (
                      <Button size="sm" variant="outline" onClick={() => onRejectApplication(application.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/musician/${application.musician?.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {application.musician_pitch && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
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
    <Dialog open={dialogOpen} onOpenChange={dialogClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            {userRole === 'venue' ? renderVenueView() : renderMusicianView()}
            
            {/* Action Buttons */}
            {booking && onStatusUpdate && (
              <BookingActionButtons
                booking={booking}
                currentUser={currentUser}
                onStatusUpdate={onStatusUpdate}
                className="mt-4"
              />
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <ActivityLog activities={activityItems} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
                onClick={() => onMessageOtherParty?.(otherParty.id)}
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
                    onClick={() => onMessageOtherParty?.(otherParty.id)}
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
  );
}; 