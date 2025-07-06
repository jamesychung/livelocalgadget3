import React, { useState } from 'react';
import { FilterPanel, FilterState } from './FilterPanel';
import { useFilters, filterFunctions } from '../../hooks/useFilters';

// Example data types
interface Event {
  id: string;
  title: string;
  date: string;
  status: 'open' | 'completed' | 'cancelled';
  venue?: { name: string };
  musician?: { stage_name: string };
}

interface Musician {
  id: string;
  stage_name: string;
  genre: string;
  city: string;
  bio: string;
}

// Example 1: Event History Filter
export const EventHistoryFilterExample: React.FC = () => {
  const [events] = useState<Event[]>([
    { id: '1', title: 'Jazz Night', date: '2024-01-15', status: 'completed', venue: { name: 'Blue Note' } },
    { id: '2', title: 'Rock Concert', date: '2024-01-20', status: 'cancelled', venue: { name: 'The Venue' } },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    venue: ''
  });

  // Define how to filter events
  const eventFilterFunction = (event: Event, filters: FilterState): boolean => {
    // Date range filter
    if (!filterFunctions.dateRange(event.date, filters)) return false;
    
    // Status filter
    if (!filterFunctions.status(event.status, filters)) return false;
    
    // Search filter
    const searchFields = [event.title, event.venue?.name];
    if (!filterFunctions.search(searchFields, filters)) return false;
    
    // Venue filter
    if (!filterFunctions.dropdown(event.venue?.name, 'venue', filters)) return false;
    
    return true;
  };

  // Get unique venues for filter dropdown
  const uniqueVenues = Array.from(new Set(events.map(e => e.venue?.name).filter(Boolean))) as string[];

  // Use the filter hook
  const { filteredData: filteredEvents } = useFilters({
    data: events,
    filters,
    filterFunction: eventFilterFunction
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event History Filter Example</h2>
      
      <FilterPanel
        config={{
          search: {
            enabled: true,
            placeholder: "Search events..."
          },
          dateRange: {
            enabled: true,
            fromLabel: "From Date",
            toLabel: "To Date"
          },
          status: {
            enabled: true,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]
          },
          dropdowns: [
            {
              key: 'venue',
              label: 'Venue',
              options: uniqueVenues,
              searchable: true
            }
          ]
        }}
        onFilterChange={setFilters}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Filtered Events ({filteredEvents.length})</h3>
        {filteredEvents.map(event => (
          <div key={event.id} className="p-4 border rounded-lg">
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-gray-600">
              {event.date} • {event.venue?.name} • {event.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 2: Simple Search and Status Filter
export const SimpleFilterExample: React.FC = () => {
  const [musicians] = useState<Musician[]>([
    { id: '1', stage_name: 'Jazz Master', genre: 'Jazz', city: 'New York', bio: 'Professional jazz musician' },
    { id: '2', stage_name: 'Rock Star', genre: 'Rock', city: 'Los Angeles', bio: 'Rock guitarist and vocalist' },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    genre: ''
  });

  const musicianFilterFunction = (musician: Musician, filters: FilterState): boolean => {
    // Search filter
    const searchFields = [musician.stage_name, musician.city, musician.bio];
    if (!filterFunctions.search(searchFields, filters)) return false;
    
    // Genre filter
    if (!filterFunctions.dropdown(musician.genre, 'genre', filters)) return false;
    
    return true;
  };

  const uniqueGenres = Array.from(new Set(musicians.map(m => m.genre)));

  const { filteredData: filteredMusicians } = useFilters({
    data: musicians,
    filters,
    filterFunction: musicianFilterFunction
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Simple Filter Example</h2>
      
      <FilterPanel
        config={{
          search: {
            enabled: true,
            placeholder: "Search musicians..."
          },
          dropdowns: [
            {
              key: 'genre',
              label: 'Genre',
              options: uniqueGenres,
              searchable: false
            }
          ]
        }}
        onFilterChange={setFilters}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Filtered Musicians ({filteredMusicians.length})</h3>
        {filteredMusicians.map(musician => (
          <div key={musician.id} className="p-4 border rounded-lg">
            <h4 className="font-medium">{musician.stage_name}</h4>
            <p className="text-sm text-gray-600">
              {musician.genre} • {musician.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 3: Custom Filter Configuration
export const CustomFilterExample: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    priority: '',
    category: ''
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Custom Filter Configuration</h2>
      
      <FilterPanel
        config={{
          search: {
            enabled: true,
            placeholder: "Search anything..."
          },
          dateRange: {
            enabled: true,
            fromLabel: "Start Date",
            toLabel: "End Date"
          },
          status: {
            enabled: true,
            label: "Priority",
            options: [
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' }
            ]
          },
          dropdowns: [
            {
              key: 'category',
              label: 'Category',
              options: ['Music', 'Art', 'Theater', 'Dance'],
              searchable: false,
              placeholder: "Select category..."
            },
            {
              key: 'location',
              label: 'Location',
              options: ['New York', 'Los Angeles', 'Chicago', 'Miami'],
              searchable: true,
              placeholder: "Search locations..."
            }
          ]
        }}
        onFilterChange={setFilters}
        showActiveFilters={true}
        className="mb-6"
      />

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Current Filter State:</h3>
        <pre className="text-sm text-gray-700">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}; 