import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, Music, Search, MapPin, Star, Filter, Calendar } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function SearchMusiciansPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");

    // Fetch musicians with filters
    const [{ data: musiciansData, fetching: musiciansFetching, error: musiciansError }] = useFindMany(api.musician, {
        select: {
            id: true,
            stageName: true,
            bio: true,
            genre: true,
            genres: true,
            city: true,
            state: true,
            rating: true,
            hourlyRate: true,
            profilePicture: true,
            instruments: true,
            availability: true
        },
        first: 50,
    });

    const musicians: any[] = musiciansData || [];

    // Filter musicians based on search criteria
    const filteredMusicians = musicians.filter((musician) => {
        const matchesSearch = !searchTerm || 
            (musician.stageName && musician.stageName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (musician.bio && musician.bio.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesGenre = selectedGenre === "all" || 
            (musician.genre && musician.genre.toLowerCase() === selectedGenre.toLowerCase()) ||
            (musician.genres && musician.genres.some((g: string) => g.toLowerCase() === selectedGenre.toLowerCase()));
        
        const matchesLocation = selectedLocation === "all" || 
            (musician.city && musician.city.toLowerCase().includes(selectedLocation.toLowerCase())) ||
            (musician.state && musician.state.toLowerCase().includes(selectedLocation.toLowerCase()));
        
        return matchesSearch && matchesGenre && matchesLocation;
    });

    // Get unique genres for filter
    const genres = Array.from(new Set(
        musicians.flatMap((m) => [
            m.genre,
            ...(Array.isArray(m.genres) ? m.genres : [])
        ].filter(Boolean))
    )).sort();

    // Get unique locations for filter
    const locations = Array.from(new Set(
        musicians.map((m) => `${m.city}, ${m.state}`).filter(Boolean)
    )).sort();

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/venue-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Find Musicians</h1>
                        <p className="text-muted-foreground">
                            Search and filter musicians for your venue
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search">Search Musicians</Label>
                            <Input
                                id="search"
                                placeholder="Search by name, stage name, or bio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="genre">Genre</Label>
                            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
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
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedGenre("all");
                                setSelectedLocation("all");
                            }}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {filteredMusicians.length} musician{filteredMusicians.length !== 1 ? 's' : ''} found
                    </h2>
                </div>

                {/* Musicians Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMusicians.length > 0 ? (
                        filteredMusicians.map((musician) => (
                            <Card key={musician.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Music className="h-5 w-5" />
                                        {musician.stageName}
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
                                        <Button variant="outline" className="flex-1">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Book
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No musicians found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search criteria or check back later.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
