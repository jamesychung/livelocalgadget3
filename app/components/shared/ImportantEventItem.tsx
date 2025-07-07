import React from "react";
import { BookingCard } from "./BookingCard";

export interface ImportantEventItemProps {
  booking: any;
  status: 'open' | 'invited' | 'application_received' | 'selected' | 'confirmed' | 'cancel_requested';
  timestamp: Date;
  displayText: string;
  onEventClick: () => void;
}

export const ImportantEventItem: React.FC<ImportantEventItemProps> = ({ 
  booking, 
  status, 
  timestamp, 
  displayText, 
  onEventClick 
}) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Map status to BookingCard variant
  const getVariant = () => {
    switch (status) {
      case 'confirmed':
        return 'confirmed';
      case 'cancel_requested':
        return 'cancelled';
      case 'selected':
        return 'selected';
      case 'invited':
        return 'pending'; // Map invited to pending variant
      case 'open':
        return 'default'; // Map open to default variant
      default:
        return 'application';
    }
  };

  return (
    <BookingCard
      booking={booking}
      onEventClick={onEventClick}
      viewMode="venue"
      variant={getVariant()}
      showStatusBadge={true}
      showActions={false}
      showPitch={false}
      clickText={`${displayText} • ${formatTimestamp(timestamp)}`}
      status={status}
    />
  );
}; 