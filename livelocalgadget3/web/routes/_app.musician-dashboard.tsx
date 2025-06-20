import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useOutletContext, useNavigate } from "react-router";
import { Edit, Clock, MapPin, CalendarDays, Star, DollarSign, AlertCircle } from "lucide-react";
import { useFindMany } from "@gadgetinc/react";
import { Client } from "@gadget-client/livelocalgadget3";
import type { AuthOutletContext } from "./_app";

// Helper function to render status badges
function getStatusBadge(status: string) {
    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-blue-100 text-blue-800",
    };
    return (
        <Badge className={statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800"}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
        </Badge>
    );
}

// Helper to format date/time
function formatDateTime(dateTime: string | Date | null | undefined) {
    if (!dateTime) return "No date provided";
    return new Date(dateTime).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

export default function MusicianDashboard() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();

    // Create a fresh API client instance for this component
    const freshApi = new Client({
        environment: "development",
        authenticationMode: { browserSession: true },
    });

    const [{ data: musicianData, fetching: musicianFetching, error: musicianError }] = useFindMany(freshApi.musician, {
        filter: { user: { id: { equals: user?.id } } },
        select: {
            id: true, name: true, stageName: true, bio: true, genres: true, city: true,
            state: true, country: true, website: true, profilePicture: true, totalGigs: true,
            rating: true, hourlyRate: true, yearsExperience: true, experience: true, instruments: true,
            phone: true, email: true
        },
        first: 1,
        pause: !user?.id,
    });

    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(freshApi.booking, {
        filter: { musician: { equals: musicianData?.[0]?.id } },
        select: {
            id: true, status: true, event: { id: true, title: true, dateTime: true, description: true, venue: { id: true, name: true, location: true } }
        },
        pause: !musicianData?.[0]?.id,
    });

    useEffect(() => {
        if (musicianError) console.error("Error loading musician data:", musicianError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
    }, [musicianError, bookingsError]);

    // Show loading state while fetching
    if (musicianFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your musician dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no musician profile found after loading, show a message with option to create one
    if (!musicianData || musicianData.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Welcome to Your Musician Dashboard</h1>
                        <p className="text-muted-foreground mb-6">
                            It looks like you haven't created your musician profile yet. Create your profile to start managing your bookings, events, and availability.
                        </p>
                        <Button asChild>
                            <Link to="/musician-profile/create">
                                Create Musician Profile
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    const musician = musicianData[0];
    const upcomingEvents = bookingsData?.filter((b: any) => b.event && new Date(b.event.dateTime) > new Date()) ?? [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Musician Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {musician.stageName || user?.firstName}!
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link to={`/musician-profile/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{musician.totalGigs ?? 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{musician.rating ?? 'N/A'}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">${musician.hourlyRate ?? 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font--medium">Pending Bookings</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{bookingsData?.filter(b => b.status === 'pending').length ?? 0}</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
                        <CardContent>
                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{booking.event?.title}</p>
                                                <p className="text-sm text-muted-foreground">{formatDateTime(booking.event?.dateTime)}</p>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No upcoming events found.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bookings">
                    <Card>
                        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
                        <CardContent>
                            {bookingsData && bookingsData.length > 0 ? (
                                <div className="space-y-4">
                                    {bookingsData.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium">{booking.event?.venue?.name}</h3>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{formatDateTime(booking.event?.dateTime)}</div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{booking.event?.venue?.location}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No bookings found.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                     <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Your musician profile details. Click "Edit Profile" to make changes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <p><strong>Stage Name:</strong> {musician.stageName}</p>
                           <p><strong>Contact Email:</strong> {musician.email}</p>
                           <p><strong>Genres:</strong> {musician.genres?.join(', ')}</p>
                           <p><strong>Location:</strong> {`${musician.city}, ${musician.state}`}</p>
                           <p><strong>Website:</strong> <a href={musician.website ?? '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{musician.website || "Not set"}</a></p>
                           <div>
                                <p><strong>Bio:</strong></p>
                                <p className="text-muted-foreground pl-4 border-l-2">{musician.bio || "No bio provided."}</p>
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 