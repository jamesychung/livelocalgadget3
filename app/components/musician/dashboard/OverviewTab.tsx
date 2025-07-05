import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your next scheduled performances</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{booking.event?.title || "Untitled Event"}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.event?.venue?.name} • {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming bookings scheduled.</p>
          )}
        </CardContent>
      </Card>



      <RecentMessagesCard 
        messages={recentMessages} 
        unreadCount={unreadCount} 
      />
    </div>
  );
}; 