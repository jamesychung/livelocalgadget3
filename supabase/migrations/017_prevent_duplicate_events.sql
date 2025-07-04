-- Prevent duplicate events by adding unique constraints
-- This will prevent the same venue from creating multiple events with the same title, date, and venue

-- First, let's identify and clean up any existing duplicate events
-- Keep the oldest event and delete the newer duplicates
WITH duplicate_events AS (
  SELECT 
    venue_id,
    title,
    date,
    MIN(created_at) as oldest_created_at,
    COUNT(*) as duplicate_count
  FROM events 
  GROUP BY venue_id, title, date
  HAVING COUNT(*) > 1
),
events_to_delete AS (
  SELECT e.id
  FROM events e
  INNER JOIN duplicate_events de 
    ON e.venue_id = de.venue_id 
    AND e.title = de.title 
    AND e.date = de.date
    AND e.created_at > de.oldest_created_at
)
DELETE FROM events 
WHERE id IN (SELECT id FROM events_to_delete);

-- Add unique constraint to prevent future duplicates
-- This ensures that a venue cannot create multiple events with the same title and date
ALTER TABLE events 
ADD CONSTRAINT unique_venue_event_title_date 
UNIQUE (venue_id, title, date);

-- Add unique constraint on bookings to prevent duplicate applications
-- This ensures a musician cannot apply to the same event multiple times
ALTER TABLE bookings 
ADD CONSTRAINT unique_event_musician 
UNIQUE (event_id, musician_id); 