import { useMemo } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  event_status: string;
  rate?: number;
  genres?: string[];
  venue?: {
    name: string;
    city?: string;
    state?: string;
  };
}

interface Booking {
  id: string;
  status: string;
  event_id: string;
  musician_id: string;
  proposed_rate?: number;
  created_at: string;
}

interface MusicianAvailableEventsStats {
  totalEvents: number;
  openEvents: number;
  invitedEvents: number;
  appliedEvents: number;
  matchingGenreEvents: number;
  upcomingEvents: number;
  thisWeekEvents: number;
  averageEventRate: number;
  totalPotentialEarnings: number;
  applicationRate: number;
  myApplications: number;
  confirmedFromAvailable: number;
}

export function useMusicianAvailableEventsStats(
  events: Event[],
  bookings: Booking[],
  musicianId?: string,
  musicianGenres?: string[]
): MusicianAvailableEventsStats {
  return useMemo(() => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Basic event counts
    const totalEvents = events.length;
    const openEvents = events.filter(e => e.event_status === 'open').length;
    const invitedEvents = events.filter(e => e.event_status === 'invited').length;
    
    // Events I've applied to
    const myApplications = bookings.filter(b => b.musician_id === musicianId).length;
    const appliedEventIds = bookings
      .filter(b => b.musician_id === musicianId)
      .map(b => b.event_id);
    const appliedEvents = events.filter(e => appliedEventIds.includes(e.id)).length;
    
    // Confirmed bookings from available events
    const confirmedFromAvailable = bookings.filter(b => 
      b.musician_id === musicianId && b.status === 'confirmed'
    ).length;
    
    // Genre matching events
    const matchingGenreEvents = events.filter(event => {
      if (!musicianGenres || !event.genres) return false;
      return event.genres.some(genre => musicianGenres.includes(genre));
    }).length;
    
    // Time-based filtering
    const upcomingEvents = events.filter(event => {
      if (!event.date) return false;
      return new Date(event.date) > now;
    }).length;
    
    const thisWeekEvents = events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= thisWeek;
    }).length;
    
    // Financial calculations
    const eventsWithRates = events.filter(e => e.rate && e.rate > 0);
    const totalPotentialEarnings = eventsWithRates.reduce((sum, event) => 
      sum + (event.rate || 0), 0
    );
    const averageEventRate = eventsWithRates.length > 0 
      ? totalPotentialEarnings / eventsWithRates.length 
      : 0;
    
    // Application rate
    const applicationRate = totalEvents > 0 
      ? (myApplications / totalEvents) * 100 
      : 0;

    return {
      totalEvents,
      openEvents,
      invitedEvents,
      appliedEvents,
      matchingGenreEvents,
      upcomingEvents,
      thisWeekEvents,
      averageEventRate,
      totalPotentialEarnings,
      applicationRate,
      myApplications,
      confirmedFromAvailable
    };
  }, [events, bookings, musicianId, musicianGenres]);
}

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export function createAvailableEventsStats(stats: MusicianAvailableEventsStats): StatItem[] {
  return [
    {
      id: 'totalEvents',
      title: 'Total Events',
      value: stats.totalEvents,
      description: 'All available events',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'openEvents',
      title: 'Open Events',
      value: stats.openEvents,
      description: 'Events open for applications',
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      id: 'invitedEvents',
      title: 'Invited Events',
      value: stats.invitedEvents,
      description: 'Events you\'re invited to',
      icon: 'Star',
      color: 'purple'
    },
    {
      id: 'myApplications',
      title: 'My Applications',
      value: stats.myApplications,
      description: 'Events you\'ve applied to',
      icon: 'FileText',
      color: 'blue'
    },
    {
      id: 'matchingGenreEvents',
      title: 'Genre Matches',
      value: stats.matchingGenreEvents,
      description: 'Events matching your genres',
      icon: 'Music',
      color: 'purple'
    },
    {
      id: 'upcomingEvents',
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      description: 'Events happening in the future',
      icon: 'Clock',
      color: 'yellow'
    },
    {
      id: 'thisWeekEvents',
      title: 'This Week',
      value: stats.thisWeekEvents,
      description: 'Events happening this week',
      icon: 'Calendar',
      color: 'red'
    },
    {
      id: 'averageEventRate',
      title: 'Average Rate',
      value: `$${Math.round(stats.averageEventRate)}`,
      description: 'Average payment per event',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      id: 'totalPotentialEarnings',
      title: 'Potential Earnings',
      value: `$${stats.totalPotentialEarnings.toLocaleString()}`,
      description: 'Total potential from all events',
      icon: 'TrendingUp',
      color: 'green'
    },
    {
      id: 'applicationRate',
      title: 'Application Rate',
      value: `${Math.round(stats.applicationRate)}%`,
      description: 'Percentage of events applied to',
      icon: 'Target',
      color: 'purple'
    },
    {
      id: 'confirmedFromAvailable',
      title: 'Confirmed Bookings',
      value: stats.confirmedFromAvailable,
      description: 'Bookings confirmed from available events',
      icon: 'CheckCircle',
      color: 'green'
    }
  ];
} 