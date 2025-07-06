import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import "./app.css";
import { AuthProvider } from "./lib/auth";

// Import route components
import PublicLayout from "./routes/_public";
import PublicIndex from "./routes/_public._index";
import AuthLayout from "./routes/_auth";
import SignIn from "./routes/_auth.sign-in";
import SignUp from "./routes/_auth.sign-up";
import ForgotPassword from "./routes/_auth.forgot-password";
import TestEmail from "./routes/test-email";
import EventPage from "./routes/event.$eventId";
import MusicianPage from "./routes/musician.$musicianId";
import VenuePage from "./routes/venue.$venueId";
import NotFound from "./routes/$";
import AppLayout from "./routes/_app";
import SignedIn from "./routes/_app.signed-in";
import ProfileSetup from "./routes/_app.profile-setup";
import MusicianDashboard from "./routes/_app.musician-dashboard";
import VenueDashboard from "./routes/_app.venue-dashboard";
import MusicianProfileEdit from "./routes/_app.musician-profile.edit";
import MusicianProfileCreate from "./routes/_app.musician-profile.create";
import MusicianReviews from "./routes/_app.musician-reviews";
import Musicians from "./routes/_app.musicians";
import MusicianAvailEvents from "./routes/_app.musician-availEvents";
import VenueMusicians from "./routes/_app.venue-musicians";
import SearchMusicians from "./routes/_app.search.musicians";
import Settings from "./routes/_app.settings";
import Availability from "./routes/_app.availability";
import Profile from "./routes/_app.profile";
import VenueEvents from "./routes/_app.venue-events";
import VenueEventsCurrent from "./routes/_app.venue-events.current";
import VenueEventsEventCentric from "./routes/_app.venue-events.event-centric";
import VenueEventsWorkflowBased from "./routes/_app.venue-events.workflow-based";
import CreateEvent from "./routes/_app.create-event";

import VenueHistory from "./routes/_app.venue-history";
import MusicianHistory from "./routes/_app.musician-history";
import VenueHowTo from "./routes/_app.venue-how-to";
import MusicianHowTo from "./routes/_app.musician-how-to";
import VenueProfileEdit from "./routes/_app.venue-profile.edit";
import VenueProfileCreate from "./routes/_app.venue-profile.create";
import MusicianProfilePage from "./routes/_app.musician-profile";
import MusicianMessages from "./routes/_app.musician-messages";
import Messages from "./routes/_app.messages";

// Define root context type
export type RootOutletContext = {
  // Add any global context properties here
};

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicIndex />} />
          </Route>
          
          {/* Auth routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* App routes (authenticated) */}
          <Route path="/" element={<AppLayout />}>
            <Route path="signed-in" element={<SignedIn />} />
            <Route path="profile-setup" element={<ProfileSetup />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Musician routes */}
            <Route path="musician-dashboard" element={<MusicianDashboard />} />
            <Route path="musician-profile" element={<MusicianProfilePage />} />
            <Route path="musician-profile/edit" element={<MusicianProfileEdit />} />
            <Route path="musician-profile/create" element={<MusicianProfileCreate />} />
            <Route path="musician-reviews" element={<MusicianReviews />} />
            <Route path="musicians" element={<Musicians />} />
            <Route path="musician-availEvents" element={<MusicianAvailEvents />} />
            <Route path="musician-messages" element={<MusicianMessages />} />
            <Route path="musician-history" element={<MusicianHistory />} />
            <Route path="availability" element={<Availability />} />
            <Route path="musician-how-to" element={<MusicianHowTo />} />
            
            {/* Venue routes */}
            <Route path="venue-dashboard" element={<VenueDashboard />} />
            <Route path="venue-musicians" element={<VenueMusicians />} />
            <Route path="venue-events" element={<VenueEvents />} />
            <Route path="venue-events/current" element={<VenueEventsCurrent />} />
            <Route path="venue-events/event-centric" element={<VenueEventsEventCentric />} />
            <Route path="venue-events/workflow-based" element={<VenueEventsWorkflowBased />} />
            <Route path="create-event" element={<CreateEvent />} />

            <Route path="venue-history" element={<VenueHistory />} />
            <Route path="venue-how-to" element={<VenueHowTo />} />
            <Route path="venue-profile/edit" element={<VenueProfileEdit />} />
            <Route path="venue-profile/create" element={<VenueProfileCreate />} />
            <Route path="messages" element={<Messages />} />
            
            {/* Search routes */}
            <Route path="search/musicians" element={<SearchMusicians />} />
          </Route>
          
          {/* Dynamic routes */}
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/musician/:musicianId" element={<MusicianPage />} />
          <Route path="/venue/:venueId" element={<VenuePage />} />
          <Route path="/test-email" element={<TestEmail />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "red" }}>Application Error</h1>
      <pre style={{ padding: "1rem", backgroundColor: "#f7f7f7", borderRadius: "0.5rem", overflow: "auto" }}>
        {error.message}
      </pre>
      <p>The application encountered an unexpected error.</p>
    </div>
  );
}
