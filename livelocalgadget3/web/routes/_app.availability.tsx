import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import AvailabilityManager from "../components/shared/AvailabilityManager";

export default function AvailabilityPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();

    const [{ data: musicianData, fetching: musicianFetching, error: musicianError }] = useFindMany(api.musician, {
        filter: { user: { id: { equals: user?.id } } },
        select: {
            id: true, 
            name: true, 
            stageName: true, 
            availability: true
        },
        first: 1,
        pause: !user?.id,
    });

    const musician: any = musicianData?.[0];
    const [updateMusicianResult, updateMusician] = useAction(api.musician.update);

    useEffect(() => {
        if (musicianError) {
            console.error("Error loading musician data:", musicianError);
        }
    }, [musicianError]);

    // Show loading state while fetching
    if (musicianFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your availability...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no musician profile found, show a message with option to create one
    if (!musician) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Availability Management</h1>
                        <p className="text-muted-foreground mb-6">
                            It looks like you haven't created your musician profile yet. Create your profile to start managing your availability.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/musician-profile-create">
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

    // Handle availability updates
    const handleAvailabilityUpdate = async (availabilityData: any) => {
        if (!musician?.id) {
            console.error("No musician ID found");
            return;
        }
        
        console.log("Saving availability data:", availabilityData);
        console.log("Musician ID:", musician.id);
        
        // Ensure the data is properly formatted
        const formattedData = JSON.parse(JSON.stringify(availabilityData));
        console.log("Formatted data:", formattedData);
        
        try {
            const result = await updateMusician({
                id: musician.id,
                availability: formattedData
            });
            
            console.log("Update result:", result);
            
            if (result.error) {
                console.error("Update failed:", result.error);
                return;
            }
            
            console.log("Availability updated successfully");
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

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
                        <h1 className="text-3xl font-bold">Availability Management</h1>
                        <p className="text-muted-foreground">
                            Manage your availability for {musician.stageName || user?.firstName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Object.keys(musician.availability || {}).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Days with availability set
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(() => {
                                let total = 0;
                                Object.values(musician.availability || {}).forEach((daySlots: any) => {
                                    total += daySlots?.length || 0;
                                });
                                return total;
                            })()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Individual time slots
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(() => {
                                let totalHours = 0;
                                Object.values(musician.availability || {}).forEach((daySlots: any) => {
                                    daySlots?.forEach((slot: any) => {
                                        const start = new Date(`2000-01-01T${slot.startTime}`);
                                        const end = new Date(`2000-01-01T${slot.endTime}`);
                                        totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                    });
                                });
                                return Math.round(totalHours);
                            })()}h
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Available per week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Availability Manager */}
            <AvailabilityManager
                availability={musician?.availability || {}}
                onSave={handleAvailabilityUpdate}
                title="Your Availability Schedule"
                description="Set your available time slots for venues to see when booking you. You can view this in weekly or monthly format."
            />

            {/* Tips and Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Tips for Managing Your Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Best Practices</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Set realistic availability that you can commit to</li>
                                <li>• Update your schedule regularly to reflect changes</li>
                                <li>• Use the quick settings for common patterns</li>
                                <li>• Consider your travel time between venues</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">How Venues See This</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Venues can see your general availability</li>
                                <li>• They'll contact you for specific booking requests</li>
                                <li>• Keep your schedule up-to-date for more bookings</li>
                                <li>• You can always decline specific requests</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 