import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { DashboardHeader } from "./DashboardHeader";
import { OverviewTab } from "./OverviewTab";
import { BookingsTab } from "./BookingsTab";
import { VenueEventsSummaryDashboard } from "../../shared/VenueEventsSummaryDashboard";
import { VenueStatsSettings } from "../../shared/VenueStatsSettings";
import { useVenueEventsStats, createVenueEventStats } from "../../../hooks/useVenueEventsStats";
import { VenueProfile, Event, Booking, Review, DashboardStats } from "./types";
import { 
  fetchVenueProfile, 
  fetchVenueEvents, 
  fetchVenueBookings, 
  fetchVenueReviews, 
  calculateDashboardStats 
} from "./utils";

export const VenueDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [venue, setVenue] = useState<VenueProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalBookings: 0,
    pendingBookings: 0,
    averageRating: 0,
    pendingCancelBookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Stats customization state with localStorage persistence
  const [showStatsSettings, setShowStatsSettings] = useState(false);
  const [selectedStatIds, setSelectedStatIds] = useState<string[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('venue-dashboard-stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved stats:', error);
        }
      }
    }
    // Default stats if nothing saved
    return ['totalEvents', 'confirmedBookings', 'upcomingEvents', 'averageRating'];
  });

  // Save to localStorage whenever selectedStatIds changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('venue-dashboard-stats', JSON.stringify(selectedStatIds));
    }
  }, [selectedStatIds]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch venue profile
        const venueData = await fetchVenueProfile(user.id);
        if (!venueData) {
          setIsLoading(false);
          return;
        }
        setVenue(venueData);

        // Fetch events, bookings, and reviews in parallel
        const [eventsData, bookingsData, reviewsData] = await Promise.all([
          fetchVenueEvents(venueData.id),
          fetchVenueBookings(venueData.id),
          fetchVenueReviews(venueData.id)
        ]);

        setEvents(eventsData);
        setBookings(bookingsData);
        setReviews(reviewsData);

        // Calculate dashboard stats
        const dashboardStats = calculateDashboardStats(bookingsData, eventsData, reviewsData);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Get pending bookings
  const pendingBookings = bookings.filter(booking => 
    booking.status === 'applied' || booking.status === 'selected'
  );

  // Get confirmed bookings for the overview tab
  const confirmedBookings = bookings.filter(booking => 
    booking.status === 'confirmed'
  );

  // Get pending cancel bookings
  const pendingCancelBookings = bookings.filter(booking => 
    booking.status === 'pending_cancel'
  );

  // Get recent events (sorted by date)
  const recentEvents = [...events]
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5);

  // Calculate stats using the venue events stats hook
  const venueEventsStats = useVenueEventsStats(events, bookings, pendingBookings);
  const allAvailableStats = createVenueEventStats(venueEventsStats);
  const selectedStats = allAvailableStats.filter(stat => selectedStatIds.includes(stat.id));

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!venue) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Venue Dashboard</h1>
        <p>No venue profile found. Please create a venue profile to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader venue={venue} user={user!} />
      
      {/* Customizable Stats Dashboard */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard Stats</h2>
          <Button size="sm" variant="outline" onClick={() => setShowStatsSettings((v: boolean) => !v)}>
            Customize
          </Button>
        </div>
        <VenueEventsSummaryDashboard
          stats={selectedStats}
          maxStats={8}
        />
        {showStatsSettings && (
          <div className="mt-2">
            <VenueStatsSettings
              availableStats={allAvailableStats}
              selectedStatIds={selectedStatIds}
              onStatsChange={setSelectedStatIds}
              maxStats={8}
              onClose={() => setShowStatsSettings(false)}
            />
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <OverviewTab 
            venue={venue}
            recentEvents={recentEvents}
            pendingBookings={[...pendingBookings, ...confirmedBookings]}
            pendingCancelBookings={pendingCancelBookings}
          />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          {/* Events tab content will be implemented separately */}
          <p>Events tab content</p>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsTab 
            bookings={bookings}
            venue={venue}
            events={events}
          />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          {/* Profile tab content will be implemented separately */}
          <p>Profile tab content</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 