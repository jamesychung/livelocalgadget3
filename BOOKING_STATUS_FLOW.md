# Booking Status Flow Documentation

This document defines the complete booking status flow for the Live Local Gadget platform, including the main booking process and cancellation flows.

## Main Booking Flow

### 1. Event Creation → Application → Selection → Confirmation → Completion

```
draft → open → application_received → selected → confirmed → completed
```

#### Status Definitions

| Status | Description | Who Can Set | Next Possible Status |
|--------|-------------|-------------|---------------------|
| `draft` | Event created but not published | Venue | `open` |
| `open` | Event published, accepting applications | Venue | `application_received` |
| `application_received` | Musician(s) have applied | System (auto) | `selected` |
| `selected` | Venue has selected a musician | Venue | `confirmed`, `open` (if declined) |
| `confirmed` | Musician has confirmed the selection | Musician | `completed`, `cancel_requested` |
| `completed` | Event has been completed | Either party | Final status |

#### Flow Steps

1. **Venue Creates Event**
   - Status: `draft`
   - Venue can edit all details
   - Not visible to musicians

2. **Venue Publishes Event**
   - Status: `open`
   - Visible to musicians
   - Musicians can apply

3. **Musicians Apply**
   - Status: `application_received` (auto-set when first application received)
   - Multiple musicians can apply
   - Venue can review applications

4. **Venue Selects Musician**
   - Status: `selected`
   - Venue chooses one musician from applications
   - Selected musician is notified
   - Other applicants are notified of rejection

5. **Musician Confirms Selection**
   - Status: `confirmed`
   - Musician accepts the booking
   - Event is now "booked"
   - If musician declines, status returns to `open`

6. **Event Completion**
   - Status: `completed`
   - Either party can mark as complete after event date
   - Final status - no further changes allowed

## Cancellation Flow

### Rule Summary
- **Before Confirmation**: Venue can cancel freely (no musician has committed)
- **After Confirmation**: Either party can request cancellation, other party must confirm

### Pre-Confirmation Cancellation
```
draft/open/application_received/selected → cancelled
```

- **Who**: Venue only
- **When**: Before any musician has confirmed
- **Process**: Direct cancellation, no approval needed
- **Reason**: No musician has committed to the event yet

### Post-Confirmation Cancellation
```
confirmed → cancel_requested → cancelled
```

#### Cancellation Request Process

1. **Cancel Request Initiated**
   - Status: `cancel_requested`
   - Either venue or musician can initiate
   - Requesting party provides reason
   - Other party is notified

2. **Cancel Request Response**
   - **If Approved**: Status becomes `cancelled`
   - **If Rejected**: Status returns to `confirmed`
   - **If No Response**: Configurable timeout (e.g., 48 hours)

#### Cancellation Fields

| Field | Description | Set When |
|-------|-------------|----------|
| `cancel_requested_at` | Timestamp of cancel request | Request initiated |
| `cancel_requested_by` | Who requested cancellation ('venue' or 'musician') | Request initiated |
| `cancel_confirmed_at` | Timestamp of cancel confirmation | Request approved |
| `cancel_confirmed_by` | Who confirmed cancellation | Request approved |
| `cancellation_reason` | Reason for cancellation | Request initiated |

## Status Transitions Matrix

| From Status | To Status | Triggered By | Conditions |
|-------------|-----------|--------------|------------|
| `draft` | `open` | Venue | Event details complete |
| `open` | `application_received` | System | First musician applies |
| `application_received` | `selected` | Venue | Venue selects musician |
| `selected` | `confirmed` | Musician | Musician accepts selection |
| `selected` | `open` | Musician | Musician declines selection |
| `confirmed` | `completed` | Either | Event date passed |
| `confirmed` | `cancel_requested` | Either | Cancellation requested |
| `cancel_requested` | `cancelled` | Other party | Cancel request approved |
| `cancel_requested` | `confirmed` | Other party | Cancel request rejected |
| Any pre-confirmation | `cancelled` | Venue | Direct cancellation |

## Database Schema Requirements

### Events Table
```sql
events (
  id,
  title,
  description,
  date,
  start_time,
  end_time,
  venue_id,
  status VARCHAR -- draft, open, application_received, selected, confirmed, completed, cancelled, cancel_requested
  created_at,
  updated_at
)
```

### Bookings Table
```sql
bookings (
  id,
  event_id,
  musician_id,
  venue_id,
  status VARCHAR, -- applied, selected, confirmed, completed, cancelled, cancel_requested
  created_at,
  updated_at,
  applied_at,
  selected_at,
  confirmed_at,
  completed_at,
  cancelled_at,
  cancel_requested_at,
  cancel_requested_by VARCHAR, -- 'venue' or 'musician'
  cancel_confirmed_at,
  cancel_confirmed_by VARCHAR, -- 'venue' or 'musician'
  cancellation_reason TEXT,
  proposed_rate,
  musician_pitch
)
```

## UI Status Display

### Status Badges
- `draft`: Gray badge "Draft"
- `open`: Blue badge "Open"
- `application_received`: Orange badge "Applications Received"
- `selected`: Purple badge "Musician Selected"
- `confirmed`: Green badge "Confirmed"
- `completed`: Gray badge "Completed"
- `cancelled`: Red badge "Cancelled"
- `cancel_requested`: Yellow badge "Cancellation Requested"

### Action Buttons by Status

#### For Venues
- `draft`: "Publish Event"
- `open`: "View Applications" (if any)
- `application_received`: "Select Musician"
- `selected`: "Waiting for Confirmation"
- `confirmed`: "Request Cancellation", "Mark Complete"
- `cancel_requested`: "Approve/Reject Cancellation"

#### For Musicians
- `open`: "Apply"
- `selected`: "Accept/Decline Booking"
- `confirmed`: "Request Cancellation", "Mark Complete"
- `cancel_requested`: "Approve/Reject Cancellation"

## Business Rules

### Timing Rules
1. Events cannot be marked `completed` before the event date
2. Cancellation requests should have a response deadline (e.g., 48 hours)
3. Events automatically become `completed` X days after event date if not manually completed

### Notification Rules
1. Venue notified when musician applies (`application_received`)
2. Musician notified when selected (`selected`)
3. Both parties notified when booking confirmed (`confirmed`)
4. Both parties notified of cancellation requests
5. Both parties notified of cancellation approval/rejection

### Data Integrity Rules
1. Only one booking per event can be `confirmed`
2. Cannot have multiple `selected` bookings for same event
3. Timestamp fields must be set when status changes
4. `cancel_requested_by` must be set when status is `cancel_requested`

## Error Handling

### Invalid Status Transitions
- Throw error if invalid status transition attempted
- Log all status change attempts for audit trail

### Concurrent Modifications
- Use optimistic locking to prevent race conditions
- Handle case where multiple musicians try to confirm simultaneously

## Testing Scenarios

### Happy Path
1. Create event → publish → musician applies → venue selects → musician confirms → event completes

### Cancellation Scenarios
1. Pre-confirmation: Venue cancels directly
2. Post-confirmation: Venue requests cancel → musician approves
3. Post-confirmation: Musician requests cancel → venue approves
4. Post-confirmation: Cancel request rejected

### Edge Cases
1. Musician declines selection
2. Multiple musicians apply simultaneously
3. Venue tries to select after musician already confirmed different booking
4. Cancellation request timeout handling

---

## Implementation Notes

- Use database triggers to automatically set timestamp fields
- Implement status validation at application level
- Create audit log for all status changes
- Use enum types for status fields to prevent invalid values
- Consider using state machine pattern for complex status logic

This document should be referenced whenever implementing booking-related features to ensure consistency across the platform. 