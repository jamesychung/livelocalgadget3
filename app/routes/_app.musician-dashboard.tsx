import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { BookingDetailDialog } from '../components/shared/BookingDetailDialog';
import {
  DashboardHeader,
  DashboardStats,
  OverviewTab,
  BookingsTab,
  ProfileTab,
  Booking
} from '../components/musician/dashboard';

export default function MusicianDashboard() {
  const context = useOutletContext<AuthOutletContext>();
  const user = context?.user;
  const [isLoading, setIsLoading] = useState(true);
  const [musician, setMusician] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const refreshBookings = async () => {
    if (!musician?.id) return;
    
    console.log('Refreshing bookings for musician:', musician.id);
    setIsRefreshing(true);
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          event:events (
            id,
            title,
            date,
            start_time,
            end_time,
            description,
            created_at,
            venue:venues (
              id, 
              name, 
              address,
              city,
              state
            )
          ),
          musician:musicians (
            id,
            stage_name,
            email
          )
        `)
        .eq('musician_id', musician.id);

      if (bookingsError) {
        console.error("Error refreshing bookings data:", bookingsError);
      } else {
        console.log('Bookings refreshed successfully:', bookingsData);
        console.log('Current bookings statuses:', bookingsData?.map(b => ({ id: b.id, status: b.status, event: b.event?.title })));
        setBookings(bookingsData || []);
        setLastRefreshTime(new Date());
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle booking click to view details
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  // Handle booking status update
  const handleBookingStatusUpdate = (updatedBooking: Booking) => {
    setBookings(prevBookings => 
      prevBookings.map(b => 
        b.id === updatedBooking.id 
          ? updatedBooking
          : b
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) {
          setError("User not found");
          setIsLoading(false);
          return;
        }

        // Check if user has a musician profile
        const { data: musicianData, error: musicianError } = await supabase
          .from('musicians')
          .select('*')
          .eq('email', user.email)
          .single();

        if (musicianError) {
          console.error("Error loading musician data:", musicianError);
          setError("Could not load musician profile");
          setIsLoading(false);
          return;
        }

        setMusician(musicianData);

        // If musician profile exists, fetch bookings
        if (musicianData?.id) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              event:events (
                id,
                title,
                date,
                start_time,
                end_time,
                description,
                created_at,
                venue:venues (
                  id, 
                  name, 
                  address,
                  city,
                  state
                )
              ),
              musician:musicians (
                id,
                stage_name,
                email
              )
            `)
            .eq('musician_id', musicianData.id);

          if (bookingsError) {
            console.error("Error loading bookings data:", bookingsError);
          } else {
            setBookings(bookingsData || []);
            setLastRefreshTime(new Date());
          }
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Auto-refresh bookings every 30 seconds to check for status updates
  useEffect(() => {
    if (!musician?.id) return;

    const interval = setInterval(() => {
      refreshBookings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [musician?.id]);

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your musician dashboard...</p>
        </div>
      </div>
    );
  }

  // If error occurred
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If no musician profile found after loading, show a message with option to create one
  if (!musician) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Musician Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't created your musician profile yet. Create your profile to start managing your bookings, events, and availability.
          </p>
          <Button asChild>
            <Link to="/musician-profile/create">
              Create Musician Profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const upcomingEvents = bookings.filter((b) => b.event?.date && new Date(b.event.date) > new Date()) ?? [];
  const bookingsNeedingAttention = bookings.filter((b) => b.status === 'selected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <DashboardHeader 
        musician={musician}
        user={user}
        lastRefreshTime={lastRefreshTime}
        bookingsNeedingAttention={bookingsNeedingAttention}
        isRefreshing={isRefreshing}
        refreshBookings={refreshBookings}
      />

      <DashboardStats 
        musician={musician}
        bookingsNeedingAttention={bookingsNeedingAttention}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab 
            musician={musician}
            upcomingEvents={upcomingEvents}
          />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsTab 
            bookings={bookings}
            user={user}
            handleBookingClick={handleBookingClick}
            handleBookingStatusUpdate={handleBookingStatusUpdate}
          />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab musician={musician} />
        </TabsContent>
      </Tabs>
      
      {/* Booking Detail Dialog with Activity Log */}
      <BookingDetailDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        booking={selectedBooking}
        currentUser={user}
        onStatusUpdate={handleBookingStatusUpdate}
      />
    </div>
  );
} 
