import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Music, Search, MapPin, Star } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { useSupabaseQuery } from "../hooks/useSupabaseData";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";

export default function MusiciansPage() {
    const { user } = useOutletContext<AuthOutletContext>();

    // Fetch musicians
    const { data: musiciansData, loading: musiciansLoading, error: musiciansError } = useSupabaseQuery(
        async () => {
            return await supabase
                .from('musicians')
                .select(`
                    id,
                    stage_name,
                    bio,
                    genre,
                    genres,
                    city,
                    state,
                    rating,
                    hourly_rate,
                    profile_picture,
                    instruments
                `)
                .limit(50);
        },
        []
    );

    const musicians: any[] = musiciansData || [];

    // Show loading state while fetching
    if (musiciansLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading musicians...</p>
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
                        <h1 className="text-3xl font-bold">Find Musicians</h1>
                        <p className="text-muted-foreground">
                            Discover talented musicians for your events
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

            {/* Musicians Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {musicians.length > 0 ? (
                    musicians.map((musician) => (
                        <Card key={musician.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5" />
                                    {musician.stage_name}
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
                                    
                                    {musician.hourly_rate && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">$</span>
                                            <span>{musician.hourly_rate}/hr</span>
                                        </div>
                                    )}
                                </div>
                                
                                <Button asChild className="w-full">
                                    <Link to={`/musician/${musician.id}`}>
                                        View Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No musicians found</h3>
                        <p className="text-muted-foreground">
                            Check back later for available musicians.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 
