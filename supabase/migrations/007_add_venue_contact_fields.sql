-- Add contact fields to venues table
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS contact_first_name TEXT,
ADD COLUMN IF NOT EXISTS contact_last_name TEXT; 