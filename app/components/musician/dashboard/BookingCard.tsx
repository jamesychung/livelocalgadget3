import React from 'react';
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, Clock, DollarSign, Eye } from "lucide-react";
import { BookingActionButtons } from '../../../components/shared/BookingActionButtons';
import { BookingCardProps } from './types';
import { getStatusBadge } from './utils';

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  user,
  handleBookingClick,
  handleBookingStatusUpdate
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{booking.event?.title || "Untitled Event"}</h3>
          <p className="text-sm text-muted-foreground">
            {booking.event?.venue?.name || "Unknown Venue"}
          </p>
        </div>
        <div className="text-right">
          {getStatusBadge(booking.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {booking.event?.start_time && booking.event?.end_time 
              ? `${booking.event.start_time} - ${booking.event.end_time}`
              : "Time TBD"
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            ${booking.proposed_rate || 0}/hr
          </span>
        </div>
      </div>
      
      {booking.musician_pitch && (
        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground mb-1">Your Pitch:</p>
          <p className="text-sm bg-muted p-2 rounded">{booking.musician_pitch}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <BookingActionButtons 
          booking={booking}
          currentUser={user}
          onStatusUpdate={handleBookingStatusUpdate}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleBookingClick(booking)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
      
      {booking.status === "confirmed" && (
        <div className="mt-3">
          <Badge variant="default" className="bg-green-100 text-green-800">
            ✅ Booking Confirmed
          </Badge>
        </div>
      )}
    </div>
  );
}; 