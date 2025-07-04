export interface TimeSlot {
  startTime: string;
  endTime: string;
  date?: string;
  recurringDays?: string[];
  recurringEndDate?: string;
}

export type SortField = 'date' | 'venue' | 'rate' | 'musicianStatus';
export type SortDirection = 'asc' | 'desc';

export interface EventSummaryProps {
  invitedEvents: number;
  openEvents: number;
  totalEvents: number;
}

export interface EventSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export interface EventsTableProps {
  events: any[];
  bookings: any[];
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  handleRowClick: (event: any) => void;
  handleViewBookingDetails: (booking: any) => void;
  user: any;
  getMusicianApplicationStatus: (eventId: string) => { status: string; booking?: any };
  getStatusDisplay: (status: string, booking?: any) => any;
}

export interface EventDetailDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedEvent: any | null;
  user: any;
  bookings: any[];
  musicians: any[];
  handleApply: () => void;
  handleNotInterested: () => void;
  handleMessageVenue: () => void;
  handleViewBookingDetails: (booking: any) => void;
  handleBookingStatusUpdate: (updatedBooking: any) => void;
  getMusicianApplicationStatus: (eventId: string) => { status: string; booking?: any };
  getMatchingMusicians: (event: any) => any[];
}

export interface EventUtilsProps {
  doGenresMatch: (eventGenres: string[], musicianGenres: string[]) => boolean;
  doesTimeMatchAvailability: (eventDate: string, eventStartTime: string, eventEndTime: string, musicianAvailability: any) => boolean;
  getMusicianApplicationStatus: (eventId: string, userId: string, bookings: any[]) => { status: string; booking?: any };
  getStatusDisplay: (status: string, booking?: any) => any;
  getMatchingMusicians: (event: any, musicians: any[]) => any[];
  sortEvents: (events: any[], sortField: SortField, sortDirection: SortDirection, getMusicianApplicationStatus: any) => any[];
} 