import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription } from "../../ui/alert";
import { Calendar, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { OverviewTabProps } from './types';
import { useAuth } from '../../../lib/auth';
import { ImportantEventItem } from '../../shared/ImportantEventItem';
import { EventDialog } from '../../shared/EventDialog';

export const OverviewTab: React.FC<OverviewTabProps> = ({
  musician,
  upcomingEvents,
  allBookings = [],
  allEvents = []
}) => {
  const { user } = useAuth();

  // State for event dialog
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Calculate key metrics for highlighting
  const pendingApplications = upcomingEvents.filter(booking => booking.status === 'applied').length;
  const selectedBookings = upcomingEvents.filter(booking => booking.status === 'selected').length;
  const confirmedBookings = upcomingEvents.filter(booking => booking.status === 'confirmed').length;

  // Event handlers for important events
  const handleEventClick = (booking: any) => {
    setSelectedEvent(booking.event);
    setSelectedBooking(booking);
    setIsEventDialogOpen(true);
  };

  const handleOpenEventClick = (event: any) => {
    setSelectedEvent(event);
    setSelectedBooking(null);
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
  };

  // Get important events by status with their relevant timestamps
  const getImportantEventsByStatus = () => {
    // Open events (available for application)
    const openEvents = allEvents
      .filter(event => {
        // Check if musician hasn't applied to this event yet
        const hasApplied = allBookings.some(booking => booking.event?.id === event.id);
        return !hasApplied && event.status === 'open' && event.date && new Date(event.date) > new Date();
      })
      .map(event => ({
        event,
        booking: null,
        timestamp: new Date(event.created_at || event.date),
        displayText: `New event available: ${event.title}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Invited events (venue invited musician)
    const invitedEvents = allBookings
      .filter(booking => booking.status === 'invited' && booking.event)
      .map(booking => ({
        event: booking.event,
        booking,
        timestamp: new Date(booking.created_at), // Use booking creation as invite timestamp
        displayText: `Invited to perform at ${booking.event?.venue?.name}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Musician Selected events
    const selectedEvents = allBookings
      .filter(booking => booking.status === 'selected' && booking.event && booking.selected_at)
      .map(booking => ({
        event: booking.event,
        booking,
        timestamp: new Date(booking.selected_at!),
        displayText: `Selected by ${booking.event?.venue?.name} - Response needed`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Confirmed events
    const confirmedEvents = allBookings
      .filter(booking => booking.status === 'confirmed' && booking.event && booking.confirmed_at)
      .map(booking => ({
        event: booking.event,
        booking,
        timestamp: new Date(booking.confirmed_at!),
        displayText: `Performance confirmed at ${booking.event?.venue?.name}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Cancellation requests (venue requested cancellation)
    const cancellationEvents = allBookings
      .filter(booking => 
        booking.status === 'pending_cancel' && 
        booking.event && 
        booking.cancel_requested_at &&
        booking.cancel_requested_by_role === 'venue'
      )
      .map(booking => ({
        event: booking.event,
        booking,
        timestamp: new Date(booking.cancel_requested_at!),
        displayText: `Venue requested cancellation for ${booking.event?.title}`
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return { openEvents, invitedEvents, selectedEvents, confirmedEvents, cancellationEvents };
  };

  const { openEvents, invitedEvents, selectedEvents, confirmedEvents, cancellationEvents } = getImportantEventsByStatus();

      return (
      <div className="space-y-6">
        {/* Action Items Alert */}
        {(pendingApplications > 0 || selectedBookings > 0) && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>
                  You have {pendingApplications + selectedBookings} items needing attention
                </span>
                <div className="flex gap-2">
                  {selectedBookings > 0 && (
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Review {selectedBookings} Selection{selectedBookings > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

      {/* Explanatory Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm font-medium">
          Overview tab highlights important events with: Open Events, Invited Events, Musician Selected, Confirmed Events, and Cancellation Requests.
        </p>
      </div>

      {/* Important Events Sections */}
      {/* Cancellation Requests - Highest Priority */}
      {cancellationEvents.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-orange-800">
              <div className="flex items-center gap-2">
                <span>⚠️ Cancellation Requests</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {cancellationEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cancellationEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking?.id}-cancel`}
                  booking={item.booking}
                  status="cancel_requested"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Musician Selected - Action Required */}
      {selectedEvents.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-yellow-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
                <span>Musician Selected</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {selectedEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking?.id}-selected`}
                  booking={item.booking}
                  status="selected"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invited Events */}
      {invitedEvents.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-indigo-800">
              <div className="flex items-center gap-2">
                <span>📩 Invited Events</span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {invitedEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitedEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking?.id}-invited`}
                  booking={item.booking}
                  status="invited"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Open Events */}
      {openEvents.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-blue-800">
              <div className="flex items-center gap-2">
                <span>🎵 Open Events</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {openEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.event?.id}-open`}
                  booking={item.booking}
                  status="open"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleOpenEventClick(item.event)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmed Events */}
      {confirmedEvents.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-green-800">
              <div className="flex items-center gap-2">
                <span>✅ Confirmed Events</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {confirmedEvents.length} total
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedEvents.slice(0, 5).map((item, index) => (
                <ImportantEventItem 
                  key={`${item.booking?.id}-confirmed`}
                  booking={item.booking}
                  status="confirmed"
                  timestamp={item.timestamp}
                  displayText={item.displayText}
                  onEventClick={() => handleEventClick(item.booking)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Important Events Message */}
      {cancellationEvents.length === 0 && selectedEvents.length === 0 && invitedEvents.length === 0 && openEvents.length === 0 && confirmedEvents.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-6 text-center text-gray-500">
            <p>No important events to display at this time.</p>
          </CardContent>
        </Card>
      )}



      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Your booking activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pendingApplications}</div>
              <div className="text-sm text-blue-700">Pending Applications</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
              <div className="text-sm text-green-700">Confirmed Bookings</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{selectedBookings}</div>
              <div className="text-sm text-yellow-700">Awaiting Response</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={closeEventDialog}
        event={selectedEvent}
        booking={selectedBooking}
        bookings={selectedEvent ? allBookings.filter(booking => booking.event?.id === selectedEvent.id) : []}
        currentUser={{ musician: { id: musician.id } }}
        userRole="musician"
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