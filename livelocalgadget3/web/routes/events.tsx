import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Search, MapPin, Filter, X, Clock, Music, DollarSign } from "lucide-react";
import { Link } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

interface FilterState {
  searchTerm: string;
  selectedGenre: string;
  selectedDateRange: string;
  selectedLocation: string;
  selectedPriceRange: string;
  startDate: string;
  endDate: string;
}

export default function PublicEventsPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedGenre: "all",
    selectedDateRange: "all",
    selectedLocation: "all",
    selectedPriceRange: "all",
    startDate: "",
    endDate: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events from database
  const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      startTime: true,
      endTime: true,
      category: true,
      ticketPrice: true,
      status: true,
      venue: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true
      },
      musician: {
        id: true,
        name: true,
        stageName: true,
        genre: true,
        profilePicture: true
      }
    },
    first: 50,
  });

  const events: any[] = eventsData || [];

  // Get unique genres for filter
  const genres = Array.from(new Set(
    events.map(event => event.category).filter(Boolean)
  )).sort();

  // Get unique locations for filter
  const locations = Array.from(new Set(
    events.map(event => `${event.venue?.city}, ${event.venue?.state}`).filter(Boolean)
  )).sort();

  // Date range options
  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "custom", label: "Custom Range" }
  ];

  // Price range options
  const priceRangeOptions = [
    { value: "all", label: "Any Price" },
    { value: "free", label: "Free" },
    { value: "under25", label: "Under $25" },
    { value: "25to50", label: "$25 - $50" },
    { value: "50to100", label: "$50 - $100" },
    { value: "over100", label: "Over $100" }
  ];

  // Filter events based on search criteria
  const filteredEvents = events.filter((event) => {
    // Search term filter
    const matchesSearch = !filters.searchTerm || 
      (event.title && event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (event.venue?.name && event.venue.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (event.musician?.stageName && event.musician.stageName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (event.musician?.name && event.musician.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    // Genre filter
    const matchesGenre = filters.selectedGenre === "all" || 
      (event.category && event.category.toLowerCase() === filters.selectedGenre.toLowerCase());
    
    // Location filter
    const matchesLocation = filters.selectedLocation === "all" || 
      (event.venue?.city && event.venue?.state && 
       `${event.venue.city}, ${event.venue.state}` === filters.selectedLocation);
    
    // Price filter
    let matchesPrice = true;
    if (filters.selectedPriceRange !== "all" && event.ticketPrice !== null) {
      const price = parseFloat(event.ticketPrice);
      switch (filters.selectedPriceRange) {
        case "free":
          matchesPrice = price === 0;
          break;
        case "under25":
          matchesPrice = price < 25;
          break;
        case "25to50":
          matchesPrice = price >= 25 && price <= 50;
          break;
        case "50to100":
          matchesPrice = price >= 50 && price <= 100;
          break;
        case "over100":
          matchesPrice = price > 100;
          break;
      }
    }
    
    // Date filter
    let matchesDate = true;
    if (filters.selectedDateRange !== "all" && event.date) {
      const eventDate = new Date(event.date);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      switch (filters.selectedDateRange) {
        case "today":
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case "week":
          matchesDate = eventDate >= startOfWeek && eventDate <= endOfWeek;
          break;
        case "month":
          matchesDate = eventDate >= startOfMonth && eventDate <= endOfMonth;
          break;
        case "custom":
          if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            matchesDate = eventDate >= startDate && eventDate <= endDate;
          }
          break;
      }
    }
    
    return matchesSearch && matchesGenre && matchesLocation && matchesPrice && matchesDate;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedGenre: "all",
      selectedDateRange: "all",
      selectedLocation: "all",
      selectedPriceRange: "all",
      startDate: "",
      endDate: ""
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.searchTerm || 
    filters.selectedGenre !== "all" || 
    filters.selectedDateRange !== "all" || 
    filters.selectedLocation !== "all" || 
    filters.selectedPriceRange !== "all" ||
    filters.startDate ||
    filters.endDate;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Show loading state while fetching
  if (eventsFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Live Events</h1>
              <p className="text-muted-foreground">
                Discover amazing live music events near you
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Events
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Events</Label>
                  <Input
                    id="search"
                    placeholder="Event title, venue, or artist..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>

                {/* Genre */}
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={filters.selectedGenre} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedGenre: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={filters.selectedLocation} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedLocation: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={filters.selectedDateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedDateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All dates" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select value={filters.selectedPriceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedPriceRange: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Date Range */}
              {filters.selectedDateRange === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{filters.searchTerm}"
                    </Badge>
                  )}
                  {filters.selectedGenre !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Genre: {filters.selectedGenre}
                    </Badge>
                  )}
                  {filters.selectedLocation !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Location: {filters.selectedLocation}
                    </Badge>
                  )}
                  {filters.selectedDateRange !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Date: {dateRangeOptions.find(d => d.value === filters.selectedDateRange)?.label}
                    </Badge>
                  )}
                  {filters.selectedPriceRange !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Price: {priceRangeOptions.find(p => p.value === filters.selectedPriceRange)?.label}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </h2>
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Showing filtered results from {events.length} total events
              </p>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    )}
                    
                    {event.startTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(event.startTime)}
                          {event.endTime && ` - ${formatTime(event.endTime)}`}
                        </span>
                      </div>
                    )}
                    
                    {event.venue?.name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.venue.name}</span>
                      </div>
                    )}
                    
                    {event.venue?.city && event.venue?.state && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.venue.city}, {event.venue.state}</span>
                      </div>
                    )}
                    
                    {event.musician?.stageName && (
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <span>{event.musician.stageName}</span>
                      </div>
                    )}
                    
                    {event.category && (
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    )}
                    
                    {event.ticketPrice !== null && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          ${parseFloat(event.ticketPrice).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/event/${event.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search criteria or clearing some filters."
                  : "Check back later for new events being added."
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 