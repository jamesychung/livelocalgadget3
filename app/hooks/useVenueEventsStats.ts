import { useMemo } from 'react';
import { Calendar, Users, Clock, TrendingUp, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import type { VenueEventStat } from '../components/shared/VenueEventsSummaryDashboard';

interface VenueEventsStats {
  totalEvents: number;
  eventsWithApplications: number;
  totalApplications: number;
  pendingApplications: number;
  eventsThisMonth: number;
  upcomingEvents: number;
  cancelRequests: number;
  averageRating: number;
  totalReviews: number;
}

export const useVenueEventsStats = (
  allEvents: any[],
  venueBookings: any[],
  pendingApplicationsList: any[]
): VenueEventsStats => {
  return useMemo(() => {
    const totalEvents = allEvents.length;
    
    const eventsWithApplications = allEvents.filter(event => 
      venueBookings.some(booking => booking.event?.id === event.id)
    ).length;
    
    const totalApplications = venueBookings.length;
    const pendingApplications = pendingApplicationsList.length;
    
    const eventsThisMonth = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && 
             eventDate.getFullYear() === now.getFullYear();
    }).length;

    const upcomingEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate > now && (event.eventStatus === 'open' || event.eventStatus === 'confirmed');
    }).length;

    // Calculate cancel requests (bookings with cancel_requested status)
    const cancelRequests = venueBookings.filter(booking => 
      booking.status === 'cancel_requested'
    ).length;

    // Calculate average rating and total reviews
    const reviews = venueBookings.filter(booking => booking.rating && booking.rating > 0);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, booking) => sum + (booking.rating || 0), 0) / totalReviews 
      : 0;

    return {
      totalEvents,
      eventsWithApplications,
      totalApplications,
      pendingApplications,
      eventsThisMonth,
      upcomingEvents,
      cancelRequests,
      averageRating,
      totalReviews
    };
  }, [allEvents, venueBookings, pendingApplicationsList]);
};

// Helper function to create stat objects for the dashboard
export const createVenueEventStats = (stats: VenueEventsStats): VenueEventStat[] => {
  return [
    {
      id: "totalEvents",
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      description: "All events created",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      priority: 1
    },
    {
      id: "eventsWithApplications",
      title: "Events with Applications",
      value: stats.eventsWithApplications,
      icon: Users,
      description: "Events receiving interest",
      color: "bg-green-50 text-green-700 border-green-200",
      priority: 2
    },
    {
      id: "totalApplications",
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      description: "Musician applications",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      priority: 3
    },
    {
      id: "pendingReviews",
      title: "Pending Reviews",
      value: stats.pendingApplications,
      icon: Clock,
      description: "Applications to review",
      color: stats.pendingApplications > 0 ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-gray-50 text-gray-700 border-gray-200",
      priority: 10 // High priority when there are pending reviews
    },
    {
      id: "eventsThisMonth",
      title: "Events This Month",
      value: stats.eventsThisMonth,
      icon: TrendingUp,
      description: "Current month events",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      priority: 4
    },
    {
      id: "upcomingEvents",
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: CheckCircle,
      description: "Future confirmed events",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      priority: 5
    },
    {
      id: "cancelRequests",
      title: "Cancel Requests",
      value: stats.cancelRequests,
      icon: AlertTriangle,
      description: "Pending cancellation requests",
      color: stats.cancelRequests > 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-700 border-gray-200",
      priority: 9 // High priority when there are cancel requests
    },
    {
      id: "averageRating",
      title: "Average Rating",
      value: Math.round(stats.averageRating * 10) / 10, // Round to 1 decimal place
      icon: Star,
      description: `${stats.totalReviews} total reviews`,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      priority: 6
    },
    {
      id: "totalReviews",
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      description: "Reviews received",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      priority: 7
    }
  ];
}; 