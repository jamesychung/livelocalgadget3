import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Search, MapPin, Star, Filter, X } from "lucide-react";
import { Link } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

interface FilterState {
  searchTerm: string;
  selectedGenre: string;
  selectedDistance: string;
  zipCode: string;
}

export default function PublicMusiciansPage() {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: "",
        selectedGenre: "all",
        selectedDistance: "all",
        zipCode: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    // Fetch musicians
    const [{ data: musiciansData, fetching: musiciansFetching, error: musiciansError }] = useFindMany(api.musician, {
        select: {
            id: true,
            name: true,
            stageName: true,
            bio: true,
            genre: true,
            genres: true,
            city: true,
            state: true,
            country: true,
            rating: true,
            hourlyRate: true,
            profilePicture: true,
            instruments: true,
            isActive: true,
            isVerified: true,
            totalGigs: true,
            yearsExperience: true
        },
        // Temporarily removed isActive filter to see all musicians
        first: 50,
    });

    const musicians: any[] = musiciansData || [];

    // Debug: Check for your musician profile
    const yourMusician = musicians.find(m => 
        m.stageName === 'sad' || 
        m.name === 'sad'
    );
    
    console.log("=== DEBUGGING YOUR MUSICIAN ===");
    console.log("Total musicians fetched:", musicians.length);
    console.log("Your musician found:", yourMusician);
    console.log("All musicians:", musicians.map(m => ({ id: m.id, name: m.name, stageName: m.stageName, isActive: m.isActive })));

    // Get unique genres for filter
    const genres = Array.from(new Set(
        musicians.flatMap((m) => [
            m.genre,
            ...(Array.isArray(m.genres) ? m.genres : [])
        ].filter(Boolean))
    )).sort();

    // Distance options
    const distanceOptions = [
        { value: "all", label: "Any Distance" },
        { value: "10", label: "Up to 10 miles" },
        { value: "25", label: "11-25 miles" },
        { value: "50", label: "26-50 miles" }
    ];

    // Calculate distance between two locations (simplified - in real app you'd use a geocoding service)
    const calculateDistance = (location1: string, location2: string): number => {
        // This is a simplified distance calculation
        // In a real application, you'd use a geocoding service like Google Maps API
        // For now, we'll use a simple string similarity as a proxy
        if (!location1 || !location2) return Infinity;
        
        const loc1 = location1.toLowerCase();
        const loc2 = location2.toLowerCase();
        
        // If same city/state, distance is 0
        if (loc1 === loc2) return 0;
        
        // If same state but different city, distance is 25
        const state1 = loc1.split(',').pop()?.trim();
        const state2 = loc2.split(',').pop()?.trim();
        if (state1 && state2 && state1 === state2) return 25;
        
        // Otherwise, distance is 50+
        return 50;
    };

    // Filter musicians based on search criteria
    const filteredMusicians = musicians.filter((musician) => {
        // Search term filter
        const matchesSearch = !filters.searchTerm || 
            (musician.stageName && musician.stageName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
            (musician.name && musician.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
            (musician.bio && musician.bio.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        
        // Genre filter
        const matchesGenre = filters.selectedGenre === "all" || 
            (musician.genre && musician.genre.toLowerCase() === filters.selectedGenre.toLowerCase()) ||
            (musician.genres && musician.genres.some((g: string) => g.toLowerCase() === filters.selectedGenre.toLowerCase()));
        
        // Distance filter
        let matchesDistance = true;
        if (filters.selectedDistance !== "all" && filters.zipCode) {
            const musicianLocation = [musician.city, musician.state].filter(Boolean).join(', ');
            const distance = calculateDistance(filters.zipCode, musicianLocation);
            const maxDistance = parseInt(filters.selectedDistance);
            matchesDistance = distance <= maxDistance;
        }
        
        return matchesSearch && matchesGenre && matchesDistance;
    });

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            searchTerm: "",
            selectedGenre: "all",
            selectedDistance: "all",
            zipCode: ""
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.searchTerm || 
        filters.selectedGenre !== "all" || 
        filters.selectedDistance !== "all" || 
        filters.zipCode;

    // Show loading state while fetching
    if (musiciansFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <Header />
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading musicians...</p>
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
                            <h1 className="text-3xl font-bold">Find Musicians</h1>
                            <p className="text-muted-foreground">
                                Discover talented musicians for your events
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
                                    Search & Filter
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
                            {/* Note about simplified distance filtering */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Distance filtering is currently simplified and based on city/state matching. 
                                    For accurate distance calculations, we plan to integrate with a mapping API in the future.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div>
                                    <Label htmlFor="search">Search Musicians</Label>
                                    <Input
                                        id="search"
                                        placeholder="Name, stage name, or bio..."
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

                                {/* Distance */}
                                <div>
                                    <Label htmlFor="distance">Distance (Simplified)</Label>
                                    <Select value={filters.selectedDistance} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedDistance: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any distance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {distanceOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Based on city/state matching (not actual distance)
                                    </p>
                                </div>

                                {/* Location Input */}
                                <div>
                                    <Label htmlFor="zipCode">Your Location</Label>
                                    <Input
                                        id="zipCode"
                                        placeholder="City, State (e.g., New York, NY)"
                                        value={filters.zipCode}
                                        onChange={(e) => setFilters(prev => ({ ...prev, zipCode: e.target.value }))}
                                        disabled={filters.selectedDistance === "all"}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enter city and state for location-based filtering
                                    </p>
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
                                    {filters.selectedGenre !== "all" && (
                                        <Badge variant="secondary" className="text-xs">
                                            Genre: {filters.selectedGenre}
                                        </Badge>
                                    )}
                                    {filters.selectedDistance !== "all" && (
                                        <Badge variant="secondary" className="text-xs">
                                            Distance: {distanceOptions.find(d => d.value === filters.selectedDistance)?.label}
                                        </Badge>
                                    )}
                                    {filters.zipCode && (
                                        <Badge variant="secondary" className="text-xs">
                                            Zip: {filters.zipCode}
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
                            {filteredMusicians.length} musician{filteredMusicians.length !== 1 ? 's' : ''} found
                        </h2>
                        {hasActiveFilters && (
                            <p className="text-sm text-muted-foreground">
                                Showing filtered results from {musicians.length} total musicians
                            </p>
                        )}
                    </div>
                </div>

                {/* Musicians Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMusicians.length > 0 ? (
                        filteredMusicians.map((musician) => (
                            <Card key={musician.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Music className="h-5 w-5" />
                                        {musician.stageName || musician.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {musician.bio && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {musician.bio}
                                        </p>
                                    )}
                                    
                                    <div className="space-y-2 text-sm">
                                        {musician.genre && (
                                            <div className="flex items-center gap-2">
                                                <Music className="h-4 w-4 text-muted-foreground" />
                                                <span>{musician.genre}</span>
                                            </div>
                                        )}
                                        
                                        {musician.city && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {musician.city}{musician.state && `, ${musician.state}`}
                                                    {musician.zipCode && ` ${musician.zipCode}`}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {musician.rating && (
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-muted-foreground" />
                                                <span>{musician.rating}/5</span>
                                            </div>
                                        )}
                                        
                                        {musician.hourlyRate && (
                                            <div className="font-medium">
                                                ${musician.hourlyRate}/hour
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button asChild className="flex-1">
                                            <Link to={`/musician/${musician.id}`}>
                                                View Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No musicians found</h3>
                            <p className="text-muted-foreground mb-4">
                                {hasActiveFilters 
                                    ? "Try adjusting your search criteria or clearing some filters."
                                    : "Check back later for new musicians joining the platform."
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