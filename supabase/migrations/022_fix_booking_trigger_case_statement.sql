-- Fix the trigger function with a missing ELSE clause
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
        WHEN 'pending_cancel' THEN
            NEW.cancel_requested_at = COALESCE(NEW.cancel_requested_at, NOW());
        ELSE
            -- Default case to avoid the "case not found" error
            NULL;
    END CASE;
    
    -- Also set status based on which timestamp is being set
    IF NEW.cancel_requested_at IS NOT NULL AND (OLD.cancel_requested_at IS NULL OR OLD.cancel_requested_at != NEW.cancel_requested_at) THEN
        NEW.status = 'pending_cancel';
    ELSIF NEW.selected_at IS NOT NULL AND (OLD.selected_at IS NULL OR OLD.selected_at != NEW.selected_at) THEN
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

-- Drop and recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS booking_status_timestamp_trigger ON public.bookings;

CREATE TRIGGER booking_status_timestamp_trigger
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_status_timestamp(); 