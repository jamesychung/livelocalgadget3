import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Search, MapPin, Star } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function MusiciansPage() {
    const { user } = useOutletContext<AuthOutletContext>();

    // Fetch musicians
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
            instruments: true
        },
        first: 50,
    });

    const musicians: any[] = musiciansData || [];

    // Show loading state while fetching
    if (musiciansFetching) {
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