-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('musician', 'venue_owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE recurring_pattern AS ENUM ('daily', 'weekly', 'bi-weekly', 'monthly');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    user_type user_type DEFAULT 'musician',
    profile_picture TEXT,
    google_profile_id TEXT,
    google_image_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    last_signed_in TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Musicians table
CREATE TABLE public.musicians (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stage_name TEXT,
    bio TEXT DEFAULT '',
    email TEXT,
    phone TEXT,
    location TEXT DEFAULT '',
    city TEXT DEFAULT '',
    state TEXT DEFAULT '',
    country TEXT DEFAULT '',
    website TEXT,
    profile_picture TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_gigs INTEGER DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    experience TEXT DEFAULT '',
    genre TEXT DEFAULT '',
    genres JSONB DEFAULT '[]',
    instruments JSONB DEFAULT '[]',
    audio TEXT,
    audio_files JSONB DEFAULT '[]',
    additional_pictures JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '[]',
    availability JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE public.venues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    zip_code TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    profile_picture TEXT,
    capacity INTEGER,
    price_range TEXT,
    venue_type TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    amenities JSONB DEFAULT '[]',
    additional_pictures JSONB DEFAULT '[]',
    genres JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '[]',
    hours JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT '',
    date TIMESTAMPTZ NOT NULL,
    start_time TEXT,
    end_time TEXT,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    ticket_type TEXT DEFAULT 'general',
    total_capacity INTEGER DEFAULT 0,
    available_tickets INTEGER DEFAULT 0,
    rate DECIMAL(10,2),
    image TEXT,
    genres JSONB DEFAULT '[]',
    equipment JSONB DEFAULT '[]',
    setlist JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    event_status event_status DEFAULT 'draft',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern recurring_pattern DEFAULT 'weekly',
    recurring_interval INTEGER DEFAULT 1,
    recurring_days JSONB DEFAULT '[]',
    recurring_end_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    musician_id UUID REFERENCES public.musicians(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL,
    start_time TEXT,
    end_time TEXT,
    proposed_rate DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    full_payment_paid BOOLEAN DEFAULT FALSE,
    status booking_status DEFAULT 'pending',
    musician_pitch TEXT,
    notes TEXT,
    special_requirements TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    booked_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    musician_id UUID REFERENCES public.musicians(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    musician_id UUID REFERENCES public.musicians(id) ON DELETE SET NULL,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event History table
CREATE TABLE public.event_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    change_type TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    description TEXT,
    context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_musicians_user_id ON public.musicians(user_id);
CREATE INDEX idx_venues_owner_id ON public.venues(owner_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_events_musician_id ON public.events(musician_id);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_bookings_musician_id ON public.bookings(musician_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_reviews_musician_id ON public.reviews(musician_id);
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
CREATE INDEX idx_event_history_event_id ON public.event_history(event_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_musicians_updated_at BEFORE UPDATE ON public.musicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 