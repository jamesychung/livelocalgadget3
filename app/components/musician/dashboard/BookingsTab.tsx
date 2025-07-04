import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
import { Calendar } from "lucide-react";
import { BookingsTabProps } from './types';
import { BookingCard } from './BookingCard';

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  user,
  handleBookingClick,
  handleBookingStatusUpdate
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>Manage your performance schedule and confirm bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking.id}
                booking={booking}
                user={user}
                handleBookingClick={handleBookingClick}
                handleBookingStatusUpdate={handleBookingStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Bookings Yet</h3>
            <p className="text-muted-foreground mt-2">
              You don't have any bookings yet. Apply to events to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 