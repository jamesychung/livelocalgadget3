import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Heart, Music, Building, Calendar } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";

export default function FavoritesPage() {
    const { user } = useOutletContext<AuthOutletContext>();

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
                        <h1 className="text-3xl font-bold">Favorites</h1>
                        <p className="text-muted-foreground">
                            Your saved musicians, venues, and events
                        </p>
                    </div>
                </div>
            </div>

            {/* Favorites Content */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Musicians */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            Favorite Musicians
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorite musicians</h3>
                        <p className="text-muted-foreground mb-4">
                            Start exploring musicians to add them to your favorites.
                        </p>
                        <Button asChild>
                            <Link to="/musicians">
                                Browse Musicians
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Venues */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Favorite Venues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorite venues</h3>
                        <p className="text-muted-foreground mb-4">
                            Start exploring venues to add them to your favorites.
                        </p>
                        <Button asChild>
                            <Link to="/venues">
                                Browse Venues
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Favorite Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorite events</h3>
                        <p className="text-muted-foreground mb-4">
                            Start exploring events to add them to your favorites.
                        </p>
                        <Button asChild>
                            <Link to="/events">
                                Browse Events
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 
