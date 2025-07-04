import { SortField, SortDirection, TimeSlot } from './types';

// Helper function to check if genres match
export const doGenresMatch = (eventGenres: string[], musicianGenres: string[]): boolean => {
  if (!eventGenres || eventGenres.length === 0) {
    return true; // If event has no genres, show to all
  }
  if (!musicianGenres || musicianGenres.length === 0) {
    return false; // If musician has no genres, don't show
  }
  
  // Check if there's any overlap between event genres and musician genres
  const hasMatch = eventGenres.some(eventGenre => 
    musicianGenres.some(musicianGenre => 
      musicianGenre.toLowerCase().includes(eventGenre.toLowerCase()) ||
      eventGenre.toLowerCase().includes(musicianGenre.toLowerCase())
    )
  );
  
  return hasMatch;
};

// Helper function to check if event time matches musician availability
export const doesTimeMatchAvailability = (
  eventDate: string, 
  eventStartTime: string, 
  eventEndTime: string, 
  musicianAvailability: any
): boolean => {
  if (!musicianAvailability || typeof musicianAvailability !== 'object') {
    return true; // If no availability set, show all
  }
  
  // Get the day of the week for the event
  const eventDay = new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if musician has availability for this day
  const dayAvailability = musicianAvailability[eventDay] || [];
  
  // If no specific availability for this day, check if there are any recurring slots
  if (dayAvailability.length === 0) {
    // Check if there are any recurring availability slots that might match
    const allDays = Object.keys(musicianAvailability);
    const hasAnyAvailability = allDays.some(day => 
      musicianAvailability[day] && musicianAvailability[day].length > 0
    );
    
    // If musician has some availability set up, but not for this specific day, don't show
    if (hasAnyAvailability) {
      return false;
    }
    
    // If musician hasn't set up any availability, show all events (default behavior)
    return true;
  }
  
  // Check if any time slot overlaps with the event time
  const hasTimeMatch = dayAvailability.some((slot: TimeSlot) => {
    const slotStart = slot.startTime;
    const slotEnd = slot.endTime;
    
    // Simple time overlap check
    return slotStart <= eventEndTime && slotEnd >= eventStartTime;
  });
  
  return hasTimeMatch;
};

// Helper function to get musician's application status for an event
export const getMusicianApplicationStatus = (
  eventId: string, 
  musicianId: string | undefined, 
  bookings: any[]
): { status: string; booking?: any } => {
  if (!musicianId) return { status: "available" };
  
  const booking = bookings.find(booking => 
    booking.event_id === eventId && 
    booking.musician_id === musicianId
  );
  
  if (!booking) return { status: "available" };
  
  return { status: booking.status, booking };
};

// Helper function to get status display info
export const getStatusDisplay = (status: string, booking?: any) => {
  switch (status) {
    case "applied":
      return {
        label: "Application Submitted",
        variant: "default" as const,
        className: "bg-blue-100 text-blue-800",
        icon: "📝"
      };
    case "selected":
      return {
        label: "Venue Selected You - Please Confirm",
        variant: "default" as const,
        className: "bg-yellow-100 text-yellow-800",
        icon: "⭐"
      };
    case "confirmed":
      return {
        label: "Booking Confirmed",
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
        icon: "✅"
      };
    case "pending_cancel":
      const cancelRequestedBy = booking?.cancel_requested_by_role === 'venue' ? 'Venue' : 'You';
      return {
        label: `Cancel Requested by ${cancelRequestedBy} - Awaiting Confirmation`,
        variant: "default" as const,
        className: "bg-orange-100 text-orange-800",
        icon: "⏳"
      };
    case "cancelled":
      const cancelledBy = booking?.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'You';
      const reason = booking?.cancellation_reason ? ` - ${booking.cancellation_reason}` : '';
      return {
        label: `Cancelled by ${cancelledBy}${reason}`,
        variant: "secondary" as const,
        className: "bg-red-100 text-red-800",
        icon: "❌"
      };
    case "completed":
      return {
        label: "Event Completed",
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-800",
        icon: "🎉"
      };
    default:
      return {
        label: "Available",
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-600",
        icon: "🎵"
      };
  }
};

// Get matching musicians for a specific event
export const getMatchingMusicians = (event: any, musicians: any[]): any[] => {
  if (!event.date) {
    // If no specific date, only filter by genres
    return musicians.filter(musician => 
      doGenresMatch(event.genres || [], musician.genres || [])
    );
  }
  
  return musicians.filter(musician => {
    // Check genre matching
    const genresMatch = doGenresMatch(event.genres || [], musician.genres || []);
    
    // Check availability matching
    const timeMatches = doesTimeMatchAvailability(
      event.date, 
      event.start_time || "00:00", 
      event.end_time || "23:59", 
      musician.availability
    );
    
    return genresMatch && timeMatches;
  });
};

// Sort events
export const sortEvents = (
  eventsToSort: any[], 
  sortField: SortField, 
  sortDirection: SortDirection,
  getMusicianApplicationStatus: (eventId: string) => { status: string; booking?: any }
): any[] => {
  return [...eventsToSort].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'date':
        aValue = a.date ? new Date(a.date).getTime() : 0;
        bValue = b.date ? new Date(b.date).getTime() : 0;
        break;
      case 'venue':
        aValue = a.venue?.name || '';
        bValue = b.venue?.name || '';
        break;
      case 'rate':
        aValue = a.rate || 0;
        bValue = b.rate || 0;
        break;
      case 'musicianStatus':
        aValue = getMusicianApplicationStatus(a.id);
        bValue = getMusicianApplicationStatus(b.id);
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}; 