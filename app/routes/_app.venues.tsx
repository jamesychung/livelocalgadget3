import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Building, Search, MapPin, Star, Users } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { useSupabaseQuery } from "../hooks/useSupabaseData";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";

export default function VenuesPage() {
    const { user } = useOutletContext<AuthOutletContext>();

    // Fetch venues
    const { data: venuesData, loading: venuesLoading, error: venuesError } = useSupabaseQuery(
        async () => {
            return await supabase
                .from('venues')
                .select(`
                    id,
                    name,
                    description,
                    type,
                    city,
                    state,
                    rating,
                    capacity,
                    profile_picture,
                    genres,
                    amenities
                `)
                .eq('is_active', true)
                .limit(50);
        },
        []
    );

    const venues: any[] = venuesData || [];

    // Show loading state while fetching
    if (venuesLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading venues...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/signed-in">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Find Venues</h1>
                        <p className="text-muted-foreground">
                            Discover great venues for your performances
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Venues Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.length > 0 ? (
                    venues.map((venue) => (
                        <Card key={venue.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
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
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span>{venue.type}</span>
                                        </div>
                                    )}
                                    
                                    {venue.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {venue.city}{venue.state && `, ${venue.state}`}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {venue.rating && (
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-muted-foreground" />
                                            <span>{venue.rating}/5</span>
                                        </div>
                                    )}
                                    
                                    {venue.capacity && (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Capacity: {venue.capacity}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <Button asChild className="w-full">
                                    <Link to={`/venue/${venue.id}`}>
                                        View Venue
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No venues found</h3>
                        <p className="text-muted-foreground">
                            Check back later for available venues.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 
