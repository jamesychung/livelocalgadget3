-- Add missing INSERT policy for users table
-- This allows authenticated users to create their own profile records

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id); 