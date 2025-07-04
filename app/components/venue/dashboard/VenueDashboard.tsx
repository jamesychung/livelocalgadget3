import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { DashboardHeader } from "./DashboardHeader";
import { OverviewTab } from "./OverviewTab";
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
    <div className="p-6">
      <DashboardHeader venue={venue} user={user} stats={stats} />
      
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
            pendingBookings={pendingBookings}
            pendingCancelBookings={pendingCancelBookings}
          />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          {/* Events tab content will be implemented separately */}
          <p>Events tab content</p>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          {/* Bookings tab content will be implemented separately */}
          <p>Bookings tab content</p>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          {/* Profile tab content will be implemented separately */}
          <p>Profile tab content</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 