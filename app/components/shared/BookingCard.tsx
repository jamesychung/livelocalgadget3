import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, MapPin, DollarSign, Check, X, User, Edit, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../venue/dashboard/utils';
import { StatusDisplay } from './StatusDisplay';

interface BookingCardProps {
  booking: any;
  onStatusUpdate?: (updatedBooking: any) => void;
  onEventClick?: () => void;
  viewMode?: 'musician' | 'venue';
  variant?: 'confirmed' | 'pending' | 'selected' | 'application' | 'cancelled' | 'default';
  showStatusBadge?: boolean;
  showActions?: boolean;
  showPitch?: boolean;
  clickText?: string;
  className?: string;
  status?: string; // Optional status override for border color
  // Event management actions
  onEdit?: () => void;
  onViewApplications?: () => void;
  applicationCount?: number;
  pendingApplicationCount?: number;
}

// Function to get border color based on status (matching StatusBadge colors)
const getStatusBorderColor = (status: string): string => {
  const borderColors: Record<string, string> = {
    // Event statuses
    open: "border-l-green-500",
    invited: "border-l-purple-500", 
    application_received: "border-l-blue-500",
    selected: "border-l-orange-500",
    confirmed: "border-l-green-500",
    cancel_requested: "border-l-orange-500",
    cancelled: "border-l-red-500",
    completed: "border-l-blue-500",
    
    // Booking statuses
    applied: "border-l-blue-500",
    pending: "border-l-yellow-500",
    
    // Default
    default: "border-l-gray-500"
  };
  return borderColors[status?.toLowerCase()] || borderColors.default;
};

const VARIANT_STYLES = {
  confirmed: {
    background: "bg-green-50",
    avatar: "bg-green-100",
    avatarText: "text-green-600",
    nameText: "text-green-800",
    badge: "bg-green-100 text-green-800",
    badgeText: "Confirmed"
  },
  pending: {
    background: "bg-yellow-50",
    avatar: "bg-yellow-100",
    avatarText: "text-yellow-600",
    nameText: "text-yellow-800",
    badge: "bg-yellow-100 text-yellow-800",
    badgeText: "Pending"
  },
  selected: {
    background: "bg-orange-50", 
    avatar: "bg-orange-100",
    avatarText: "text-orange-600",
    nameText: "text-orange-800",
    badge: "bg-orange-100 text-orange-800",
    badgeText: "Selected"
  },
  application: {
    background: "bg-purple-50",
    avatar: "bg-purple-100", 
    avatarText: "text-purple-600",
    nameText: "text-purple-800",
    badge: "bg-purple-100 text-purple-800",
    badgeText: "Application"
  },
  cancelled: {
    background: "bg-red-50",
    avatar: "bg-red-100",
    avatarText: "text-red-600",
    nameText: "text-red-800",
    badge: "bg-red-100 text-red-800",
    badgeText: "Cancelled"
  },
  default: {
    background: "bg-white",
    avatar: "bg-gray-100",
    avatarText: "text-gray-600", 
    nameText: "text-gray-800",
    badge: "bg-gray-100 text-gray-800",
    badgeText: "Event"
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusUpdate,
  onEventClick,
  viewMode = 'musician',
  variant = 'default',
  showStatusBadge = true,
  showActions = true,
  showPitch = true,
  clickText = "Click for details",
  className = '',
  status,
  onEdit,
  onViewApplications,
  applicationCount = 0,
  pendingApplicationCount = 0
}) => {
  const handleConfirmBooking = async () => {
    if (!onStatusUpdate) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ confirmed_at: new Date().toISOString() })
        .eq('id', booking.id);

      if (error) throw error;

      onStatusUpdate({ ...booking, status: 'confirmed' });
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleRejectBooking = async () => {
    if (!onStatusUpdate) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ cancelled_at: new Date().toISOString() })
        .eq('id', booking.id);

      if (error) throw error;

      onStatusUpdate({ ...booking, status: 'cancelled' });
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const getStatusBadge = () => {
    return <StatusDisplay status={booking.status} variant="badge" />;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Determine which info to show based on view mode
  const otherParty = viewMode === 'musician' ? booking.event?.venue : booking.musician;
  const otherPartyName = viewMode === 'musician' ? booking.event?.venue?.name : booking.musician?.stage_name;
  const otherPartyImage = viewMode === 'musician' ? booking.event?.venue?.profile_picture : booking.musician?.profile_picture;

  const styles = VARIANT_STYLES[variant];
  
  // Use status-based border color if status is provided, otherwise use booking status
  const borderColor = getStatusBorderColor(status || booking.status || 'default');

  return (
    <Card className={`${borderColor} border-l-4 ${styles.background} hover:shadow-md transition-shadow ${onEventClick ? 'cursor-pointer' : ''} ${className}`}>
      <CardContent className="pt-6" onClick={onEventClick}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full ${styles.avatar} flex items-center justify-center overflow-hidden`}>
                {otherPartyImage ? (
                  <img 
                    src={otherPartyImage} 
                    alt={otherPartyName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`${styles.avatarText} font-semibold text-lg`}>
                    {otherPartyName?.charAt(0) || (viewMode === 'musician' ? 'V' : 'M')}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {booking.event?.title || "Event"}
                </div>
                <div className={`text-md font-medium ${styles.nameText}`}>
                  {viewMode === 'musician' ? `at ${otherPartyName || 'Venue'}` : otherPartyName || 'Musician'}
                </div>
              </div>
              {showStatusBadge && getStatusBadge()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {booking.event?.date ? formatDate(booking.event.date) : "Date TBD"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {booking.event?.start_time && booking.event?.end_time 
                    ? `${formatTime(booking.event.start_time)} - ${formatTime(booking.event.end_time)}`
                    : "Time TBD"
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  ${booking.proposed_rate || booking.event?.rate || booking.musician?.hourly_rate || 0}/hr
                </span>
              </div>
            </div>
            
            {showPitch && booking.musician_pitch && (
              <div className="mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {viewMode === 'musician' ? 'Your Pitch' : 'Musician\'s Pitch'}
                </div>
                <div className="text-sm bg-muted p-3 rounded-lg">
                  {booking.musician_pitch}
                </div>
              </div>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2 ml-4">
              {/* Event management actions */}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
              
              {onViewApplications && applicationCount > 0 && (
                <Button
                  variant={pendingApplicationCount > 0 ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewApplications();
                  }}
                  className={`flex items-center gap-1 ${pendingApplicationCount > 0 ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                >
                  <Users className="h-4 w-4" />
                  {pendingApplicationCount > 0 ? 'Review Applications' : 'View Applications'} ({pendingApplicationCount > 0 ? pendingApplicationCount : applicationCount})
                </Button>
              )}
              
              {/* Original booking status actions (for selected bookings) */}
              {booking.status === "selected" && onStatusUpdate && (
                <>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmBooking();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectBooking();
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        {clickText && onEventClick && (
          <div className="text-xs text-blue-600 mt-3 text-center">
            {clickText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 