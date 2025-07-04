-- Add cancel flow fields to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS cancel_requested_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS cancel_requested_by UUID;

-- Add 'pending_cancel' to the status enum more safely
DO $$
DECLARE
  enum_exists boolean;
  value_exists boolean;
BEGIN
  -- Check if the enum type exists
  SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'booking_status') INTO enum_exists;
  
  IF enum_exists THEN
    -- Check if the value already exists in the enum
    BEGIN
      -- This will throw an error if the value doesn't exist, which we'll catch
      PERFORM 'pending_cancel'::booking_status;
      value_exists := true;
    EXCEPTION WHEN invalid_text_representation THEN
      value_exists := false;
    END;
    
    -- Add the value if it doesn't exist
    IF NOT value_exists THEN
      EXECUTE 'ALTER TYPE booking_status ADD VALUE ''pending_cancel''';
    END IF;
  ELSE
    RAISE NOTICE 'booking_status enum does not exist.';
  END IF;
END
$$;

-- Update the trigger function to handle the new status
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
            -- Default case to avoid missing ELSE error
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