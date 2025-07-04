-- Fix booking RLS policy to allow venue owners to update bookings for their events
-- Drop the existing policy
DROP POLICY IF EXISTS "Bookings editable by creator" ON public.bookings;

-- Create new policy that allows venue owners to update bookings for their events
CREATE POLICY "Bookings editable by venue owner" ON public.bookings
    FOR UPDATE USING (
        venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid()) OR
        booked_by = auth.uid()
    );

-- Also allow venue owners to insert bookings for their events
CREATE POLICY "Bookings insertable by venue owner" ON public.bookings
    FOR INSERT WITH CHECK (
        venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid()) OR
        booked_by = auth.uid()
    ); 