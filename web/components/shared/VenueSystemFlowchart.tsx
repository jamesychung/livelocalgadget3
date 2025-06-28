import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Calendar, Music, CheckCircle, Clock, DollarSign, MapPin, Star, Plus, Search, MessageSquare, UserCheck, Building, Phone } from "lucide-react";

export default function VenueSystemFlowchart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    How to Book Musicians
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Two simple ways to find and book the perfect musicians for your venue
                </p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Option A: Open Call */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Option A
                        </Badge>
                        <h3 className="font-semibold text-lg">Open Call Approach</h3>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6">
                        {/* Step 1: Create Event */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <Music className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Create Event</h4>
                                <p className="text-xs text-muted-foreground">
                                    Set criteria: genre, location, budget, date
                                </p>
                            </div>
                        </div>
                        
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        
                        {/* Step 2: Musicians Apply */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Musicians Apply</h4>
                                <p className="text-xs text-muted-foreground">
                                    Qualified musicians submit applications
                                </p>
                            </div>
                        </div>
                        
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        
                        {/* Step 3: Venue Books */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Venue Books</h4>
                                <p className="text-xs text-muted-foreground">
                                    Review applications & select musician
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center">
                    <div className="flex-1 border-t"></div>
                    <span className="px-4 text-sm text-muted-foreground">OR</span>
                    <div className="flex-1 border-t"></div>
                </div>

                {/* Option B: Direct Invite */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Option B
                        </Badge>
                        <h3 className="font-semibold text-lg">Direct Invite Approach</h3>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6">
                        {/* Step 1: Browse Musician Profiles */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <Search className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Browse Musician Profiles</h4>
                                <p className="text-xs text-muted-foreground">
                                    Search musicians by genre, location, rating
                                </p>
                            </div>
                        </div>
                        
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        
                        {/* Step 2: Send Invites to Musicians */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Send Invites to Musicians</h4>
                                <p className="text-xs text-muted-foreground">
                                    Invite multiple musicians for specific event
                                </p>
                            </div>
                        </div>
                        
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        
                        {/* Step 3: Venue Makes Final Choice */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <UserCheck className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Venue Makes Final Choice</h4>
                                <p className="text-xs text-muted-foreground">
                                    Musicians express interest, venue makes final choice
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-sm">Set Your Own Deadlines</h4>
                        <p className="text-xs text-muted-foreground">
                            Control response times and booking timelines
                        </p>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-sm">Multiple Options</h4>
                        <p className="text-xs text-muted-foreground">
                            Cast wide net or target specific musicians
                        </p>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-sm">Quality Control</h4>
                        <p className="text-xs text-muted-foreground">
                            Review profiles, ratings, and past performances
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 