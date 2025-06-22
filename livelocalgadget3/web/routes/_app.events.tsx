import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Music, MapPin, Clock } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function EventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();

    // Fetch public events
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { isPublic: { equals: true } },
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            ticketPrice: true,
            status: true,
            venue: {
                id: true,
                name: true,
                city: true,
                state: true
            },
            musician: {
                id: true,
                stageName: true,
                name: true
            }
        },
        first: 50,
    });

    const events: any[] = eventsData || [];

    // Show loading state while fetching
    if (eventsFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading events...</p>
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
                        <Link to="/musician-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Events</h1>
                        <p className="text-muted-foreground">
                            Browse upcoming events and performances
                        </p>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5" />
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
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                                        </span>
                                    </div>
                                    
                                    {event.startTime && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {event.venue && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {event.venue.name}
                                                {event.venue.city && `, ${event.venue.city}`}
                                                {event.venue.state && `, ${event.venue.state}`}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {event.musician && (
                                        <div className="flex items-center gap-2">
                                            <Music className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {event.musician.stageName || event.musician.name}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {event.ticketPrice && (
                                        <div className="font-medium">
                                            ${event.ticketPrice}
                                        </div>
                                    )}
                                </div>
                                
                                <Button asChild className="w-full">
                                    <Link to={`/event/${event.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No events found</h3>
                        <p className="text-muted-foreground">
                            Check back later for upcoming events and performances.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 