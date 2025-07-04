import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { OverviewTabProps, Booking, Event } from "./types";
import { formatDate } from "./utils";
import { StatusBadge } from "./StatusBadge";
import { Link } from "react-router-dom";

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  venue, 
  recentEvents, 
  pendingBookings,
  pendingCancelBookings 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex justify-between items-center">
            <span>Recent Events</span>
            <Link to="/venue-events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.slice(0, 5).map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No events yet</p>
              <Link to="/venue-events">
                <Button variant="outline" size="sm" className="mt-2">Create Event</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex justify-between items-center">
              <span>Pending Applications</span>
              <Link to="/venue-musicians">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingBookings.length > 0 ? (
              <div className="space-y-4">
                {pendingBookings.slice(0, 3).map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No pending applications</p>
            )}
          </CardContent>
        </Card>

        {pendingCancelBookings.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                <span>Pending Cancellations</span>
                <Link to="/venue-musicians">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCancelBookings.slice(0, 3).map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div>
        <h4 className="font-medium">{event.title}</h4>
        <div className="flex items-center text-sm text-gray-500">
          <span>{formatDate(event.date)}</span>
          <span className="mx-2">•</span>
          <StatusBadge status={event.status} />
        </div>
      </div>
      <Link to={`/venue-event/${event.id}`}>
        <Button variant="ghost" size="sm">View</Button>
      </Link>
    </div>
  );
};

const BookingItem: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {booking.musician?.profile_picture ? (
            <img 
              src={booking.musician.profile_picture} 
              alt={booking.musician.stage_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xs">
              {booking.musician?.stage_name?.charAt(0) || "M"}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-medium">{booking.musician?.stage_name}</h4>
          <div className="flex items-center text-xs text-gray-500">
            <span>{booking.event?.title || "Event"}</span>
            <span className="mx-1">•</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </div>
      <Link to={`/venue-musicians?booking=${booking.id}`}>
        <Button variant="ghost" size="sm">View</Button>
      </Link>
    </div>
  );
}; 