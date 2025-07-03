-- Add 'venue' as a valid user_type enum value
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'venue'; 