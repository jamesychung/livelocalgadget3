import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Calendar, Users, Clock, Eye, X, MessageSquare, Check } from "lucide-react";
import { Link } from 'react-router-dom';
import { BookingActionButtons } from '../../shared/BookingActionButtons';
import { EventDetailDialogProps } from './types';

export const EventDetailDialog: React.FC<EventDetailDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  user,
  bookings,
  musicians,
  handleApply,
  handleNotInterested,
  handleMessageVenue,
  handleViewBookingDetails,
  handleBookingStatusUpdate,
  getMusicianApplicationStatus,
  getMatchingMusicians
}) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {selectedEvent.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Event Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Date:</span> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'TBD'}</div>
                    <div><span className="font-medium">Time:</span> {selectedEvent.start_time} - {selectedEvent.end_time}</div>
                    <div><span className="font-medium">Rate:</span> {selectedEvent.rate ? `$${selectedEvent.rate}` : 'TBD'}</div>
                    <div><span className="font-medium">Status:</span> {selectedEvent.event_status}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Venue Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedEvent.venue?.name}</div>
                    <div><span className="font-medium">Location:</span> {selectedEvent.venue?.city && selectedEvent.venue?.state ? `${selectedEvent.venue.city}, ${selectedEvent.venue.state}` : 'Not specified'}</div>
                    <div><span className="font-medium">Type:</span> {selectedEvent.venue?.type || 'Not specified'}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}

              {/* Genres */}
              {selectedEvent.genres && selectedEvent.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.genres.map((genre: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Musicians */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Matching Musicians ({getMatchingMusicians(selectedEvent).length})
                </h3>
                
                {getMatchingMusicians(selectedEvent).length > 0 ? (
                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {getMatchingMusicians(selectedEvent).map((musician) => (
                      <div key={musician.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className="font-medium">{musician.stage_name}</h5>
                            {musician.hourly_rate && (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                ${musician.hourly_rate}/hr
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Location:</span> {musician.city && musician.state ? `${musician.city}, ${musician.state}` : 'Not specified'}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span> {musician.email}
                            </div>
                            <div>
                              <span className="font-medium">Genres:</span> {musician.genres?.join(", ") || "None specified"}
                            </div>
                          </div>
                          
                          {musician.bio && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {musician.bio}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/musician/${musician.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No musicians match this event's criteria</p>
                  </div>
                )}
              </div>

              {/* Musician Booking Actions */}
              {(() => {
                const { status, booking } = getMusicianApplicationStatus(selectedEvent.id);
                if (booking) {
                  return (
                    <div className="flex items-center justify-between">
                      <BookingActionButtons
                        booking={booking}
                        currentUser={user}
                        onStatusUpdate={(updatedBooking) => {
                          handleBookingStatusUpdate(updatedBooking);
                        }}
                      />
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewBookingDetails(booking)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Activity Log
                      </Button>
                    </div>
                  );
                }
                return null;
              })()}
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <div className="space-y-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Event Timeline
                </h3>
                
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
                      {/* Event Creation */}
                      <tr className="bg-gray-50">
                        <td className="py-2 px-3 text-sm text-muted-foreground">
                          {selectedEvent.created_at ? new Date(selectedEvent.created_at).toLocaleString() : "Unknown"}
                        </td>
                        <td className="py-2 px-3 text-sm font-medium">
                          Event Created
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-xs">
                            Venue
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-sm">
                          Event "{selectedEvent.title}" was created
                        </td>
                      </tr>
                      
                      {/* Booking Activities */}
                      {(() => {
                        const { booking } = getMusicianApplicationStatus(selectedEvent.id);
                        if (!booking) return null;
                        
                        const activityRows = [];
                        
                        // Application
                        if (booking.applied_at) {
                          activityRows.push(
                            <tr key="applied" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.applied_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Applied to Event
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  Musician
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                Applied with rate: ${booking.proposed_rate || 'Not specified'}
                              </td>
                            </tr>
                          );
                        }
                        
                        // Selection
                        if (booking.selected_at) {
                          activityRows.push(
                            <tr key="selected" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.selected_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Selected by Venue
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  Venue
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                Venue selected this musician for the event
                              </td>
                            </tr>
                          );
                        }
                        
                        // Confirmation
                        if (booking.confirmed_at) {
                          activityRows.push(
                            <tr key="confirmed" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.confirmed_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Booking Confirmed
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  Musician
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                Musician confirmed the booking
                              </td>
                            </tr>
                          );
                        }
                        
                        // Cancel Request
                        if (booking.cancel_requested_at) {
                          const requestedBy = booking.cancel_requested_by_role === 'venue' ? 'Venue' : 'Musician';
                          activityRows.push(
                            <tr key="cancel_requested" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.cancel_requested_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Cancellation Requested
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  {requestedBy}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                {booking.cancellation_reason ? `Reason: ${booking.cancellation_reason}` : "No reason provided"}
                              </td>
                            </tr>
                          );
                        }
                        
                        // Cancellation Confirmation
                        if (booking.cancelled_at) {
                          const confirmedBy = booking.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'Musician';
                          activityRows.push(
                            <tr key="cancelled" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.cancelled_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Cancellation Confirmed
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  {confirmedBy}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                Booking was cancelled
                              </td>
                            </tr>
                          );
                        }
                        
                        // Completion
                        if (booking.completed_at) {
                          activityRows.push(
                            <tr key="completed" className={activityRows.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {new Date(booking.completed_at).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium">
                                Event Completed
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline" className="text-xs">
                                  {booking.completed_by_role ? (booking.completed_by_role === 'venue' ? 'Venue' : 'Musician') : "System"}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">
                                Event was marked as completed
                              </td>
                            </tr>
                          );
                        }
                        
                        return activityRows;
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleNotInterested}>
            <X className="h-4 w-4 mr-2" />
            Not Interested
          </Button>
          <Button variant="outline" onClick={handleMessageVenue}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Venue
          </Button>
          {(() => {
            const { status, booking } = getMusicianApplicationStatus(selectedEvent.id);
            if (status === "available" && !booking) {
              return (
                <Button onClick={handleApply}>
                  <Check className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              );
            }
            return null;
          })()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 