import { useMemo } from 'react';
import { FilterState } from '../components/shared/FilterPanel';

export interface FilterFunction<T> {
  (item: T, filters: FilterState): boolean;
}

export interface UseFiltersProps<T> {
  data: T[];
  filters: FilterState;
  filterFunction: FilterFunction<T>;
}

export interface UseFiltersReturn<T> {
  filteredData: T[];
  totalCount: number;
  filteredCount: number;
}

/**
 * Custom hook to handle data filtering with the FilterPanel component
 * @param data - Array of data to filter
 * @param filters - Current filter state
 * @param filterFunction - Function to determine if an item matches the filters
 * @returns Object containing filtered data and counts
 */
export function useFilters<T>({
  data,
  filters,
  filterFunction
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  const filteredData = useMemo(() => {
    return data.filter(item => filterFunction(item, filters));
  }, [data, filters, filterFunction]);

  return {
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length
  };
}

/**
 * Common filter functions for different data types
 */
export const filterFunctions = {
  /**
   * Generic date range filter
   */
  dateRange: (itemDate: string | Date, filters: FilterState): boolean => {
    if (!itemDate) return true;
    
    const date = new Date(itemDate);
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (date < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      if (date > toDate) return false;
    }
    
    return true;
  },

  /**
   * Generic status filter
   */
  status: (itemStatus: string, filters: FilterState): boolean => {
    if (filters.status === 'all') return true;
    return itemStatus === filters.status;
  },

  /**
   * Generic search filter (searches multiple fields)
   */
  search: (searchFields: (string | undefined)[], filters: FilterState): boolean => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return searchFields.some(field => 
      field?.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Generic dropdown filter
   */
  dropdown: (itemValue: string | undefined, filterKey: string, filters: FilterState): boolean => {
    const filterValue = filters[filterKey];
    if (!filterValue || filterValue === 'all') return true;
    return itemValue === filterValue;
  }
};

/**
 * Helper function to create filter configurations for common use cases
 */
export const createFilterConfig = {
  /**
   * Create a basic event history filter config
   */
  eventHistory: (uniqueMusicians: string[], uniqueVenues: string[], cancellationReasons: Record<string, string>) => ({
    dateRange: {
      enabled: true,
      fromLabel: "Date From",
      toLabel: "Date To"
    },
    status: {
      enabled: true,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    dropdowns: [
      {
        key: 'musician',
        label: 'Musician',
        options: uniqueMusicians,
        searchable: true
      },
      {
        key: 'venue',
        label: 'Venue',
        options: uniqueVenues,
        searchable: true
      },
      {
        key: 'cancellationReason',
        label: 'Cancellation Reason',
        options: Object.entries(cancellationReasons).map(([key, label]) => ({ value: key, label })),
        searchable: false
      }
    ]
  }),

  /**
   * Create a basic search and status filter config
   */
  searchAndStatus: (statusOptions: Array<{ value: string; label: string }>) => ({
    search: {
      enabled: true,
      placeholder: "Search..."
    },
    status: {
      enabled: true,
      options: statusOptions
    }
  }),

  /**
   * Create a musician search filter config
   */
  musicianSearch: (genres: string[]) => ({
    search: {
      enabled: true,
      placeholder: "Search by name, location, or bio..."
    },
    dropdowns: [
      {
        key: 'genre',
        label: 'Genre',
        options: genres,
        searchable: false
      }
    ]
  })
}; 