import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription } from "../../ui/alert";
import { Calendar, MapPin, MessageSquare, AlertCircle, CheckCircle, Users } from "lucide-react";
import { OverviewTabProps } from './types';
import { getStatusBadge } from './utils';
import { RecentMessagesCard } from './RecentMessagesCard';
import { useMessaging } from '../../../hooks/useMessaging';
import { useAuth } from '../../../lib/auth';

export const OverviewTab: React.FC<OverviewTabProps> = ({
  musician,
  upcomingEvents
}) => {
  const { user } = useAuth();
  const { getRecentMessages, getTotalUnreadCount } = useMessaging(user);

  // Get recent messages for this musician
  const recentMessages = getRecentMessages(3);
  const unreadCount = getTotalUnreadCount();

  // Calculate key metrics for highlighting
  const pendingApplications = upcomingEvents.filter(booking => booking.status === 'applied').length;
  const selectedBookings = upcomingEvents.filter(booking => booking.status === 'selected').length;
  const confirmedBookings = upcomingEvents.filter(booking => booking.status === 'confirmed').length;
  const thisWeekEvents = upcomingEvents.filter(booking => {
    if (!booking.event?.date) return false;
    const eventDate = new Date(booking.event.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= nextWeek;
  }).length;

  return (
    <div className="space-y-6">
      {/* Action Items Alert */}
      {(pendingApplications > 0 || selectedBookings > 0 || unreadCount > 0) && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>
                You have {pendingApplications + selectedBookings + unreadCount} items needing attention
              </span>
              <div className="flex gap-2">
                {selectedBookings > 0 && (
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Review {selectedBookings} Selection{selectedBookings > 1 ? 's' : ''}
                  </Button>
                )}
                {unreadCount > 0 && (
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enhanced Upcoming Bookings */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Upcoming Bookings
                  {thisWeekEvents > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      {thisWeekEvents} this week
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Your next scheduled performances</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex justify-between items-start p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{booking.event?.title || "Untitled Event"}</p>
                        {booking.status === 'selected' && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.event?.venue?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(booking.status)}
                      {booking.proposed_rate && (
                        <span className="text-sm font-medium text-green-600">
                          ${booking.proposed_rate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {upcomingEvents.length > 3 && (
                  <Button variant="outline" className="w-full mt-3">
                    View All {upcomingEvents.length} Bookings
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-muted-foreground mb-3">No upcoming bookings scheduled.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Users className="h-4 w-4 mr-2" />
                  Find Events to Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Messages */}
        <RecentMessagesCard 
          messages={recentMessages} 
          unreadCount={unreadCount} 
        />
      </div>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Your booking activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{thisWeekEvents}</div>
              <div className="text-sm text-purple-700">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 