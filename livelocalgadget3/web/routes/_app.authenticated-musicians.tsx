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

    console.log("=== MUSICIANS PAGE LOADED ===");
    console.log("MusiciansPage - Current user:", user);
    console.log("MusiciansPage - User ID:", user?.id);
    console.log("MusiciansPage - User email:", user?.email);
    console.log("MusiciansPage - User primaryRole:", user?.primaryRole);

    // Fetch musicians
    const [{ data: musiciansData, fetching: musiciansFetching, error: musiciansError }] = useFindMany(api.musician, {
        select: {
            id: true,
            name: true,
            stageName: true,
            bio: true,
            genre: true,
            genres: true,
            city: true,
            state: true,
            country: true,
            rating: true,
            hourlyRate: true,
            profilePicture: true,
            instruments: true,
            isActive: true,
            isVerified: true,
            totalGigs: true,
            yearsExperience: true,
            user: {
                id: true,
                email: true,
                primaryRole: true
            }
        },
        first: 50,
    });

    console.log("=== API CALL RESULTS ===");
    console.log("MusiciansPage - musiciansData:", musiciansData);
    console.log("MusiciansPage - musicians array:", musiciansData || []);
    console.log("MusiciansPage - musiciansError:", musiciansError);
    console.log("MusiciansPage - musiciansFetching:", musiciansFetching);
    console.log("MusiciansPage - API environment:", api.connection.environment);

    const musicians: any[] = musiciansData || [];

    // Try to find your specific musician profile
    const yourMusician = musicians.find(m => 
      m.user?.email === 'james@allquality.com' || 
      m.stageName === 'sad' ||
      m.email === 'james@allquality.com'
    );
    
    console.log("=== LOOKING FOR YOUR MUSICIAN PROFILE ===");
    console.log("MusiciansPage - Your musician found:", yourMusician);
    console.log("MusiciansPage - Searching for email: james@allquality.com");
    console.log("MusiciansPage - Searching for stage name: sad");

    // Direct search for your musician profile
    React.useEffect(() => {
        const searchForYourMusician = async () => {
            try {
                console.log("=== DIRECT SEARCH FOR YOUR MUSICIAN ===");
                
                // Search by stage name
                const byStageName = await api.musician.findMany({
                    filter: { stageName: { equals: "sad" } },
                    first: 10
                });
                console.log("MusiciansPage - Search by stage name 'sad':", byStageName);
                
                // Search by email
                const byEmail = await api.musician.findMany({
                    filter: { email: { equals: "james@allquality.com" } },
                    first: 10
                });
                console.log("MusiciansPage - Search by email 'james@allquality.com':", byEmail);
                
                // Search all musicians
                const allMusicians = await api.musician.findMany({
                    first: 100
                });
                console.log("MusiciansPage - All musicians (first 100):", allMusicians);
                
            } catch (error) {
                console.error("Error in direct search:", error);
            }
        };
        
        searchForYourMusician();
    }, []);

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

            {/* Debug Section - Show All Musicians */}
            <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                    <CardTitle className="text-yellow-800">Debug: All Musicians (Including Inactive)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm">
                        <p><strong>Total Musicians Found:</strong> {musicians.length}</p>
                        <p><strong>Active Musicians:</strong> {musicians.filter(m => m.isActive).length}</p>
                        <p><strong>Inactive Musicians:</strong> {musicians.filter(m => !m.isActive).length}</p>
                        <p><strong>Current User ID:</strong> {user?.id}</p>
                        <p><strong>Current User Email:</strong> {user?.email}</p>
                        <p><strong>Current User Primary Role:</strong> {user?.primaryRole}</p>
                        <div className="mt-4">
                            <p><strong>All Musicians:</strong></p>
                            <div className="max-h-60 overflow-auto">
                                {musicians.map((musician, index) => (
                                    <div key={musician.id} className="border-b border-gray-200 py-2">
                                        <p><strong>{index + 1}.</strong> {musician.stageName || musician.name}</p>
                                        <p className="text-xs text-gray-600">
                                            ID: {musician.id} | 
                                            Active: {musician.isActive ? 'Yes' : 'No'} | 
                                            User: {musician.user?.email || 'No user'} | 
                                            User ID: {musician.user?.id || 'No user ID'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Musicians Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {musicians.length > 0 ? (
                    musicians.map((musician) => (
                        <Card key={musician.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5" />
                                    {musician.stageName || musician.name}
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