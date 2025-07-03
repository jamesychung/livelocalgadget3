-- Add missing INSERT policy for users table
-- This allows authenticated users to create their own profile records

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id); 