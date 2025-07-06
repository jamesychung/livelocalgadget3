import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Calendar, Mail, Users, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Booking Status Management
export const BOOKING_STATUSES = {
  APPLIED: 'applied',
  SELECTED: 'selected', 
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PENDING_CANCEL: 'pending_cancel',
} as const;

export type BookingStatus = typeof BOOKING_STATUSES[keyof typeof BOOKING_STATUSES];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BOOKING_STATUSES.APPLIED]: 'Application Submitted',
  [BOOKING_STATUSES.SELECTED]: 'Venue Selected You - Please Confirm',
  [BOOKING_STATUSES.CONFIRMED]: 'Booking Confirmed',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled',
  [BOOKING_STATUSES.COMPLETED]: 'Event Completed',
  [BOOKING_STATUSES.PENDING_CANCEL]: 'Cancel Requested - Awaiting Confirmation',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  [BOOKING_STATUSES.APPLIED]: 'bg-blue-100 text-blue-800',
  [BOOKING_STATUSES.SELECTED]: 'bg-yellow-100 text-yellow-800',
  [BOOKING_STATUSES.CONFIRMED]: 'bg-green-100 text-green-800',
  [BOOKING_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
  [BOOKING_STATUSES.COMPLETED]: 'bg-gray-100 text-gray-800',
  [BOOKING_STATUSES.PENDING_CANCEL]: 'bg-orange-100 text-orange-800',
};

export const BOOKING_STATUS_ICONS: Record<BookingStatus, string> = {
  [BOOKING_STATUSES.APPLIED]: '📝',
  [BOOKING_STATUSES.SELECTED]: '⭐',
  [BOOKING_STATUSES.CONFIRMED]: '✅',
  [BOOKING_STATUSES.CANCELLED]: '❌',
  [BOOKING_STATUSES.COMPLETED]: '🎉',
  [BOOKING_STATUSES.PENDING_CANCEL]: '⏳',
};

// Booking Status Transitions
export const ALLOWED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BOOKING_STATUSES.APPLIED]: [BOOKING_STATUSES.SELECTED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.PENDING_CANCEL],
  [BOOKING_STATUSES.SELECTED]: [BOOKING_STATUSES.CONFIRMED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.PENDING_CANCEL],
  [BOOKING_STATUSES.CONFIRMED]: [BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.PENDING_CANCEL],
  [BOOKING_STATUSES.PENDING_CANCEL]: [BOOKING_STATUSES.CANCELLED],
  [BOOKING_STATUSES.CANCELLED]: [], // Terminal state
  [BOOKING_STATUSES.COMPLETED]: [] // Terminal state
};

// Helper function to check if a status transition is allowed
export const canTransitionTo = (currentStatus: BookingStatus, newStatus: BookingStatus): boolean => {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
};

// Helper function to get next possible statuses
export const getNextPossibleStatuses = (currentStatus: BookingStatus): BookingStatus[] => {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus];
};

// Cancellation tracking helpers
export const CANCELLATION_REASONS = {
  SCHEDULE_CONFLICT: 'schedule_conflict',
  VENUE_CHANGED_MIND: 'venue_changed_mind',
  MUSICIAN_CHANGED_MIND: 'musician_changed_mind',
  EVENT_CANCELLED: 'event_cancelled',
  PRICING_ISSUE: 'pricing_issue',
  OTHER: 'other'
} as const;

export type CancellationReason = typeof CANCELLATION_REASONS[keyof typeof CANCELLATION_REASONS];

export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  [CANCELLATION_REASONS.SCHEDULE_CONFLICT]: 'Schedule Conflict',
  [CANCELLATION_REASONS.VENUE_CHANGED_MIND]: 'Venue Changed Mind',
  [CANCELLATION_REASONS.MUSICIAN_CHANGED_MIND]: 'Musician Changed Mind',
  [CANCELLATION_REASONS.EVENT_CANCELLED]: 'Event Cancelled',
  [CANCELLATION_REASONS.PRICING_ISSUE]: 'Pricing Issue',
  [CANCELLATION_REASONS.OTHER]: 'Other'
};

// Helper function to format cancellation info
export const formatCancellationInfo = (booking: any): string => {
  if (booking.status !== BOOKING_STATUSES.CANCELLED) return '';
  
  const cancelledBy = booking.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'Musician';
  const reason = booking.cancellation_reason 
    ? CANCELLATION_REASON_LABELS[booking.cancellation_reason as CancellationReason] || booking.cancellation_reason
    : 'No reason provided';
  
  return `Cancelled by ${cancelledBy} - ${reason}`;
};

// Helper function to get booking status display info
export const getBookingStatusDisplay = (status: BookingStatus, booking?: any) => {
  const baseInfo = {
    label: BOOKING_STATUS_LABELS[status],
    variant: 'default' as const,
    className: BOOKING_STATUS_COLORS[status],
    icon: BOOKING_STATUS_ICONS[status]
  };

  // Special handling for cancelled status
  if (status === BOOKING_STATUSES.CANCELLED && booking) {
    const cancellationInfo = formatCancellationInfo(booking);
    return {
      ...baseInfo,
      label: cancellationInfo || baseInfo.label,
      variant: 'secondary' as const
    };
  }

  return baseInfo;
};

/**
 * Derive event status from booking states
 * Based on venue events tab logic - priority order determines final status
 */
export const deriveEventStatusFromBookings = (
  event: any, 
  bookings: any[]
): string => {
  const eventBookings = bookings.filter(booking => booking.event?.id === event.id);
  
  const completedBookings = eventBookings.filter(booking => booking.status === 'completed');
  const cancelledBookings = eventBookings.filter(booking => booking.status === 'cancelled');
  const cancelRequestedBookings = eventBookings.filter(booking => booking.status === 'pending_cancel');
  const confirmedBookings = eventBookings.filter(booking => booking.status === 'confirmed');
  const selectedBookings = eventBookings.filter(booking => booking.status === 'selected');
  const appliedBookings = eventBookings.filter(booking => booking.status === 'applied');
  
  // Determine event status based on booking states (priority order)
  let eventStatus = event.eventStatus || 'open';
  if (completedBookings.length > 0) {
    eventStatus = 'completed';
  } else if (cancelledBookings.length > 0 && confirmedBookings.length === 0) {
    eventStatus = 'cancelled';
  } else if (cancelRequestedBookings.length > 0) {
    eventStatus = 'cancel_requested';
  } else if (confirmedBookings.length > 0) {
    eventStatus = 'confirmed';
  } else if (selectedBookings.length > 0) {
    eventStatus = 'selected';
  } else if (appliedBookings.length > 0) {
    eventStatus = 'application_received';
  } else if (event.eventStatus === 'invited') {
    eventStatus = 'invited';
  }
  
  return eventStatus;
};

// Unified status configuration - single source of truth for all status displays
export const STATUS_CONFIG: Record<string, {
  label: string;
  icon: any; // Lucide icon component
  colors: {
    background: string;
    badge: string;
    calendar: string;
    legend: string; // For legend icon backgrounds
    iconColor: string; // For legend icon colors
  };
}> = {
  'completed': {
    label: 'Completed',
    icon: CheckCircle,
    colors: {
      background: 'bg-cyan-100 text-cyan-800',
      badge: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
      calendar: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border border-cyan-200',
      legend: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    }
  },
  'cancelled': {
    label: 'Cancelled',
    icon: XCircle,
    colors: {
      background: 'bg-red-100 text-red-800',
      badge: 'bg-red-100 text-red-800 hover:bg-red-200',
      calendar: 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200',
      legend: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  },
  'cancel_requested': {
    label: 'Cancel Requested',
    icon: AlertCircle,
    colors: {
      background: 'bg-orange-100 text-orange-800',
      badge: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      calendar: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200',
      legend: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  },
  'confirmed': {
    label: 'Musician Confirmed',
    icon: CheckCircle,
    colors: {
      background: 'bg-green-100 text-green-800',
      badge: 'bg-green-100 text-green-800 hover:bg-green-200',
      calendar: 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200',
      legend: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  },
  'selected': {
    label: 'Musician Selected',
    icon: CheckCircle,
    colors: {
      background: 'bg-yellow-100 text-yellow-800',
      badge: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      calendar: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200',
      legend: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  },
  'application_received': {
    label: 'Application Received',
    icon: Users,
    colors: {
      background: 'bg-purple-100 text-purple-800',
      badge: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      calendar: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200',
      legend: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  },
  'applied': {
    label: 'Application Received',
    icon: Users,
    colors: {
      background: 'bg-purple-100 text-purple-800',
      badge: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      calendar: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200',
      legend: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  },
  'invited': {
    label: 'Invited Event',
    icon: Mail,
    colors: {
      background: 'bg-indigo-100 text-indigo-800',
      badge: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      calendar: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200',
      legend: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  },
  'open': {
    label: 'Open Event',
    icon: Calendar,
    colors: {
      background: 'bg-blue-100 text-blue-800',
      badge: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      calendar: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200',
      legend: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  },
  'available': {
    label: 'Open Event',
    icon: Calendar,
    colors: {
      background: 'bg-blue-100 text-blue-800',
      badge: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      calendar: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200',
      legend: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  }
};

// Updated utility functions to use STATUS_CONFIG
export const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status] || {
    label: status,
    icon: AlertCircle,
    colors: {
      background: 'bg-gray-100 text-gray-800',
      badge: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      calendar: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200',
      legend: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  };
};

// Legacy functions updated to use STATUS_CONFIG
export const getStatusColorClasses = (status: string, variant: 'background' | 'badge' | 'calendar' = 'background') => {
  const config = getStatusConfig(status);
  return config.colors[variant];
};

export const getStatusLabel = (status: string): string => {
  const config = getStatusConfig(status);
  return config.label;
};

export const getStatusIcon = (status: string) => {
  const config = getStatusConfig(status);
  return config.icon;
};