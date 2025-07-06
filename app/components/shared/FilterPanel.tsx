import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Filter, X, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

// Types
export interface FilterOption {
  value: string;
  label: string;
}

export interface DropdownFilterConfig {
  key: string;
  label: string;
  options: string[];
  placeholder?: string;
  searchable?: boolean;
}

export interface FilterConfig {
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
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
  search: string;
  [key: string]: string; // For dynamic dropdown filters
}

interface FilterPanelProps {
  config: FilterConfig;
  onFilterChange: (filters: FilterState) => void;
  showActiveFilters?: boolean;
  initiallyExpanded?: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  config,
  onFilterChange,
  showActiveFilters = true,
  initiallyExpanded = false,
  className = ""
}) => {
  const [showFilters, setShowFilters] = useState(initiallyExpanded);
  const [popoverStates, setPopoverStates] = useState<Record<string, boolean>>({});
  
  // Initialize filter state based on config
  const initializeFilters = (): FilterState => {
    const initialState: FilterState = {
      dateFrom: '',
      dateTo: '',
      status: 'all',
      search: ''
    };
    
    // Add dropdown filters to initial state
    config.dropdowns?.forEach(dropdown => {
      initialState[dropdown.key] = 'all';
    });
    
    return initialState;
  };

  const [filters, setFilters] = useState<FilterState>(initializeFilters);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = initializeFilters();
    setFilters(clearedFilters);
    setPopoverStates({});
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.dateFrom ||
      filters.dateTo ||
      filters.status !== 'all' ||
      filters.search ||
      (config.dropdowns?.some(dropdown => filters[dropdown.key] && filters[dropdown.key] !== 'all') ?? false)
    );
  }, [filters, config.dropdowns]);

  // Toggle popover state
  const togglePopover = (key: string, open: boolean) => {
    setPopoverStates(prev => ({ ...prev, [key]: open }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get filter label for display
  const getFilterLabel = (key: string, value: string): string => {
    if (key === 'status') {
      const statusOption = config.status?.options.find(opt => opt.value === value);
      return statusOption?.label || value;
    }
    
    const dropdownConfig = config.dropdowns?.find(d => d.key === key);
    return dropdownConfig?.label || key;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Filter */}
            {config.search?.enabled && (
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  type="text"
                  placeholder={config.search.placeholder || "Search..."}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            )}

            {/* Date Range Filters */}
            {config.dateRange?.enabled && (
              <>
                <div className="space-y-2">
                  <Label>{config.dateRange.fromLabel || "Date From"}</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="pl-10"
                    />
                    <CalendarIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{config.dateRange.toLabel || "Date To"}</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="pl-10"
                    />
                    <CalendarIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </>
            )}

            {/* Status Filter */}
            {config.status?.enabled && (
              <div className="space-y-2">
                <Label>{config.status.label || "Status"}</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.status.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Dynamic Dropdown Filters */}
            {config.dropdowns?.map((dropdown) => (
              <div key={dropdown.key} className="space-y-2">
                <Label>{dropdown.label}</Label>
                {dropdown.searchable ? (
                  <Popover 
                    open={popoverStates[dropdown.key] || false} 
                    onOpenChange={(open) => togglePopover(dropdown.key, open)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={popoverStates[dropdown.key] || false}
                        className="w-full justify-between"
                      >
                        {filters[dropdown.key] || dropdown.placeholder || `Select ${dropdown.label.toLowerCase()}...`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={`Search ${dropdown.label.toLowerCase()}...`} />
                        <CommandList>
                          <CommandEmpty>No {dropdown.label.toLowerCase()} found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="all"
                              onSelect={() => {
                                handleFilterChange(dropdown.key, 'all');
                                togglePopover(dropdown.key, false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${filters[dropdown.key] === 'all' ? "opacity-100" : "opacity-0"}`}
                              />
                              All {dropdown.label}
                            </CommandItem>
                            {dropdown.options.map((option) => (
                              <CommandItem
                                key={option}
                                value={option}
                                onSelect={() => {
                                  handleFilterChange(dropdown.key, option);
                                  togglePopover(dropdown.key, false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${filters[dropdown.key] === option ? "opacity-100" : "opacity-0"}`}
                                />
                                {option}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Select 
                    value={filters[dropdown.key]} 
                    onValueChange={(value) => handleFilterChange(dropdown.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={dropdown.placeholder || `Select ${dropdown.label.toLowerCase()}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {dropdown.label}</SelectItem>
                      {dropdown.options.filter(option => option && option.trim() !== '').map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          {/* Active Filter Summary */}
          {showActiveFilters && hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.dateFrom && (
                  <Badge variant="secondary">
                    From: {formatDate(filters.dateFrom)}
                  </Badge>
                )}
                {filters.dateTo && (
                  <Badge variant="secondary">
                    To: {formatDate(filters.dateTo)}
                  </Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="secondary">
                    Status: {getFilterLabel('status', filters.status)}
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="secondary">
                    Search: {filters.search}
                  </Badge>
                )}
                {config.dropdowns?.map((dropdown) => (
                  filters[dropdown.key] && filters[dropdown.key] !== 'all' && (
                    <Badge key={dropdown.key} variant="secondary">
                      {dropdown.label}: {filters[dropdown.key]}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}; 