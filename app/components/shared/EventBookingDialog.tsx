import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, Clock, User, Phone, Mail, MapPin, DollarSign, Users } from "lucide-react";

interface EventBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  booking?: any;
  viewMode?: 'venue' | 'musician';
}

export const EventBookingDialog: React.FC<EventBookingDialogProps> = ({
  isOpen,
  onClose,
  event,
  booking,
  viewMode = 'venue'
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate activity log based on booking status and timestamps
  const generateActivityLog = () => {
    const activities = [];
    
    if (event?.created_at) {
      activities.push({
        timestamp: event.created_at,
        action: 'Event Created',
        description: 'Event was created and opened for applications'
      });
    }
    
    if (booking?.applied_at) {
      activities.push({
        timestamp: booking.applied_at,
        action: 'Application Received',
        description: `${booking.musician?.stage_name || 'Musician'} applied for this event`
      });
    }
    
    if (booking?.selected_at) {
      activities.push({
        timestamp: booking.selected_at,
        action: 'Musician Selected',
        description: `${booking.musician?.stage_name || 'Musician'} was selected for this event`
      });
    }
    
    if (booking?.confirmed_at) {
      activities.push({
        timestamp: booking.confirmed_at,
        action: 'Booking Confirmed',
        description: 'Booking was confirmed and finalized'
      });
    }
    
    if (booking?.completed_at) {
      activities.push({
        timestamp: booking.completed_at,
        action: 'Event Completed',
        description: 'Event was successfully completed'
      });
    }
    
    if (booking?.cancelled_at) {
      activities.push({
        timestamp: booking.cancelled_at,
        action: 'Booking Cancelled',
        description: booking.cancellation_reason || 'Booking was cancelled'
      });
    }
    
    return activities.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const activityLog = generateActivityLog();

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.title || event.event?.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              {/* Event Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Event Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatDate(event.date || event.event?.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {formatTime(event.startTime || event.start_time || event.event?.start_time)} - 
                        {formatTime(event.endTime || event.end_time || event.event?.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {event.rate || event.proposed_rate || booking?.proposed_rate ? 
                          `$${event.rate || event.proposed_rate || booking?.proposed_rate}` : 
                          'Rate TBD'}
                      </span>
                    </div>
                    <div>
                      <Badge variant={
                        event.eventStatus === 'confirmed' || booking?.status === 'confirmed' ? 'default' : 'secondary'
                      }>
                        {event.eventStatus || booking?.status || 'PENDING'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Venue or Musician Information */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {viewMode === 'venue' ? 'Musician Details' : 'Venue Information'}
                  </h3>
                  
                  {viewMode === 'venue' && booking?.musician ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {booking.musician.profile_picture ? (
                            <img 
                              src={booking.musician.profile_picture} 
                              alt={booking.musician.stage_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.musician.stage_name}</h4>
                          <p className="text-sm text-gray-600">
                            {booking.musician.city}, {booking.musician.state}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Genre:</span>
                          <p className="font-medium">{booking.musician.genre}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Rate:</span>
                          <p className="font-medium">${booking.musician.hourly_rate}/hour</p>
                        </div>
                      </div>
                      
                      {/* Contact Actions */}
                      <div className="flex gap-2 mt-4">
                        {booking.musician.phone && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`tel:${booking.musician.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </a>
                          </Button>
                        )}
                        {booking.musician.email && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`mailto:${booking.musician.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {event.venue?.name || 'Venue information not available'}
                        </span>
                      </div>
                      {event.venue?.city && event.venue?.state && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {event.venue.city}, {event.venue.state}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              )}

              {/* Genres */}
              {event.genres && event.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.genres.map((genre: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Statistics for Venue View */}
              {viewMode === 'venue' && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Booking Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-600">
                        {event.confirmedBookings || 0}
                      </div>
                      <div className="text-gray-600">Confirmed</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="font-semibold text-orange-600">
                        {event.pendingApplications || 0}
                      </div>
                      <div className="text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-600">
                        {(event.confirmedBookings || 0) + (event.pendingApplications || 0)}
                      </div>
                      <div className="text-gray-600">Total Applications</div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Activity Timeline</h3>
                <div className="space-y-3">
                  {activityLog.length > 0 ? (
                    activityLog.map((activity, index) => (
                      <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-sm">{activity.action}</h5>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No activity recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingDialog; 