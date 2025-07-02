import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import VenueSystemFlowchart from "../components/shared/VenueSystemFlowchart";

export default function VenueHowToPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link to="/venue-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">How to for Venues</h1>
                        <p className="text-muted-foreground">
                            Learn how to effectively use the platform to book musicians
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>
                            Welcome to Live Local! This guide will help you understand how to book musicians for your venue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VenueSystemFlowchart />
                    </CardContent>
                </Card>

                {/* Additional Tips Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Tips</CardTitle>
                        <CardDescription>
                            Best practices for successful musician bookings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="font-semibold">Create Clear Event Descriptions</h3>
                                <p className="text-sm text-muted-foreground">
                                    Include details about your venue, expected audience, and any specific requirements to attract the right musicians.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Set Realistic Budgets</h3>
                                <p className="text-sm text-muted-foreground">
                                    Be upfront about your budget range to avoid wasting time with musicians outside your price range.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Respond Promptly</h3>
                                <p className="text-sm text-muted-foreground">
                                    Musicians appreciate quick responses. Set aside time to review applications and respond within 24-48 hours.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Build Relationships</h3>
                                <p className="text-sm text-muted-foreground">
                                    Successful bookings can lead to repeat performances. Maintain good communication and follow up after events.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 
