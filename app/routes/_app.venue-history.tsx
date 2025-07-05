import React from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { useVenueEvents } from "../hooks/useVenueEvents";
import { EventHistoryPage } from "../components/shared/EventHistoryPage";
import { VenueProfilePrompt } from "../components/shared/VenueProfilePrompt";

export default function VenueHistoryPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  
  const {
    // Data
    venue,
    allEvents,
    allBookings,

    // Helper functions
    getApplicationCount,

    // Event handlers
    handleBookApplication,
    handleRejectApplication,
  } = useVenueEvents(user);

  // If no venue profile found, show a message with option to create one
  if (!venue) {
    return (
      <VenueProfilePrompt onCreateProfile={() => {}} />
    );
  }

  return (
    <EventHistoryPage
      allEvents={allEvents}
      allBookings={allBookings}
      userProfile={venue}
      user={user}
      userType="venue"
      pageTitle="Event History"
      backLink="/venue-dashboard"
      backLinkText="Back to Dashboard"
      emptyStateTitle="No Past Events"
      emptyStateDescription="Your event history will appear here once you have completed or cancelled events."
      createEventLink="/create-event"
      createEventText="Create Your First Event"
      getApplicationCount={getApplicationCount}
      handleBookApplication={handleBookApplication}
      handleRejectApplication={handleRejectApplication}
    />
  );
}