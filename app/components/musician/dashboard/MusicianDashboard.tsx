import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { DashboardHeader } from "./DashboardHeader";
import { OverviewTab } from "./OverviewTab";
import { BookingsTab } from "./BookingsTab";
import { ProfileTab } from "./ProfileTab";
import { MusicianEventsSummaryDashboard } from "../../shared/MusicianEventsSummaryDashboard";
import { useMusicianEventsStats, createMusicianEventStats } from "../../../hooks/useMusicianEventsStats";
import { supabase } from "../../../lib/supabase";
import { Booking } from "./types";

interface MusicianProfile {
  id: string;
  stage_name: string;
  email: string;
  phone?: string;
  bio?: string;
  genres?: string[];
  city?: string;
  state?: string;
  website?: string;
  profile_picture?: string;
  base_rate?: number;
  travel_radius?: number;
}





interface DashboardStats {
  totalApplications: number;
  confirmedBookings: number;
  pendingApplications: number;
  upcomingPerformances: number;
  averageRate: number;
  totalEarnings: number;
}

export const MusicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [musician, setMusician] = useState<MusicianProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    confirmedBookings: 0,
    pendingApplications: 0,
    upcomingPerformances: 0,
    averageRate: 0,
    totalEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Stats customization state with localStorage persistence
  const [showStatsSettings, setShowStatsSettings] = useState(false);
  const [selectedStatIds, setSelectedStatIds] = useState<string[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('musician-dashboard-stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved stats:', error);
        }
      }
    }
    // Default stats if nothing saved
    return ['totalApplications', 'confirmedBookings', 'upcomingPerformances', 'averageRate'];
  });

  // Save to localStorage whenever selectedStatIds changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('musician-dashboard-stats', JSON.stringify(selectedStatIds));
    }
  }, [selectedStatIds]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch musician profile
        const { data: musicianData, error: musicianError } = await supabase
          .from('musicians')
          .select('*')
          .eq('email', user.email)
          .single();

        if (musicianError || !musicianData) {
          setIsLoading(false);
          return;
        }
        setMusician(musicianData);

        // Fetch bookings with event and venue data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            event:events(
              id,
              title,
              date,
              start_time,
              end_time,
              description,
              venue:venues(id, name, city, state)
            )
          `)
          .eq('musician_id', musicianData.id)
          .order('created_at', { ascending: false });

        // Fetch all events for the musician's location (for the BookingsTab)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            venue:venues(id, name, city, state, profile_picture)
          `)
          .order('date', { ascending: true });

        if (!bookingsError && bookingsData) {
          setBookings(bookingsData);
          
          // Calculate dashboard stats
          const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed');
          const pendingApplications = bookingsData.filter(b => b.status === 'applied');
          const upcomingPerformances = confirmedBookings.filter(b => {
            if (!b.event?.date) return false;
            return new Date(b.event.date) > new Date();
          });
          
          const totalEarnings = confirmedBookings.reduce((sum, b) => sum + (b.proposed_rate || 0), 0);
          const averageRate = confirmedBookings.length > 0 
            ? totalEarnings / confirmedBookings.length 
            : 0;

          setStats({
            totalApplications: bookingsData.length,
            confirmedBookings: confirmedBookings.length,
            pendingApplications: pendingApplications.length,
            upcomingPerformances: upcomingPerformances.length,
            averageRate: averageRate,
            totalEarnings: totalEarnings
          });
        }

        if (!eventsError && eventsData) {
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Get different booking categories
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const pendingBookings = bookings.filter(booking => booking.status === 'applied');
  const selectedBookings = bookings.filter(booking => booking.status === 'selected');
  const upcomingBookings = confirmedBookings.filter(booking => {
    if (!booking.event?.date) return false;
    return new Date(booking.event.date) > new Date();
  });

  // Get recent bookings (sorted by applied date)
  const recentBookings = [...bookings]
    .sort((a, b) => {
      const aDate = a.applied_at ? new Date(a.applied_at).getTime() : 0;
      const bDate = b.applied_at ? new Date(b.applied_at).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 5);

  // Handle booking updates
  const handleBookingUpdate = (updatedBooking: Booking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  // Calculate stats using a musician-specific stats hook (to be created)
  const musicianEventsStats = useMusicianEventsStats(bookings, confirmedBookings, pendingBookings);
  const allAvailableStats = createMusicianEventStats(musicianEventsStats);
  const selectedStats = allAvailableStats.filter(stat => selectedStatIds.includes(stat.id));

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!musician) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Musician Dashboard</h1>
        <p>No musician profile found. Please create a musician profile to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader musician={musician} user={user!} />
      
      {/* Customizable Stats Dashboard */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard Stats</h2>
          <Button size="sm" variant="outline" onClick={() => setShowStatsSettings(!showStatsSettings)}>
            Customize
          </Button>
        </div>
        <MusicianEventsSummaryDashboard
          stats={selectedStats}
          maxStats={8}
        />
        {showStatsSettings && (
          <div className="mt-2">
            {/* MusicianStatsSettings component was removed, so this block is now empty */}
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="bookings" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium"
          >
            Bookings
            {(pendingBookings.length > 0 || selectedBookings.length > 0) && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {pendingBookings.length + selectedBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium"
          >
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab 
            musician={musician}
            upcomingEvents={upcomingBookings}
          />
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <BookingsTab 
            bookings={bookings} 
            musician={musician}
            events={events}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab musician={musician} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 