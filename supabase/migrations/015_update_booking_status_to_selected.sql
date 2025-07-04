-- Update booking_status enum to use "selected" instead of "booked" for consistency
-- This aligns with the UI terminology where venues "select" musicians

-- Note: Migration 005 now creates the enum with 'selected' instead of 'booked'
-- This migration is no longer needed for conversion, but kept for consistency

-- First, create a new enum with the correct values
CREATE TYPE booking_status_new AS ENUM ('applied', 'selected', 'confirmed', 'cancelled', 'completed');

-- Drop the default constraint first
ALTER TABLE public.bookings ALTER COLUMN status DROP DEFAULT;

-- Alter the table to use the new enum (this will handle the conversion)
ALTER TABLE public.bookings 
  ALTER COLUMN status TYPE booking_status_new 
  USING CASE 
    WHEN status = 'applied' THEN 'applied'::booking_status_new
    WHEN status = 'selected' THEN 'selected'::booking_status_new
    WHEN status = 'confirmed' THEN 'confirmed'::booking_status_new
    WHEN status = 'cancelled' THEN 'cancelled'::booking_status_new
    WHEN status = 'completed' THEN 'completed'::booking_status_new
    ELSE 'applied'::booking_status_new
  END;

-- Set the new default
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'applied';

-- Drop the old enum
DROP TYPE booking_status;

-- Rename the new enum to the original name
ALTER TYPE booking_status_new RENAME TO booking_status; 