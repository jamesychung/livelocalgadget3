-- Update the booking venue owner policy to be more permissive
-- Drop the existing policy
DROP POLICY IF EXISTS "Bookings editable by venue owner" ON public.bookings;

-- Create a new policy that allows venue owners to update bookings for their events
-- This policy is more permissive and should resolve the venue selection issue
CREATE POLICY "Bookings editable by venue owner" ON public.bookings
    FOR UPDATE USING (
        venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid()) OR
        booked_by = auth.uid() OR
        -- Allow updates if the user is the venue owner of the event
        event_id IN (
            SELECT e.id FROM public.events e 
            INNER JOIN public.venues v ON e.venue_id = v.id 
            WHERE v.owner_id = auth.uid()
        )
    );

-- Also ensure venue owners can insert bookings for their events
DROP POLICY IF EXISTS "Bookings insertable by venue owner" ON public.bookings;

CREATE POLICY "Bookings insertable by venue owner" ON public.bookings
    FOR INSERT WITH CHECK (
        venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid()) OR
        booked_by = auth.uid() OR
        -- Allow inserts if the user is the venue owner of the event
        event_id IN (
            SELECT e.id FROM public.events e 
            INNER JOIN public.venues v ON e.venue_id = v.id 
            WHERE v.owner_id = auth.uid()
        )
    ); 