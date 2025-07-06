# Event Components Documentation

## Overview

This document serves as the definitive guide to all unified event components throughout the LiveLocalGadget application. These components have been carefully designed to eliminate duplication and ensure consistency across venue and musician dashboards.

**⚠️ IMPORTANT**: Always use these unified components instead of creating new ones. If you need additional functionality, enhance these existing components rather than duplicating them.

---

## 🎯 Core Status System

### STATUS_CONFIG (`app/lib/utils.ts`)
**Single source of truth for all status displays**

```typescript
// Import the unified status system
import { 
  STATUS_CONFIG, 
  getStatusConfig, 
  getStatusColorClasses, 
  getStatusLabel, 
  getStatusIcon,
  deriveEventStatusFromBookings 
} from "../../lib/utils";
```

**Available Status Types:**
- `completed` - Cyan (CheckCircle)
- `cancelled` - Red (XCircle)  
- `cancel_requested` - Orange (AlertCircle)
- `confirmed` - Green (CheckCircle)
- `selected` - Yellow (CheckCircle)
- `application_received` - Purple (Users)
- `invited` - Indigo (Mail)
- `open` - Blue (Calendar)

**Color Variants:**
- `background` - Basic background colors
- `badge` - Interactive badge colors with hover
- `calendar` - Calendar event colors with borders
- `legend` - Legend icon backgrounds
- `iconColor` - Legend icon colors

---

## 🔧 Core Utility Functions

### Event Status Derivation
```typescript
// Always use this to get the correct event status
const eventStatus = deriveEventStatusFromBookings(event, bookings);
```

### Status Display Helpers
```typescript
// Get complete status configuration
const statusConfig = getStatusConfig(status);

// Get specific color classes
const colorClasses = getStatusColorClasses(status, 'badge');

// Get display label
const label = getStatusLabel(status);

// Get icon component
const IconComponent = getStatusIcon(status);
```

---

## 🎨 Display Components

### 1. StatusDisplay (`app/components/shared/StatusDisplay.tsx`)
**Unified status badge component - USE THIS FOR ALL STATUS DISPLAYS**

```typescript
import { StatusDisplay } from "../../shared/StatusDisplay";

// Basic usage
<StatusDisplay status="confirmed" />

// With variants
<StatusDisplay status="confirmed" variant="badge" />
<StatusDisplay status="confirmed" variant="inline" />
<StatusDisplay status="confirmed" variant="legend" />
<StatusDisplay status="confirmed" variant="button" />
<StatusDisplay status="confirmed" variant="compact" />

// With customization
<StatusDisplay 
  status="confirmed" 
  variant="badge"
  showIcon={true}
  showLabel={true}
  className="custom-class"
/>
```

**Variants:**
- `badge` - Standard badge (default)
- `inline` - Inline text with icon
- `legend` - For status legends
- `button` - Prominent button-style
- `compact` - Small calendar format

### 2. EventStatusLegend (`app/components/shared/EventStatusLegend.tsx`)
**Unified status legend for all dashboards**

```typescript
import { EventStatusLegend } from "../../shared/EventStatusLegend";

// Venue dashboard usage
<EventStatusLegend events={events} />

// Musician dashboard usage (hides completed/cancelled)
<EventStatusLegend events={events} hideCompletedStatuses={true} />
```

**Features:**
- Automatic status counting from events
- Dynamic layout (3 or 4 columns)
- Consistent colors and icons
- Responsive design

---

## 🎭 Dialog Components

### 1. EventDialog (`app/components/shared/EventDialog.tsx`)
**THE UNIFIED DIALOG - Use this for ALL event dialogs**

```typescript
import { EventDialog } from "../../shared/EventDialog";

// Venue usage - Applications view
<EventDialog
  isOpen={isOpen}
  onClose={onClose}
  event={event}
  bookings={bookings}
  onAcceptApplication={handleAccept}
  onRejectApplication={handleReject}
  currentUser={{ venue: { id: venueId } }}
  userRole="venue"
  showApplicationsList={true}
/>

// Musician usage - Booking view
<EventDialog
  isOpen={isOpen}
  onClose={onClose}
  event={event}
  bookings={bookings}
  currentUser={{ musician: { id: musicianId } }}
  userRole="musician"
  showBookingActions={true}
/>

// Compatibility with old dialog props
<EventDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  selectedEvent={event}
  getEventApplications={() => bookings}
  // ... other props
/>
```

**Props:**
- `userRole`: "venue" | "musician"
- `showApplicationsList`: Show applications list (venues)
- `showBookingActions`: Show booking actions (musicians)
- `event`: Event data
- `bookings`: Related bookings
- `currentUser`: User context

**Replaces:**
- ❌ ApplicationDetailDialog
- ❌ BookingDetailDialog
- ❌ EventBookingDialog (legacy)

---

## 🎴 Card Components

### 1. EventCard (`app/components/shared/EventCard.tsx`)
**Unified event card for all event listings**

```typescript
import { EventCard } from "../../shared/EventCard";

<EventCard
  event={event}
  onEventClick={handleClick}
  showStatusBadge={true}
  showActions={true}
  clickText="Click for details"
  onEdit={handleEdit}
  onViewApplications={handleViewApps}
  applicationCount={5}
  pendingApplicationCount={2}
  className="hover:shadow-lg"
/>
```

**Features:**
- Unified status display
- Action buttons
- Application counts
- Responsive design
- Consistent styling

### 2. BookingCard (`app/components/shared/BookingCard.tsx`)
**Unified booking card for booking displays**

```typescript
import { BookingCard } from "../../shared/BookingCard";

<BookingCard
  booking={booking}
  event={event}
  onEventClick={handleClick}
  showStatusBadge={true}
  showActions={true}
  userRole="venue"
/>
```

**Features:**
- Works for both venues and musicians
- Unified status display
- Context-aware actions
- Responsive design

---

## 📅 Calendar Components

### 1. VenueEventCalendar (`app/components/shared/VenueEventCalendar.tsx`)
**Unified calendar for event display**

```typescript
import VenueEventCalendar from "../../shared/VenueEventCalendar";

<VenueEventCalendar
  events={events}
  bookings={bookings}
  onEventClick={handleEventClick}
  onDateClick={handleDateClick}
  userRole="venue"
/>
```

**Features:**
- 3-line event display (time, title, status)
- Unified status colors
- Scrollable day cells
- Responsive design

### 2. CalendarEventItem (`app/components/shared/CalendarEventItem.tsx`)
**Individual calendar event items**

```typescript
import { CalendarEventItem } from "../../shared/CalendarEventItem";

<CalendarEventItem
  event={event}
  onClick={handleClick}
  showStatus={true}
  compact={true}
/>
```

**Features:**
- Unified status display
- Compact format for calendars
- Consistent styling
- Click handling

---

## 🔍 Filter Components

### 1. FilterPanel (`app/components/shared/FilterPanel.tsx`)
**Unified filtering system**

```typescript
import { FilterPanel, FilterState } from "../../shared/FilterPanel";
import { useFilters } from "../../hooks/useFilters";

// Filter configuration
const filterConfig = {
  search: {
    placeholder: "Search events...",
    enabled: true
  },
  dateRange: {
    enabled: true,
    fromLabel: "From Date",
    toLabel: "To Date"
  },
  status: {
    enabled: true,
    label: "Status",
    options: [
      { value: 'all', label: 'All Events' },
      { value: 'open', label: 'Open' },
      { value: 'confirmed', label: 'Confirmed' }
    ]
  },
  dropdowns: [
    {
      key: 'musician',
      label: 'Musician',
      options: ['all', ...musicians],
      searchable: true
    }
  ]
};

// Usage
<FilterPanel
  config={filterConfig}
  onFilterChange={setFilters}
  showActiveFilters={true}
  initiallyExpanded={true}
/>
```

**Features:**
- Configurable filter options
- Search functionality
- Date range filtering
- Custom dropdowns
- Active filter display

---

## 📊 Dashboard Components

### 1. EventHistoryPage (`app/components/shared/EventHistoryPage.tsx`)
**Unified event history display**

```typescript
import { EventHistoryPage } from "../../shared/EventHistoryPage";

<EventHistoryPage
  userRole="venue"
  events={events}
  bookings={bookings}
/>
```

**Features:**
- Works for both venues and musicians
- Unified filtering
- Status-based organization
- Export functionality

### 2. VenueEventsSummaryDashboard (`app/components/shared/VenueEventsSummaryDashboard.tsx`)
**Venue-specific dashboard summary**

```typescript
import { VenueEventsSummaryDashboard } from "../../shared/VenueEventsSummaryDashboard";

<VenueEventsSummaryDashboard
  stats={venueStats}
  onViewAll={handleViewAll}
/>
```

### 3. MusicianEventsSummaryDashboard (`app/components/shared/MusicianEventsSummaryDashboard.tsx`)
**Musician-specific dashboard summary**

```typescript
import { MusicianEventsSummaryDashboard } from "../../shared/MusicianEventsSummaryDashboard";

<MusicianEventsSummaryDashboard
  stats={musicianStats}
  onViewAll={handleViewAll}
/>
```

---

## 🔄 Activity & Messaging

### 1. ActivityLog (`app/components/shared/ActivityLog.tsx`)
**Unified activity logging**

```typescript
import { ActivityLog, generateEventActivityItems } from "../../shared/ActivityLog";

const activityItems = generateEventActivityItems(event, bookings);

<ActivityLog
  items={activityItems}
  showTimestamps={true}
  maxItems={10}
/>
```

**Features:**
- Unified activity generation
- Consistent formatting
- Configurable display
- Multiple item types

### 2. EventMessagingDialog (`app/components/shared/EventMessagingDialog.tsx`)
**Unified messaging system**

```typescript
import { EventMessagingDialog } from "../../shared/EventMessagingDialog";

<EventMessagingDialog
  isOpen={isOpen}
  onClose={onClose}
  event={event}
  booking={booking}
  currentUser={user}
/>
```

---

## 📋 Usage Guidelines

### ✅ DO Use These Components
- **EventDialog** for ALL event dialogs
- **StatusDisplay** for ALL status badges
- **EventStatusLegend** for ALL status legends
- **EventCard** for ALL event listings
- **BookingCard** for ALL booking displays
- **FilterPanel** for ALL filtering needs

### ❌ DON'T Create New Components
- Don't create new dialog components
- Don't create new status badge components
- Don't create new event card components
- Don't duplicate filtering logic
- Don't create custom status colors

### 🔧 Enhancement Guidelines
1. **Need new functionality?** Enhance existing components
2. **Missing props?** Add them to existing components
3. **Different styling?** Use className prop or variants
4. **New status type?** Add to STATUS_CONFIG
5. **New dialog behavior?** Add props to EventDialog

---

## 📂 File Structure

```
app/
├── components/
│   ├── shared/                    # 🎯 UNIFIED COMPONENTS
│   │   ├── EventDialog.tsx        # THE unified dialog
│   │   ├── StatusDisplay.tsx      # THE unified status display
│   │   ├── EventStatusLegend.tsx  # THE unified legend
│   │   ├── EventCard.tsx          # THE unified event card
│   │   ├── BookingCard.tsx        # THE unified booking card
│   │   ├── VenueEventCalendar.tsx # THE unified calendar
│   │   ├── FilterPanel.tsx        # THE unified filter
│   │   ├── ActivityLog.tsx        # THE unified activity log
│   │   └── ...
│   ├── venue/dashboard/           # Venue-specific containers
│   ├── musician/dashboard/        # Musician-specific containers
│   └── ...
├── lib/
│   └── utils.ts                   # 🎯 STATUS_CONFIG & utilities
└── hooks/
    └── useFilters.ts              # 🎯 Unified filtering logic
```

---

## 🚀 Quick Start Checklist

When working with events:

1. ✅ Import from `app/components/shared/`
2. ✅ Use `EventDialog` for dialogs
3. ✅ Use `StatusDisplay` for status badges
4. ✅ Use `EventStatusLegend` for legends
5. ✅ Use `deriveEventStatusFromBookings()` for status
6. ✅ Use `STATUS_CONFIG` for colors
7. ✅ Check this document before creating new components
8. ✅ Enhance existing components instead of duplicating

---

## 🔄 Migration Status

**✅ Completed Migrations:**
- ApplicationDetailDialog → EventDialog
- BookingDetailDialog → EventDialog
- EventStatusBadge → StatusDisplay
- Custom status colors → STATUS_CONFIG
- Duplicate activity logs → ActivityLog
- Inline status legends → EventStatusLegend

**📍 Current State:**
- All venue dashboard tabs use unified components
- All musician dashboard tabs use unified components
- All dialogs use EventDialog
- All status displays use StatusDisplay/STATUS_CONFIG
- All legends use EventStatusLegend

---

## 📞 Support

If you need to add functionality that doesn't exist in these components:

1. **First**: Check if it can be added via props
2. **Second**: Enhance the existing component
3. **Last Resort**: Create new component (document here)

**Remember**: The goal is consistency and maintainability. These unified components eliminate ~200+ lines of duplicate code and ensure consistent user experience across the entire application. 