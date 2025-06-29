# Status System for Venue Events and Bookings

## Overview

This document explains the status management system for venue events and musician bookings in the LiveLocal platform, including the comprehensive event history logging system.

## Current Architecture

### Booking Status (Primary Status Management)
The **Booking model** is the primary place where status is managed. Each booking represents a musician's application to perform at a venue event.

#### Booking Status Values:
- `applied` - Musician has applied to the event
- `communicating` - Venue and musician are in discussion
- `confirmed` - Musician is booked for the event
- `rejected` - Musician was not selected
- `invited` - Venue invited musician to apply
- `pending` - Awaiting response
- `open` - Application is open
- `cancelled` - Booking was cancelled

### Event Status (Secondary Status)
The **Event model** has a status field that represents the overall event state, but this is secondary to booking statuses.

#### Event Status Values:
- `open` - Event is accepting applications
- `confirmed` - Event has confirmed musician(s)
- `cancelled` - Event was cancelled
- `completed` - Event has finished

## Event History System (NEW)

### EventHistory Model
A new **EventHistory model** provides comprehensive audit trails for all event-related activities:

#### EventHistory Fields:
- `event` - Link to the event
- `booking` - Link to the booking (optional)
- `changedBy` - User who made the change
- `changeType` - Type of change (booking_status, event_status, etc.)
- `previousValue` - Previous value
- `newValue` - New value
- `description` - Human-readable description
- `context` - Additional context data (JSON)
- `metadata` - IP address, user agent, etc. (JSON)
- `createdAt` - Timestamp of the change

#### Change Types Tracked:
- `booking_status` - Booking status changes
- `event_status` - Event status changes
- `event_created` - Event creation
- `booking_created` - Booking creation
- `event_title` - Event title changes
- `event_description` - Event description changes
- `event_date` - Event date changes
- `event_ticketPrice` - Ticket price changes

## Why Booking Status is Primary

1. **Granular Control**: Each musician's application can be tracked individually
2. **Multiple Applications**: Multiple musicians can apply to the same event
3. **Clear Workflow**: Each application follows a clear progression
4. **Email Notifications**: Status changes trigger appropriate emails
5. **Already Implemented**: The system is working and tested
6. **Complete Audit Trail**: Every change is logged with timestamps

## Status Workflow

### For Musicians Applying:
1. **applied** → Musician submits application
2. **communicating** → Venue starts discussion (optional)
3. **confirmed** → Venue selects musician
4. **rejected** → Venue declines application

### For Venues Managing Applications:
1. View all `applied` bookings
2. Click "Communicate" to move to `communicating` status
3. Click "Confirm" to move to `confirmed` status
4. Click "Reject" to move to `rejected` status

## Recent Implementation

### Added Functionality:
- **Communicate Button**: For `applied` bookings, venues can click "Communicate" to move the booking to `communicating` status
- **Status-Specific Actions**: Different action buttons appear based on booking status
- **Automatic Dialog**: Clicking "Communicate" opens the messaging dialog
- **Event History Logging**: All changes are automatically logged with timestamps
- **Event History Viewer**: Complete timeline view of all event activities

### Code Changes:
1. **`handleCommunicateBooking()`** function in `web/routes/_app.venue-event.$eventId.tsx`
2. **"Communicate" button** for `applied` status bookings
3. **Action buttons** for `communicating` status bookings (Confirm/Reject)
4. **Status badge** already supported `communicating` status
5. **EventHistory model** with comprehensive audit fields
6. **EventHistoryViewer component** for timeline display
7. **Automatic logging** in booking and event update actions

## Email Notifications

The booking update action (`api/models/booking/actions/update.ts`) automatically sends emails when status changes to:
- `confirmed` - Congratulatory email to musician
- `rejected` - Polite rejection email to musician

## Event History Features

### Automatic Logging
- **Booking Status Changes**: Automatically logged when booking status changes
- **Event Changes**: Automatically logged when event details are modified
- **User Tracking**: Records who made each change
- **Timestamp Tracking**: Exact date and time of each change
- **Context Preservation**: Stores relevant context data

### History Viewer Features
- **Timeline Display**: Chronological view of all changes
- **Search & Filter**: Find specific changes or filter by type
- **Status Transitions**: Visual display of status changes
- **User Attribution**: Shows who made each change
- **Detailed Context**: Full context for each change
- **Date Grouping**: Changes grouped by date for easy reading

### Example History Entry
```json
{
  "id": "history-123",
  "createdAt": "2024-01-15T14:30:00Z",
  "changeType": "booking_status",
  "previousValue": "applied",
  "newValue": "communicating",
  "description": "Booking status changed from \"applied\" to \"communicating\"",
  "context": {
    "bookingId": "booking-456",
    "musicianId": "musician-789",
    "venueId": "venue-101",
    "eventId": "event-202",
    "changeReason": "venue_action"
  },
  "metadata": {
    "sessionId": "session-303",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  },
  "changedBy": {
    "id": "user-404",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Future Enhancements

### Potential Improvements:
1. **Event Status Derivation**: Automatically update event status based on booking statuses
2. **Status History**: Track status change history (already implemented)
3. **Bulk Actions**: Allow venues to manage multiple bookings at once
4. **Status Transitions**: Add validation for allowed status transitions
5. **Communication Tracking**: Store actual messages in the system
6. **Export History**: Allow venues to export event history as CSV/PDF
7. **Notification History**: Track all emails sent and their delivery status

### Example Event Status Logic:
```javascript
const getEventStatus = (bookings) => {
  if (bookings.some(b => b.status === 'confirmed')) {
    return 'confirmed';
  } else if (bookings.some(b => b.status === 'communicating')) {
    return 'in_progress';
  } else if (bookings.some(b => b.status === 'applied')) {
    return 'pending';
  } else {
    return 'open';
  }
};
```

## Best Practices

1. **Always update booking status** when taking actions
2. **Use the existing email system** for notifications
3. **Keep status values consistent** across the application
4. **Validate status transitions** to prevent invalid states
5. **Provide clear user feedback** when status changes
6. **Log all changes** for audit trail purposes
7. **Include context** in history entries for better debugging
8. **Track user attribution** for accountability

## Conflict Prevention

The hybrid approach prevents conflicts by:

1. **Clear Separation**: Booking status tracks individual applications, event status tracks overall state
2. **Automatic Logging**: Every change is logged with full context
3. **User Attribution**: Always know who made what change and when
4. **Context Preservation**: Full context stored for each change
5. **Timeline View**: Complete progression visible in history viewer
6. **Search Capability**: Easy to find specific changes or patterns

## Conclusion

The current booking-based status system with comprehensive event history logging provides:
- **Granular control** over individual musician applications
- **Complete audit trails** for all changes
- **Clear progression tracking** with timestamps
- **User attribution** for accountability
- **Search and filter capabilities** for easy research
- **No conflicts** between booking and event statuses

This system allows venues and support teams to easily research and understand the exact progression of any event, with full visibility into who did what and when. 