import React from 'react';
import { Badge } from '../ui/badge';
import { 
  getBookingStatusDisplay, 
  BookingStatus,
  BOOKING_STATUSES 
} from '../../lib/utils';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  booking?: any;
  className?: string;
  showIcon?: boolean;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  booking,
  className = '',
  showIcon = true
}) => {
  const statusInfo = getBookingStatusDisplay(status, booking);
  
  return (
    <Badge 
      variant={statusInfo.variant}
      className={`${statusInfo.className} ${className}`}
    >
      {showIcon && <span className="mr-1">{statusInfo.icon}</span>}
      {statusInfo.label}
    </Badge>
  );
};

// Convenience components for specific statuses
export const AppliedBadge: React.FC<{ booking?: any; className?: string }> = ({ booking, className }) => (
  <BookingStatusBadge status={BOOKING_STATUSES.APPLIED} booking={booking} className={className} />
);

export const BookedBadge: React.FC<{ booking?: any; className?: string }> = ({ booking, className }) => (
  <BookingStatusBadge status={BOOKING_STATUSES.BOOKED} booking={booking} className={className} />
);

export const ConfirmedBadge: React.FC<{ booking?: any; className?: string }> = ({ booking, className }) => (
  <BookingStatusBadge status={BOOKING_STATUSES.CONFIRMED} booking={booking} className={className} />
);

export const CancelledBadge: React.FC<{ booking?: any; className?: string }> = ({ booking, className }) => (
  <BookingStatusBadge status={BOOKING_STATUSES.CANCELLED} booking={booking} className={className} />
);

export const CompletedBadge: React.FC<{ booking?: any; className?: string }> = ({ booking, className }) => (
  <BookingStatusBadge status={BOOKING_STATUSES.COMPLETED} booking={booking} className={className} />
); 