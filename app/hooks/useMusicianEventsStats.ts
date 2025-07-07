import { useMemo } from 'react';

interface Booking {
  id: string;
  status: string;
  proposed_rate?: number;
  created_at: string;
  event?: {
    date?: string;
    title: string;
  };
}

interface MusicianEventsStats {
  totalApplications: number;
  confirmedBookings: number;
  pendingApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
  upcomingPerformances: number;
  completedPerformances: number;
  averageRate: number;
  totalEarnings: number;
  thisMonthApplications: number;
  thisMonthBookings: number;
  applicationSuccessRate: number;
}

export function useMusicianEventsStats(
  allBookings: Booking[],
  confirmedBookings: Booking[],
  pendingBookings: Booking[]
): MusicianEventsStats {
  return useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Basic counts
    const totalApplications = allBookings.length;
    const confirmedCount = confirmedBookings.length;
    const pendingCount = pendingBookings.length;
    const selectedCount = allBookings.filter(b => b.status === 'selected').length;
    const rejectedCount = allBookings.filter(b => b.status === 'rejected').length;
    
    // Performance counts
    const upcomingPerformances = confirmedBookings.filter(booking => {
      if (!booking.event?.date) return false;
      return new Date(booking.event.date) > now;
    }).length;
    
    const completedPerformances = confirmedBookings.filter(booking => {
      if (!booking.event?.date) return false;
      return new Date(booking.event.date) <= now;
    }).length;
    
    // Financial calculations
    const totalEarnings = confirmedBookings.reduce((sum, booking) => 
      sum + (booking.proposed_rate || 0), 0
    );
    const averageRate = confirmedCount > 0 ? totalEarnings / confirmedCount : 0;
    
    // This month statistics
    const thisMonthApplications = allBookings.filter(booking => 
      new Date(booking.created_at) >= thisMonth
    ).length;
    
    const thisMonthBookings = confirmedBookings.filter(booking => 
      new Date(booking.created_at) >= thisMonth
    ).length;
    
    // Success rate calculation
    const applicationSuccessRate = totalApplications > 0 
      ? (confirmedCount / totalApplications) * 100 
      : 0;

    return {
      totalApplications,
      confirmedBookings: confirmedCount,
      pendingApplications: pendingCount,
      selectedApplications: selectedCount,
      rejectedApplications: rejectedCount,
      upcomingPerformances,
      completedPerformances,
      averageRate,
      totalEarnings,
      thisMonthApplications,
      thisMonthBookings,
      applicationSuccessRate
    };
  }, [allBookings, confirmedBookings, pendingBookings]);
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

export function createMusicianEventStats(stats: MusicianEventsStats): StatItem[] {
  return [
    {
      id: 'totalApplications',
      title: 'Total Applications',
      value: stats.totalApplications,
      description: 'All event applications submitted',
      icon: 'FileText',
      color: 'blue'
    },
    {
      id: 'confirmedBookings',
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      description: 'Successfully booked performances',
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      id: 'pendingApplications',
      title: 'Pending Applications',
      value: stats.pendingApplications,
      description: 'Applications awaiting response',
      icon: 'Clock',
      color: 'yellow'
    },
    {
      id: 'selectedApplications',
      title: 'Selected Applications',
      value: stats.selectedApplications,
      description: 'Applications selected by venues',
      icon: 'Star',
      color: 'purple'
    },
    {
      id: 'upcomingPerformances',
      title: 'Upcoming Performances',
      value: stats.upcomingPerformances,
      description: 'Confirmed future performances',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'completedPerformances',
      title: 'Completed Performances',
      value: stats.completedPerformances,
      description: 'Past performances completed',
      icon: 'Music',
      color: 'gray'
    },
    {
      id: 'averageRate',
      title: 'Average Rate',
      value: `$${Math.round(stats.averageRate)}`,
      description: 'Average payment per booking',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      id: 'totalEarnings',
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      description: 'Total earnings from bookings',
      icon: 'TrendingUp',
      color: 'green'
    },
    {
      id: 'thisMonthApplications',
      title: 'This Month Applications',
      value: stats.thisMonthApplications,
      description: 'Applications submitted this month',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'thisMonthBookings',
      title: 'This Month Bookings',
      value: stats.thisMonthBookings,
      description: 'Bookings confirmed this month',
      icon: 'CheckCircle',
      color: 'green'
    },
    {
      id: 'applicationSuccessRate',
      title: 'Success Rate',
      value: `${Math.round(stats.applicationSuccessRate)}%`,
      description: 'Percentage of successful applications',
      icon: 'Target',
      color: 'purple'
    },
    {
      id: 'rejectedApplications',
      title: 'Rejected Applications',
      value: stats.rejectedApplications,
      description: 'Applications that were declined',
      icon: 'XCircle',
      color: 'red'
    }
  ];
} 