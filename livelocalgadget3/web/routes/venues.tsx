import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Search, MapPin, Star, Filter, X, Users, DollarSign, Music } from "lucide-react";
import { Link } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

interface FilterState {
  searchTerm: string;
  selectedType: string;
  selectedLocation: string;
  selectedCapacity: string;
  selectedPriceRange: string;
  selectedGenre: string;
}

export default function PublicVenuesPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedType: "all",
    selectedLocation: "all",
    selectedCapacity: "all",
    selectedPriceRange: "all",
    selectedGenre: "all"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch venues from database
  const [{ data: venuesData, fetching: venuesFetching, error: venuesError }] = useFindMany(api.venue, {
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      city: true,
      state: true,
      country: true,
      address: true,
      zipCode: true,
      capacity: true,
      priceRange: true,
      rating: true,
      profilePicture: true,
      genres: true,
      isActive: true,
      isVerified: true,
      website: true,
      phone: true,
      email: true,
      owner: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    },
    first: 50,
  });

  const venues: any[] = venuesData || [];

  // Debug: Log venues data
  console.log("Venues data:", venues);
  console.log("Venues count:", venues.length);
  if (venuesError) {
    console.error("Venues error:", venuesError);
  }

  // Get unique venue types for filter
  const venueTypes = Array.from(new Set(
    venues.map(venue => venue.type).filter(Boolean)
  )).sort();

  // Get unique locations for filter
  const locations = Array.from(new Set(
    venues.map(venue => `${venue.city}, ${venue.state}`).filter(Boolean)
  )).sort();

  // Get unique genres for filter
  const genres = Array.from(new Set(
    venues.flatMap(venue => 
      Array.isArray(venue.genres) ? venue.genres : []
    ).filter(Boolean)
  )).sort();

  // Capacity options
  const capacityOptions = [
    { value: "all", label: "Any Capacity" },
    { value: "under50", label: "Under 50" },
    { value: "50to100", label: "50 - 100" },
    { value: "100to300", label: "100 - 300" },
    { value: "300to500", label: "300 - 500" },
    { value: "over500", label: "Over 500" }
  ];

  // Price range options
  const priceRangeOptions = [
    { value: "all", label: "Any Price Range" },
    { value: "$", label: "$ (Budget)" },
    { value: "$$", label: "$$ (Moderate)" },
    { value: "$$$", label: "$$$ (Premium)" },
    { value: "$$$$", label: "$$$$ (Luxury)" }
  ];

  // Filter venues based on search criteria
  const filteredVenues = venues.filter((venue) => {
    // Search term filter
    const matchesSearch = !filters.searchTerm || 
      (venue.name && venue.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (venue.description && venue.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (venue.address && venue.address.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    // Venue type filter
    const matchesType = filters.selectedType === "all" || 
      (venue.type && venue.type.toLowerCase() === filters.selectedType.toLowerCase());
    
    // Location filter
    const matchesLocation = filters.selectedLocation === "all" || 
      (venue.city && venue.state && 
       `${venue.city}, ${venue.state}` === filters.selectedLocation);
    
    // Genre filter
    const matchesGenre = filters.selectedGenre === "all" || 
      (venue.genres && Array.isArray(venue.genres) && 
       venue.genres.some((g: string) => g.toLowerCase() === filters.selectedGenre.toLowerCase()));
    
    // Capacity filter
    let matchesCapacity = true;
    if (filters.selectedCapacity !== "all" && venue.capacity) {
      const capacity = parseInt(venue.capacity);
      switch (filters.selectedCapacity) {
        case "under50":
          matchesCapacity = capacity < 50;
          break;
        case "50to100":
          matchesCapacity = capacity >= 50 && capacity <= 100;
          break;
        case "100to300":
          matchesCapacity = capacity >= 100 && capacity <= 300;
          break;
        case "300to500":
          matchesCapacity = capacity >= 300 && capacity <= 500;
          break;
        case "over500":
          matchesCapacity = capacity > 500;
          break;
      }
    }
    
    // Price range filter
    let matchesPrice = true;
    if (filters.selectedPriceRange !== "all" && venue.priceRange) {
      matchesPrice = venue.priceRange === filters.selectedPriceRange;
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesGenre && matchesCapacity && matchesPrice;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedType: "all",
      selectedLocation: "all",
      selectedCapacity: "all",
      selectedPriceRange: "all",
      selectedGenre: "all"
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.searchTerm || 
    filters.selectedType !== "all" || 
    filters.selectedLocation !== "all" || 
    filters.selectedCapacity !== "all" || 
    filters.selectedPriceRange !== "all" ||
    filters.selectedGenre !== "all";

  // Show loading state while fetching
  if (venuesFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading venues...</p>
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
              <h1 className="text-3xl font-bold">Venues</h1>
              <p className="text-muted-foreground">
                Discover amazing venues for your live music events
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
                  Search & Filter Venues
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
                  <Label htmlFor="search">Search Venues</Label>
                  <Input
                    id="search"
                    placeholder="Venue name, description, or address..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>

                {/* Venue Type */}
                <div>
                  <Label htmlFor="type">Venue Type</Label>
                  <Select value={filters.selectedType} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {venueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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

                {/* Capacity */}
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Select value={filters.selectedCapacity} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCapacity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {capacityOptions.map((option) => (
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
                      <SelectValue placeholder="Any price range" />
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

                {/* Genre */}
                <div>
                  <Label htmlFor="genre">Preferred Genre</Label>
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
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{filters.searchTerm}"
                    </Badge>
                  )}
                  {filters.selectedType !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {filters.selectedType}
                    </Badge>
                  )}
                  {filters.selectedLocation !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Location: {filters.selectedLocation}
                    </Badge>
                  )}
                  {filters.selectedCapacity !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Capacity: {capacityOptions.find(c => c.value === filters.selectedCapacity)?.label}
                    </Badge>
                  )}
                  {filters.selectedPriceRange !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Price: {priceRangeOptions.find(p => p.value === filters.selectedPriceRange)?.label}
                    </Badge>
                  )}
                  {filters.selectedGenre !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Genre: {filters.selectedGenre}
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
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </h2>
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Showing filtered results from {venues.length} total venues
              </p>
            )}
          </div>
        </div>

        {/* Debug Section - Remove this after fixing the issue */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Total venues fetched:</strong> {venues.length}</p>
              <p><strong>Filtered venues:</strong> {filteredVenues.length}</p>
              {venuesError && (
                <p className="text-red-600"><strong>Error:</strong> {venuesError.message}</p>
              )}
              <div>
                <strong>Venue names:</strong>
                <ul className="list-disc list-inside ml-4">
                  {venues.map((venue, index) => (
                    <li key={index}>
                      {venue.name} (ID: {venue.id}, Active: {venue.isActive ? 'Yes' : 'No'})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {venue.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {venue.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {venue.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {venue.type && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{venue.type}</span>
                      </div>
                    )}
                    
                    {venue.city && venue.state && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{venue.city}, {venue.state}</span>
                      </div>
                    )}
                    
                    {venue.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{venue.address}</span>
                      </div>
                    )}
                    
                    {venue.capacity && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {venue.capacity}</span>
                      </div>
                    )}
                    
                    {venue.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{venue.rating}/5</span>
                      </div>
                    )}
                    
                    {venue.priceRange && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{venue.priceRange}</span>
                      </div>
                    )}
                    
                    {venue.genres && Array.isArray(venue.genres) && venue.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {venue.genres.slice(0, 3).map((genre: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Music className="mr-1 h-3 w-3" />
                            {genre}
                          </Badge>
                        ))}
                        {venue.genres.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{venue.genres.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/venue/${venue.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No venues found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search criteria or clearing some filters."
                  : "Check back later for new venues being added."
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