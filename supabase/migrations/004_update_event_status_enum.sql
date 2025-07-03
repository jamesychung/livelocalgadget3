-- Update event_status enum to match business logic
-- Remove 'draft' and 'published', add 'open' and 'invited'

-- First, create a new enum with the correct values
CREATE TYPE event_status_new AS ENUM ('open', 'invited', 'cancelled', 'completed');

-- Drop the default constraint first
ALTER TABLE public.events ALTER COLUMN event_status DROP DEFAULT;

-- Alter the table to use the new enum (this will handle the conversion)
ALTER TABLE public.events 
  ALTER COLUMN event_status TYPE event_status_new 
  USING CASE 
    WHEN event_status = 'published' THEN 'open'::event_status_new
    WHEN event_status = 'draft' THEN 'open'::event_status_new
    WHEN event_status = 'cancelled' THEN 'cancelled'::event_status_new
    WHEN event_status = 'completed' THEN 'completed'::event_status_new
    ELSE 'open'::event_status_new
  END;

-- Set the new default
ALTER TABLE public.events ALTER COLUMN event_status SET DEFAULT 'open';

-- Drop the old enum
DROP TYPE event_status;

-- Rename the new enum to the original name
ALTER TYPE event_status_new RENAME TO event_status; 