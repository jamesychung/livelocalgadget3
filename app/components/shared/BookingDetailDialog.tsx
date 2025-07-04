import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, Clock, User, MapPin, DollarSign, MessageSquare, History } from "lucide-react";
import { BookingActionButtons } from "./BookingActionButtons";

interface BookingDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  currentUser: any;
  onStatusUpdate: (updatedBooking: any) => void;
}

export const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({
  isOpen,
  onClose,
  booking,
  currentUser,
  onStatusUpdate
}) => {
  if (!booking) return null;

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Generate activity log items from booking timestamps
  const generateActivityItems = () => {
    const activityItems = [];
    
    // Add event creation as the first activity
    if (booking.event?.created_at) {
      activityItems.push({
        timestamp: new Date(booking.event.created_at),
        action: "Event created",
        actor: "Venue",
        details: `Event "${booking.event.title}" was created`
      });
    }
    
    if (booking.applied_at) {
      activityItems.push({
        timestamp: new Date(booking.applied_at),
        action: "Applied to event",
        actor: "Musician",
        details: `Applied with rate: $${booking.proposed_rate || 'Not specified'}`
      });
    }
    
    if (booking.selected_at) {
      activityItems.push({
        timestamp: new Date(booking.selected_at),
        action: "Selected by venue",
        actor: "Venue",
        details: "Venue selected this musician for the event"
      });
    }
    
    if (booking.confirmed_at) {
      activityItems.push({
        timestamp: new Date(booking.confirmed_at),
        action: "Booking confirmed",
        actor: "Musician",
        details: "Musician confirmed the booking"
      });
    }
    
    if (booking.cancel_requested_at) {
      const requestedBy = booking.cancel_requested_by_role === 'venue' ? 'Venue' : 'Musician';
      activityItems.push({
        timestamp: new Date(booking.cancel_requested_at),
        action: "Cancellation requested",
        actor: requestedBy,
        details: booking.cancellation_reason ? `Reason: ${booking.cancellation_reason}` : "No reason provided"
      });
    }
    
    if (booking.cancelled_at) {
      const confirmedBy = booking.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'Musician';
      activityItems.push({
        timestamp: new Date(booking.cancelled_at),
        action: "Cancellation confirmed",
        actor: confirmedBy,
        details: "Booking was cancelled"
      });
    }
    
    if (booking.completed_at) {
      activityItems.push({
        timestamp: new Date(booking.completed_at),
        action: "Event completed",
        actor: booking.completed_by_role ? (booking.completed_by_role === 'venue' ? 'Venue' : 'Musician') : "System",
        details: "Event was marked as completed"
      });
    }
    
    // Sort by timestamp, oldest first for chronological order
    return activityItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const activityItems = generateActivityItems();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {booking.musician?.stage_name || "Booking Details"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Booking Details</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Musician Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span> {booking.musician?.stage_name || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span> {booking.musician?.city && booking.musician?.state ? `${booking.musician.city}, ${booking.musician.state}` : "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Proposed Rate:</span> ${booking.proposed_rate || "N/A"}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Event Date:</span> {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time:</span> {booking.start_time && booking.end_time ? `${booking.start_time} - ${booking.end_time}` : "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="h-5">
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {booking.musician_pitch && (
              <div>
                <h3 className="font-semibold mb-2">Musician's Pitch</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p>{booking.musician_pitch}</p>
                </div>
              </div>
            )}
            
            <BookingActionButtons
              booking={booking}
              currentUser={currentUser}
              onStatusUpdate={onStatusUpdate}
              className="mt-4"
            />
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <div className="space-y-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Activity Log
              </h3>
              
              {activityItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Date & Time</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Action</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">By</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityItems.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="py-2 px-3 text-sm text-muted-foreground">
                            {item.timestamp.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-sm font-medium">
                            {item.action}
                          </td>
                          <td className="py-2 px-3">
                            <Badge variant="outline" className="text-xs">
                              {item.actor}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-sm">
                            {item.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>No activity recorded yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open(`/musician/${booking.musician?.id}`, '_blank')}
          >
            <User className="h-4 w-4 mr-2" />
            View Musician Profile
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(`/messages?recipient=${booking.musician?.id}`, '_blank')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Musician
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 