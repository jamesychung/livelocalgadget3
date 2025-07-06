# FilterPanel Component

A reusable, configurable filter component that provides a consistent filtering interface across the application.

## Features

- **Configurable Filter Types**: Search, date range, status dropdown, and custom dropdowns
- **Searchable Dropdowns**: Support for both simple and searchable dropdown filters
- **Active Filter Display**: Shows applied filters as badges
- **Collapsible Interface**: Show/hide filters with toggle button
- **Clear Filters**: One-click clear all filters functionality
- **TypeScript Support**: Fully typed with proper interfaces

## Basic Usage

```tsx
import { FilterPanel, FilterState } from './FilterPanel';
import { useFilters, filterFunctions } from '../../hooks/useFilters';

const MyComponent = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    // Add any custom filter keys here
  });

  return (
    <FilterPanel
      config={{
        search: { enabled: true, placeholder: "Search..." },
        dateRange: { enabled: true },
        status: {
          enabled: true,
          options: [
            { value: 'all', label: 'All Items' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ]
        }
      }}
      onFilterChange={setFilters}
    />
  );
};
```

## Configuration Options

### FilterConfig Interface

```tsx
interface FilterConfig {
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  dateRange?: {
    enabled: boolean;
    fromLabel?: string;
    toLabel?: string;
  };
  status?: {
    enabled: boolean;
    options: FilterOption[];
    label?: string;
  };
  dropdowns?: DropdownFilterConfig[];
}
```

### Dropdown Configuration

```tsx
interface DropdownFilterConfig {
  key: string;           // Unique key for the filter
  label: string;         // Display label
  options: string[];     // Available options
  placeholder?: string;  // Placeholder text
  searchable?: boolean;  // Enable search within dropdown
}
```

## Filter Types

### 1. Search Filter

```tsx
search: {
  enabled: true,
  placeholder: "Search events, venues, or descriptions..."
}
```

### 2. Date Range Filter

```tsx
dateRange: {
  enabled: true,
  fromLabel: "Start Date",
  toLabel: "End Date"
}
```

### 3. Status Filter

```tsx
status: {
  enabled: true,
  label: "Status",
  options: [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]
}
```

### 4. Dropdown Filters

```tsx
dropdowns: [
  {
    key: 'musician',
    label: 'Musician',
    options: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    searchable: true,
    placeholder: "Select musician..."
  },
  {
    key: 'genre',
    label: 'Genre',
    options: ['Jazz', 'Rock', 'Pop', 'Classical'],
    searchable: false
  }
]
```

## Using with Data Filtering

### 1. Create Filter Function

```tsx
const eventFilterFunction = (event: Event, filters: FilterState): boolean => {
  // Date range filter
  if (!filterFunctions.dateRange(event.date, filters)) return false;
  
  // Status filter
  if (!filterFunctions.status(event.status, filters)) return false;
  
  // Search filter
  const searchFields = [event.title, event.venue?.name];
  if (!filterFunctions.search(searchFields, filters)) return false;
  
  // Custom dropdown filter
  if (!filterFunctions.dropdown(event.venue?.name, 'venue', filters)) return false;
  
  return true;
};
```

### 2. Use Filter Hook

```tsx
const { filteredData, totalCount, filteredCount } = useFilters({
  data: events,
  filters,
  filterFunction: eventFilterFunction
});
```

## Complete Example

```tsx
import React, { useState, useMemo } from 'react';
import { FilterPanel, FilterState } from './FilterPanel';
import { useFilters, filterFunctions } from '../../hooks/useFilters';

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'open' | 'completed' | 'cancelled';
  venue?: { name: string };
}

const EventListWithFilters: React.FC = () => {
  const [events] = useState<Event[]>([
    { id: '1', title: 'Jazz Night', date: '2024-01-15', status: 'completed', venue: { name: 'Blue Note' } },
    { id: '2', title: 'Rock Concert', date: '2024-01-20', status: 'open', venue: { name: 'The Venue' } },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    search: '',
    venue: ''
  });

  // Get unique venues for dropdown
  const uniqueVenues = useMemo(() => {
    return Array.from(new Set(events.map(e => e.venue?.name).filter(Boolean))) as string[];
  }, [events]);

  // Define filter function
  const eventFilterFunction = (event: Event, filters: FilterState): boolean => {
    if (!filterFunctions.dateRange(event.date, filters)) return false;
    if (!filterFunctions.status(event.status, filters)) return false;
    
    const searchFields = [event.title, event.venue?.name];
    if (!filterFunctions.search(searchFields, filters)) return false;
    
    if (!filterFunctions.dropdown(event.venue?.name, 'venue', filters)) return false;
    
    return true;
  };

  // Use filter hook
  const { filteredData: filteredEvents } = useFilters({
    data: events,
    filters,
    filterFunction: eventFilterFunction
  });

  return (
    <div className="space-y-6">
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
              searchable: true,
              placeholder: "Select venue..."
            }
          ]
        }}
        onFilterChange={setFilters}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Events ({filteredEvents.length})
        </h3>
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
```

## Filter Functions

The `filterFunctions` object provides common filter utilities:

### dateRange
```tsx
filterFunctions.dateRange(itemDate, filters)
```

### status
```tsx
filterFunctions.status(itemStatus, filters)
```

### search
```tsx
filterFunctions.search(searchFields, filters)
```

### dropdown
```tsx
filterFunctions.dropdown(itemValue, filterKey, filters)
```

## Props

### FilterPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `FilterConfig` | required | Filter configuration object |
| `onFilterChange` | `(filters: FilterState) => void` | required | Callback when filters change |
| `showActiveFilters` | `boolean` | `true` | Show active filter badges |
| `className` | `string` | `""` | Additional CSS classes |

### FilterState

```tsx
interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
  search: string;
  [key: string]: string; // For custom dropdown filters
}
```

## Migration from EventHistoryPage

If you're migrating from the old embedded filter logic:

1. **Replace filter state**:
   ```tsx
   // Old
   const [filters, setFilters] = useState({
     dateFrom: '',
     dateTo: '',
     status: 'all',
     // ... other filters
   });

   // New
   const [filters, setFilters] = useState<FilterState>({
     dateFrom: '',
     dateTo: '',
     status: 'all',
     search: '',
     // ... other filters
   });
   ```

2. **Replace filter UI**:
   ```tsx
   // Old - 200+ lines of filter UI code
   
   // New
   <FilterPanel
     config={filterConfig}
     onFilterChange={setFilters}
   />
   ```

3. **Replace filter logic**:
   ```tsx
   // Old - manual filter logic in useMemo
   
   // New
   const { filteredData } = useFilters({
     data: events,
     filters,
     filterFunction: eventFilterFunction
   });
   ```

## Best Practices

1. **Memoize dropdown options** to prevent unnecessary re-renders
2. **Use specific filter functions** for complex filtering logic
3. **Keep filter state minimal** - only include necessary filter keys
4. **Use TypeScript** for better type safety and autocomplete
5. **Test filter combinations** to ensure they work correctly together

## Examples

See `FilterPanelExample.tsx` for complete working examples of different filter configurations. 