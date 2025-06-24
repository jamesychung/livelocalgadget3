import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Music, Users, Calendar as CalendarIcon, Search } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import OpenEventsList from "../components/shared/OpenEventsList";

export default function OpenEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("browse");

    // Fetch musician profile
    const [{ data: musicianData, fetching: musicianFetching }] = useFindMany(api.musician, {
        filter: { user: { id: { equals: user?.id } } },
        select: {
            id: true,
            name: true,
            stageName: true,
            genre: true,
            city: true,
            state: true,
            hourlyRate: true
        },
        first: 1,
        pause: !user?.id,
    });

    const musician = musicianData?.[0] as any;

    // Fetch open events
    const [{ data: openEventsData, fetching: openEventsFetching, error: openEventsError }] = useFindMany(api.event, {
        filter: { 
            status: { equals: "open" },
            bookingType: { equals: "open_marketplace" },
            isActive: { equals: true }
        },
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            genres: true,
            budgetRange: true,
            locationRequirements: true,
            interestDeadline: true,
            equipment: true,
            venue: {
                id: true,
                name: true,
                city: true,
                state: true
            }
        },
        sort: { date: "asc" }
    });

    // Fetch musician's submitted interests
    const [{ data: interestsData, fetching: interestsFetching }] = useFindMany(api.booking, {
        filter: { 
            musician: { id: { equals: musician?.id } },
            bookingType: { equals: "interest_expression" }
        },
        select: {
            id: true,
            status: true,
            proposedRate: true,
            musicianPitch: true,
            equipmentProvided: true,
            date: true,
            startTime: true,
            endTime: true,
            event: {
                id: true,
                title: true,
                date: true,
                venue: {
                    id: true,
                    name: true,
                    city: true,
                    state: true
                }
            }
        },
        pause: !musician?.id,
    });

    // Create booking action for interest submission
    const [createBookingResult, createBooking] = useAction(api.booking.create);

    const handleSubmitInterest = async (eventId: string, interestData: {
        proposedRate: number;
        equipmentProvided: string[];
        pitch: string;
    }) => {
        if (!musician?.id) {
            throw new Error("Musician profile not found");
        }

        // Find the event to get venue and other details
        const event = (openEventsData || []).find((e: any) => e.id === eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        const newBooking = {
            bookingType: "interest_expression",
            status: "interest_expressed",
            proposedRate: interestData.proposedRate,
            musicianPitch: interestData.pitch,
            equipmentProvided: interestData.equipmentProvided,
            date: (event as any).date,
            startTime: (event as any).startTime,
            endTime: (event as any).endTime,
            totalAmount: interestData.proposedRate,
            isActive: true,
            musician: { _link: musician.id },
            venue: { _link: (event as any).venue.id },
            event: { _link: eventId },
            bookedBy: { _link: user.id }
        };

        const result = await createBooking(newBooking);
        
        if (result.error) {
            throw new Error(result.error.message || "Failed to submit interest");
        }

        return result.data;
    };

    // Show loading state while fetching musician profile
    if (musicianFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading musician profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no musician profile found
    if (!musician) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Open Events</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to create a musician profile before you can browse open events.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/musician-profile/edit">
                                    Create Musician Profile
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/musician-dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const openEvents = (openEventsData || []) as any[];
    const submittedInterests = (interestsData || []) as any[];

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
                        <h1 className="text-3xl font-bold">Open Events</h1>
                        <p className="text-muted-foreground">
                            Discover and submit interest in events from venues
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{openEvents.length}</p>
                                <p className="text-sm text-muted-foreground">Open Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Music className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{submittedInterests.length}</p>
                                <p className="text-sm text-muted-foreground">Interests Submitted</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">${musician.hourlyRate || 0}</p>
                                <p className="text-sm text-muted-foreground">Your Hourly Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="browse">Browse Events</TabsTrigger>
                    <TabsTrigger value="interests">My Interests</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="space-y-6">
                    {openEventsError && (
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-red-600">Error loading open events: {openEventsError.message}</p>
                            </CardContent>
                        </Card>
                    )}

                    <OpenEventsList
                        events={openEvents}
                        onSubmitInterest={handleSubmitInterest}
                        isLoading={openEventsFetching}
                    />
                </TabsContent>

                <TabsContent value="interests" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Submitted Interests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submittedInterests.length === 0 ? (
                                <div className="text-center py-8">
                                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">You haven't submitted any interests yet.</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Browse open events and submit your interest to get started!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submittedInterests.map((interest) => (
                                        <Card key={interest.id} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold">
                                                                {interest.event?.title}
                                                            </h3>
                                                            <Badge variant={
                                                                interest.status === "interest_expressed" ? "secondary" :
                                                                interest.status === "pending_confirmation" ? "default" :
                                                                interest.status === "confirmed" ? "default" :
                                                                "destructive"
                                                            }>
                                                                {interest.status.replace("_", " ").toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>
                                                                    {interest.event?.venue?.name}, {interest.event?.venue?.city}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {interest.event?.date ? new Date(interest.event.date).toLocaleDateString() : "TBD"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4" />
                                                                <span>${interest.proposedRate}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {interest.musicianPitch && (
                                                            <p className="text-sm text-muted-foreground">
                                                                <strong>Your pitch:</strong> {interest.musicianPitch}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 