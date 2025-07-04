-- Fix RLS policies for musicians and venues to properly handle INSERT and UPDATE operations

-- Drop existing policies
DROP POLICY IF EXISTS "Musicians editable by owner" ON public.musicians;
DROP POLICY IF EXISTS "Venues editable by owner" ON public.venues;

-- Create separate policies for musicians
CREATE POLICY "Musicians insertable by owner" ON public.musicians
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Musicians updatable by owner" ON public.musicians
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Musicians deletable by owner" ON public.musicians
    FOR DELETE USING (user_id = auth.uid());

-- Create separate policies for venues
CREATE POLICY "Venues insertable by owner" ON public.venues
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Venues updatable by owner" ON public.venues
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Venues deletable by owner" ON public.venues
    FOR DELETE USING (owner_id = auth.uid()); 