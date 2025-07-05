import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Music, Calendar, DollarSign, MessageCircle, Star, Users, Clock, CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';

export default function MusicianHowToPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link to="/musician-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">How to for Musicians</h1>
                        <p className="text-muted-foreground">
                            Learn how to effectively use the platform to get booked at venues
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            Getting Started as a Musician
                        </CardTitle>
                        <CardDescription>
                            Welcome to Live Local! This guide will help you understand how to find and apply for gigs at venues.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Step-by-step process */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="text-center space-y-2 p-4 border rounded-lg">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold">1. Complete Profile</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add photos, music samples, and detailed bio
                                    </p>
                                </div>
                                <div className="text-center space-y-2 p-4 border rounded-lg">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold">2. Set Availability</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Update your calendar with available dates
                                    </p>
                                </div>
                                <div className="text-center space-y-2 p-4 border rounded-lg">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                        <Star className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold">3. Apply to Events</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Browse and apply to events that match your style
                                    </p>
                                </div>
                                <div className="text-center space-y-2 p-4 border rounded-lg">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold">4. Get Booked</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Confirm details and perform at the venue
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tips for Success Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Tips for Success
                        </CardTitle>
                        <CardDescription>
                            Best practices to increase your booking success rate
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Music className="h-4 w-4 text-blue-600" />
                                    <h3 className="font-semibold">Perfect Your Profile</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Upload high-quality photos, demo recordings, and write a compelling bio that showcases your unique style and experience.
                                </p>
                            </div>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <h3 className="font-semibold">Price Competitively</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Research local market rates and price your services competitively while valuing your talent appropriately.
                                </p>
                            </div>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-orange-600" />
                                    <h3 className="font-semibold">Write Compelling Applications</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Personalize each application, mention why you're perfect for that specific venue and event type.
                                </p>
                            </div>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-purple-600" />
                                    <h3 className="font-semibold">Respond Quickly</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Apply to events promptly and respond to venue messages quickly to show professionalism.
                                </p>
                            </div>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-red-600" />
                                    <h3 className="font-semibold">Keep Availability Updated</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Regularly update your availability calendar so venues can see when you're free to perform.
                                </p>
                            </div>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <h3 className="font-semibold">Build Relationships</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Deliver great performances and maintain good relationships with venues for repeat bookings and referrals.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Application Status Guide */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Understanding Application Status
                        </CardTitle>
                        <CardDescription>
                            What each status means and what to expect next
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Applied</span>
                                    <p className="text-sm text-muted-foreground">Your application has been submitted and is under review by the venue.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Selected</span>
                                    <p className="text-sm text-muted-foreground">The venue has selected you! Confirm your availability to secure the booking.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Confirmed</span>
                                    <p className="text-sm text-muted-foreground">Booking confirmed! Prepare for your performance and stay in touch with the venue.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Completed</span>
                                    <p className="text-sm text-muted-foreground">Performance completed! Leave a review and get ready for your next gig.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 