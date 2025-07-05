import React, { useState, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { EventHistoryPage } from "../components/shared/EventHistoryPage";
import { supabase } from "../lib/supabase";

export default function MusicianHistoryPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [musician, setMusician] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch musician profile
        const { data: musicianData, error: musicianError } = await supabase
          .from('musicians')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (musicianError) {
          console.error('Error fetching musician:', musicianError);
          setLoading(false);
          return;
        }

        setMusician(musicianData);

        if (musicianData?.id) {
          // Fetch all events
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select(`
              *,
              venue:venues(*)
            `)
            .order('date', { ascending: false });

          if (eventsError) {
            console.error('Error fetching events:', eventsError);
          } else {
            setAllEvents(eventsData || []);
          }

          // Fetch all bookings for this musician
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              event:events(*),
              musician:musicians(*),
              venue:venues(*)
            `)
            .eq('musician_id', musicianData.id)
            .order('created_at', { ascending: false });

          if (bookingsError) {
            console.error('Error fetching bookings:', bookingsError);
          } else {
            setAllBookings(bookingsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Helper function to get application count for an event (not really needed for musician view)
  const getApplicationCount = (eventId: string) => {
    return allBookings.filter((booking: any) => booking.event?.id === eventId).length;
  };

  // Placeholder handlers (musicians typically can't book/reject applications)
  const handleBookApplication = (bookingId: string, eventId: string) => {
    console.log('Booking application:', bookingId, eventId);
  };

  const handleRejectApplication = (bookingId: string) => {
    console.log('Rejecting application:', bookingId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event history...</p>
        </div>
      </div>
    );
  }

  // If no musician profile found, show a message
  if (!musician) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No Musician Profile Found</h3>
          <p className="text-muted-foreground mb-6">
            You need to create a musician profile to view your event history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EventHistoryPage
      allEvents={allEvents}
      allBookings={allBookings}
      userProfile={musician}
      user={user}
      userType="musician"
      pageTitle="Event History"
      backLink="/musician-dashboard"
      backLinkText="Back to Dashboard"
      emptyStateTitle="No Past Events"
      emptyStateDescription="Your event history will appear here once you have completed or cancelled bookings."
      getApplicationCount={getApplicationCount}
      handleBookApplication={handleBookApplication}
      handleRejectApplication={handleRejectApplication}
    />
  );
} 