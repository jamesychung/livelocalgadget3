import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { useVenueProfile, useSupabaseQuery, useSupabaseMutation } from "../hooks/useSupabaseData";
import {
  LoadingState,
  PageHeader,
  SearchAndFilter,
  EventSelection,
  MusicianSelection,
  ActionButtons,
  filterMusicians,
  fetchMusicians,
  fetchVenueEvents,
  createBookingInvitations,
  Musician,
  Event,
  InvitationData
} from "../components/venue/musicians";

// Available genres for filtering
const availableGenres = [
  "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip Hop", 
  "R&B", "Classical", "Reggae", "Latin", "World Music", "Alternative", "Indie",
  "Metal", "Punk", "Soul", "Funk", "Gospel", "Bluegrass", "EDM", "House", "Techno"
];

export default function VenueMusiciansPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMusicians, setSelectedMusicians] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get event data from navigation state
  const eventData = location.state as { eventId?: string; eventTitle?: string; action?: string };

  // Fetch venue profile
  const { data: venue, loading: venueLoading } = useVenueProfile(user?.id);

  // Fetch all musicians
  const { data: musiciansData, loading: musiciansLoading } = useSupabaseQuery<Musician>(
    async () => {
      return await fetchMusicians();
    },
    []
  );

  // Fetch venue's events
  const { data: eventsData, loading: eventsLoading } = useSupabaseQuery<Event>(
    async () => {
      if (!(venue as any)?.id) return { data: null, error: null };
      return await fetchVenueEvents((venue as any).id);
    },
    [(venue as any)?.id]
  );

  // Mutation hook for creating bookings
  const { mutate: createBooking, loading: createBookingLoading } = useSupabaseMutation();

  const musicians: Musician[] = musiciansData || [];
  const events: Event[] = eventsData || [];

  // If we have a specific event from navigation, select it
  useEffect(() => {
    if (eventData?.eventId) {
      setSelectedEvents([eventData.eventId]);
    }
  }, [eventData?.eventId]);

  // Filter musicians based on search and genre
  const filteredMusicians = filterMusicians(musicians, searchTerm, genreFilter);

  // Handle musician selection
  const handleMusicianSelection = (musicianId: string, checked: boolean) => {
    if (checked) {
      setSelectedMusicians(prev => [...prev, musicianId]);
    } else {
      setSelectedMusicians(prev => prev.filter(id => id !== musicianId));
    }
  };

  // Handle event selection
  const handleEventSelection = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents(prev => [...prev, eventId]);
    } else {
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
    }
  };

  // Handle genre filter
  const handleGenreFilter = (genre: string, checked: boolean) => {
    if (checked) {
      setGenreFilter(prev => [...prev, genre]);
    } else {
      setGenreFilter(prev => prev.filter(g => g !== genre));
    }
  };

  // Send invitations
  const handleSendInvitations = async () => {
    if (selectedMusicians.length === 0) {
      alert("Please select at least one musician to invite.");
      return;
    }

    if (selectedEvents.length === 0) {
      alert("Please select at least one event to invite musicians to.");
      return;
    }

    setIsSubmitting(true);

    try {
      const invitations: InvitationData[] = [];
      
      for (const eventId of selectedEvents) {
        for (const musicianId of selectedMusicians) {
          const event = events.find(e => e.id === eventId);
          const musician = musicians.find(m => m.id === musicianId);
          
          if (event && musician) {
            invitations.push({
              event_id: eventId,
              musician_id: musicianId,
              venue_id: (venue as any)?.id || '',
              status: "invited",
              invited_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      }

      // Create all invitations
      const { data, error } = await createBookingInvitations(invitations);
      
      if (error) {
        throw error;
      }

      alert(`Successfully sent ${invitations.length} invitation(s)!`);
      navigate("/venue-events");
    } catch (error) {
      console.error("Error sending invitations:", error);
      alert("Failed to send invitations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (venueLoading || musiciansLoading || eventsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        musicianCount={musicians.length}
        eventCount={events.length}
      />

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        genreFilter={genreFilter}
        handleGenreFilter={handleGenreFilter}
        availableGenres={availableGenres}
      />

      <EventSelection
        events={events}
        selectedEvents={selectedEvents}
        handleEventSelection={handleEventSelection}
      />

      <MusicianSelection
        filteredMusicians={filteredMusicians}
        selectedMusicians={selectedMusicians}
        handleMusicianSelection={handleMusicianSelection}
      />

      <ActionButtons
        selectedMusicians={selectedMusicians}
        selectedEvents={selectedEvents}
        isSubmitting={isSubmitting}
        handleSendInvitations={handleSendInvitations}
      />
    </div>
  );
} 
