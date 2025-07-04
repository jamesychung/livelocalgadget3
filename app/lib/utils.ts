import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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