import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Calendar, Users, Clock, Eye, X, MessageSquare, Check } from "lucide-react";
import { Link } from 'react-router-dom';
import { BookingActionButtons } from '../../shared/BookingActionButtons';
import { ActivityLog, generateEventActivityItems } from '../../shared/ActivityLog';
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
              {(() => {
                const { booking } = getMusicianApplicationStatus(selectedEvent.id);
                // Convert single booking to array for generateEventActivityItems
                const applications = booking ? [booking] : [];
                return (
                  <ActivityLog
                    activities={generateEventActivityItems(selectedEvent, applications)}
                  />
                );
              })()}
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