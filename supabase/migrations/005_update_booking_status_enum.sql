-- Update booking_status enum to support two-step confirmation process
-- Venue selects musician (booked) → Musician confirms (confirmed)

-- First, create a new enum with the correct values
CREATE TYPE booking_status_new AS ENUM ('applied', 'booked', 'confirmed', 'cancelled', 'completed');

-- Drop the default constraint first
ALTER TABLE public.bookings ALTER COLUMN status DROP DEFAULT;

-- Alter the table to use the new enum (this will handle the conversion)
ALTER TABLE public.bookings 
  ALTER COLUMN status TYPE booking_status_new 
  USING CASE 
    WHEN status = 'pending' THEN 'applied'::booking_status_new
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

-- Add cancellation tracking fields
ALTER TABLE public.bookings ADD COLUMN cancelled_by UUID REFERENCES public.users(id);
ALTER TABLE public.bookings ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN cancellation_reason TEXT;
ALTER TABLE public.bookings ADD COLUMN cancelled_by_role TEXT CHECK (cancelled_by_role IN ('venue', 'musician')); 