-- Fix existing bookings that have null venue_id by setting them based on the event's venue_id
UPDATE public.bookings 
SET venue_id = events.venue_id
FROM public.events 
WHERE bookings.event_id = events.id 
  AND bookings.venue_id IS NULL 
  AND events.venue_id IS NOT NULL; 