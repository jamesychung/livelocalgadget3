# Live Music Marketplace & Directory

## Purpose
Connect venues, musicians, and fans for live music events. A two-sided marketplace (venues ↔ musicians) with a public directory for consumers (fans).

---

## User Types
- **Musicians:** Get booked, manage profile/availability, promote themselves.
- **Venues:** Find/book musicians, manage event calendar, promote events.
- **Consumers (Fans):** Discover events, follow artists/venues, get event info.

---

## Prioritized MVP Feature List

### Musicians
- Profile creation & editing (bio, genres, media)
- Set/manage availability
- Receive/respond to booking requests
- View upcoming gigs
- Notifications for bookings

### Venues
- Profile creation & editing
- Search/browse musicians
- Send booking requests
- Manage event calendar
- Notifications for bookings

### Consumers (Fans)
- Search/browse events
- View musician/venue profiles
- View event details

### Core Platform
- User authentication & role selection
- Public directory/search
- Booking request workflow
- Basic notifications
- Responsive UI

---

## Core Data Models (Sketch)

### User
- id, name, email, password_hash, role (musician/venue/fan), created_at, updated_at

### MusicianProfile
- id, user_id, bio, genres, media_links, location, availability, social_links, created_at, updated_at

### VenueProfile
- id, user_id, name, description, location, capacity, event_calendar, contact_info, created_at, updated_at

### Event
- id, venue_id, musician_id, title, description, date_time, status, ticket_info, created_at, updated_at

### BookingRequest
- id, venue_id, musician_id, event_id, proposed_date_time, status, terms, created_at, updated_at

### FanProfile (optional)
- id, user_id, favorites, preferences, created_at, updated_at

### Notification (optional)
- id, user_id, type, content, read, created_at

---

## Tech Stack
- Node.js, Express, MongoDB (with Mongoose)
- UI: React, Vue, or your choice

---

*Update this file as your project evolves!* 