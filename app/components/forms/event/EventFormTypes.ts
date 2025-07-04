// Types for event form components

export interface Equipment {
  item: string;
  venueProvides: boolean;
  musicianProvides: boolean;
  notes: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  rate: string;
  totalCapacity: string;
  category: string;
  ticketType: string;
  isPublic: boolean;
  isActive: boolean;
  eventStatus: string;
  eventType: string;
  musicianId: string;
  genres: string[];
  equipment: Equipment[];
  isRecurring: boolean;
  recurringPattern: string;
  recurringInterval: number;
  recurringEndDate: string;
  recurringDays: string[];
}

export interface FormSectionProps {
  eventForm: EventFormData;
  handleInputChange?: (field: string, value: string | boolean | string[] | number) => void;
  handleGenreChange?: (genre: string, checked: boolean) => void;
  handleEquipmentChange?: (itemIndex: number, provider: 'venueProvides' | 'musicianProvides', checked: boolean) => void;
  handleRecurringDayChange?: (day: string, checked: boolean) => void;
  handleRecurringToggle?: (checked: boolean) => void;
  timeOptions?: string[];
  availableGenres?: string[];
  musicians?: any[];
} 