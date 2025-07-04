-- Rename cancelled_by_role to cancel_confirmed_by_role
ALTER TABLE bookings 
  RENAME COLUMN cancelled_by_role TO cancel_confirmed_by_role;

-- Update the booking_status_change trigger function to use the new column name
CREATE OR REPLACE FUNCTION public.booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Set timestamp when status changes
  IF NEW.status = 'applied' AND (OLD.status IS NULL OR OLD.status <> 'applied') THEN
    NEW.applied_at := CURRENT_TIMESTAMP;
  END IF;
  
  IF NEW.status = 'selected' AND (OLD.status IS NULL OR OLD.status <> 'selected') THEN
    NEW.selected_at := CURRENT_TIMESTAMP;
  END IF;
  
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status <> 'confirmed') THEN
    NEW.confirmed_at := CURRENT_TIMESTAMP;
  END IF;
  
  IF NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status <> 'cancelled') THEN
    NEW.cancelled_at := CURRENT_TIMESTAMP;
  END IF;
  
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    NEW.completed_at := CURRENT_TIMESTAMP;
  END IF;
  
  IF NEW.status = 'pending_cancel' AND (OLD.status IS NULL OR OLD.status <> 'pending_cancel') THEN
    NEW.cancel_requested_at := CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$function$; 