-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Musicians can view all musicians, but only edit their own
CREATE POLICY "Musicians viewable by all" ON public.musicians
    FOR SELECT USING (true);

CREATE POLICY "Musicians editable by owner" ON public.musicians
    FOR ALL USING (user_id = auth.uid());

-- Venues can view all venues, but only edit their own
CREATE POLICY "Venues viewable by all" ON public.venues
    FOR SELECT USING (true);

CREATE POLICY "Venues editable by owner" ON public.venues
    FOR ALL USING (owner_id = auth.uid());

-- Events are viewable by all, editable by creator
CREATE POLICY "Events viewable by all" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Events editable by creator" ON public.events
    FOR ALL USING (created_by = auth.uid());

-- Bookings viewable by participants, editable by creator
CREATE POLICY "Bookings viewable by participants" ON public.bookings
    FOR SELECT USING (
        booked_by = auth.uid() OR
        musician_id IN (SELECT id FROM public.musicians WHERE user_id = auth.uid()) OR
        venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid())
    );

CREATE POLICY "Bookings editable by creator" ON public.bookings
    FOR ALL USING (booked_by = auth.uid());

-- Reviews viewable by all, editable by reviewer
CREATE POLICY "Reviews viewable by all" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Reviews editable by reviewer" ON public.reviews
    FOR ALL USING (reviewer_id = auth.uid());

-- Event history viewable by event participants
CREATE POLICY "Event history viewable by participants" ON public.event_history
    FOR SELECT USING (
        event_id IN (
            SELECT id FROM public.events 
            WHERE created_by = auth.uid() OR
                  venue_id IN (SELECT id FROM public.venues WHERE owner_id = auth.uid()) OR
                  musician_id IN (SELECT id FROM public.musicians WHERE user_id = auth.uid())
        )
    ); 