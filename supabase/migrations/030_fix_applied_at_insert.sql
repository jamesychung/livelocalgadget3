-- Add INSERT trigger for bookings to set timestamps on creation
CREATE OR REPLACE FUNCTION set_booking_insert_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Set timestamp based on the status when booking is created
    CASE NEW.status
        WHEN 'applied' THEN
            NEW.applied_at = COALESCE(NEW.applied_at, NOW());
        WHEN 'invited' THEN
            NEW.invited_at = COALESCE(NEW.invited_at, NOW());
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
            -- Default case, no timestamp needed
            NULL;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the INSERT trigger
CREATE TRIGGER booking_insert_timestamp_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_insert_timestamp(); 