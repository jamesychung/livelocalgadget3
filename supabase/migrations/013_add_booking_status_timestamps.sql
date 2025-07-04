-- Add timestamp columns for booking status changes
-- This will allow us to track when each status change occurred

-- Add timestamp columns
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS selected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Set initial timestamps for existing bookings based on their current status
-- Only update for statuses that exist in the current enum
UPDATE public.bookings 
SET applied_at = created_at 
WHERE status = 'applied' AND applied_at IS NULL;

-- Note: 'selected' status might not exist yet in the enum, so we'll skip this for now
-- UPDATE public.bookings 
-- SET selected_at = created_at 
-- WHERE status = 'selected' AND selected_at IS NULL;

UPDATE public.bookings 
SET confirmed_at = created_at 
WHERE status = 'confirmed' AND confirmed_at IS NULL;

UPDATE public.bookings 
SET completed_at = created_at 
WHERE status = 'completed' AND completed_at IS NULL;

UPDATE public.bookings 
SET cancelled_at = created_at 
WHERE status = 'cancelled' AND cancelled_at IS NULL;

-- Create a function to automatically update timestamps when status changes
CREATE OR REPLACE FUNCTION update_booking_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the appropriate timestamp based on the new status
    CASE NEW.status
        WHEN 'applied' THEN
            NEW.applied_at = COALESCE(NEW.applied_at, NOW());
        WHEN 'confirmed' THEN
            NEW.confirmed_at = COALESCE(NEW.confirmed_at, NOW());
        WHEN 'completed' THEN
            NEW.completed_at = COALESCE(NEW.completed_at, NOW());
        WHEN 'cancelled' THEN
            NEW.cancelled_at = COALESCE(NEW.cancelled_at, NOW());
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update timestamps
CREATE TRIGGER booking_status_timestamp_trigger
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_status_timestamp(); 