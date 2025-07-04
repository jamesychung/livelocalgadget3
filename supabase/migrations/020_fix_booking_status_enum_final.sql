-- Final fix for booking_status enum - ensure 'booked' is removed and 'selected' is present
-- This migration will properly handle the enum conversion

-- First, let's see what the current enum values are
DO $$
BEGIN
    RAISE NOTICE 'Current enum values: %', array_to_string(enum_range(NULL::booking_status), ', ');
END $$;

-- Create a new enum with the correct values
CREATE TYPE booking_status_fixed AS ENUM ('applied', 'selected', 'confirmed', 'cancelled', 'completed');

-- Drop the default constraint first
ALTER TABLE public.bookings ALTER COLUMN status DROP DEFAULT;

-- Alter the table to use the new enum (this will handle the conversion)
ALTER TABLE public.bookings 
  ALTER COLUMN status TYPE booking_status_fixed 
  USING CASE 
    WHEN status = 'applied' THEN 'applied'::booking_status_fixed
    WHEN status = 'selected' THEN 'selected'::booking_status_fixed
    WHEN status = 'confirmed' THEN 'confirmed'::booking_status_fixed
    WHEN status = 'cancelled' THEN 'cancelled'::booking_status_fixed
    WHEN status = 'completed' THEN 'completed'::booking_status_fixed
    ELSE 'applied'::booking_status_fixed
  END;

-- Set the new default
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'applied';

-- Drop the old enum
DROP TYPE booking_status;

-- Rename the new enum to the original name
ALTER TYPE booking_status_fixed RENAME TO booking_status;

-- Verify the enum values
DO $$
BEGIN
    RAISE NOTICE 'New enum values: %', array_to_string(enum_range(NULL::booking_status), ', ');
END $$;

-- Recreate the trigger function to ensure it uses the correct enum values
DROP TRIGGER IF EXISTS booking_status_timestamp_trigger ON public.bookings;
DROP FUNCTION IF EXISTS update_booking_status_timestamp();

-- Create a new function that properly sets the status based on timestamps
CREATE OR REPLACE FUNCTION update_booking_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the appropriate timestamp based on the new status
    CASE NEW.status
        WHEN 'applied' THEN
            NEW.applied_at = COALESCE(NEW.applied_at, NOW());
        WHEN 'selected' THEN
            NEW.selected_at = COALESCE(NEW.selected_at, NOW());
        WHEN 'confirmed' THEN
            NEW.confirmed_at = COALESCE(NEW.confirmed_at, NOW());
        WHEN 'completed' THEN
            NEW.completed_at = COALESCE(NEW.completed_at, NOW());
        WHEN 'cancelled' THEN
            NEW.cancelled_at = COALESCE(NEW.cancelled_at, NOW());
    END CASE;
    
    -- Also set status based on which timestamp is being set
    IF NEW.selected_at IS NOT NULL AND (OLD.selected_at IS NULL OR OLD.selected_at != NEW.selected_at) THEN
        NEW.status = 'selected';
    ELSIF NEW.confirmed_at IS NOT NULL AND (OLD.confirmed_at IS NULL OR OLD.confirmed_at != NEW.confirmed_at) THEN
        NEW.status = 'confirmed';
    ELSIF NEW.completed_at IS NOT NULL AND (OLD.completed_at IS NULL OR OLD.completed_at != NEW.completed_at) THEN
        NEW.status = 'completed';
    ELSIF NEW.cancelled_at IS NOT NULL AND (OLD.cancelled_at IS NULL OR OLD.cancelled_at != NEW.cancelled_at) THEN
        NEW.status = 'cancelled';
    ELSIF NEW.applied_at IS NOT NULL AND (OLD.applied_at IS NULL OR OLD.applied_at != NEW.applied_at) THEN
        NEW.status = 'applied';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update timestamps and status
CREATE TRIGGER booking_status_timestamp_trigger
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_status_timestamp(); 