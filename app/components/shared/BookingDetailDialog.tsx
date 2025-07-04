import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, Clock, User, MapPin, DollarSign, MessageSquare, History } from "lucide-react";
import { BookingActionButtons } from "./BookingActionButtons";
import { ActivityLog, generateBookingActivityItems } from "./ActivityLog";

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

  const activityItems = generateBookingActivityItems(booking);

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
            <ActivityLog activities={activityItems} />
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