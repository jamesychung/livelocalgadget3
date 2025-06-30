import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { useFindMany } from "@gadgetinc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, 
    Music, 
    Users, 
    Star, 
    MapPin, 
    Phone, 
    Mail, 
    ExternalLink,
    Edit,
    Plus,
    TrendingUp,
    Clock,
    DollarSign,
    AlertCircle
} from "lucide-react";
import { api } from "@/api";
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

    const [{ data: musicianData, fetching: musicianFetching, error: musicianError }] = useFindMany(api.musician, {
        filter: { user: { id: { equals: user?.id } } },
        select: {
            id: true, stageName: true, bio: true, genre: true, genres: true, city: true,
            state: true, country: true, website: true, profilePicture: true, totalGigs: true,
            rating: true, hourlyRate: true, yearsExperience: true, experience: true, instruments: true,
            phone: true, email: true, availability: true
        },
        first: 1,
        pause: !user?.id,
    });

    const musician: any = musicianData?.[0];

    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(api.booking, {
        filter: { musician: { id: { equals: musician?.id } } },
        select: {
            id: true, 
            status: true, 
            date: true,
            startTime: true,
            endTime: true,
            totalAmount: true,
            notes: true,
            venue: { 
                id: true, 
                name: true, 
                address: true,
                city: true,
                state: true
            }
        },
        pause: !musician?.id,
    });

    const bookings: any[] = bookingsData || [];

    useEffect(() => {
        if (musicianError) console.error("Error loading musician data:", musicianError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
        if (musician) {
            console.log("Musician data received:", musician);
            console.log("Genres field:", musician.genres);
            console.log("Genre field:", musician.genre);
        }
    }, [musicianError, bookingsError, musician]);

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
    if (!musician) {
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
    
    const upcomingEvents = bookings.filter((b: any) => b.date && new Date(b.date) > new Date()) ?? [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Musician Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {musician.stageName || user?.firstName}!
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link to="/availability">
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Availability
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to={`/musician-profile/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
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
                    <CardContent><div className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length ?? 0}</div></CardContent>
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
                                                <p className="font-medium">{booking.venue?.name || 'Venue TBD'}</p>
                                                <p className="text-sm text-muted-foreground">{formatDateTime(booking.date)}</p>
                                                {booking.startTime && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.startTime}{booking.endTime ? ` - ${booking.endTime}` : ''}
                                                    </p>
                                                )}
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
                            {bookings && bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium">{booking.venue?.name || 'Venue TBD'}</h3>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDateTime(booking.date)}
                                                    {booking.startTime && (
                                                        <span> • {booking.startTime}{booking.endTime ? ` - ${booking.endTime}` : ''}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {(() => {
                                                        const venue = booking.venue;
                                                        if (venue?.address) {
                                                            return `${venue.address}${venue.city ? `, ${venue.city}` : ''}${venue.state ? `, ${venue.state}` : ''}`;
                                                        } else if (venue?.city) {
                                                            return `${venue.city}${venue.state ? `, ${venue.state}` : ''}`;
                                                        } else {
                                                            return 'Location TBD';
                                                        }
                                                    })()}
                                                </div>
                                                {booking.totalAmount && (
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        ${booking.totalAmount}
                                                    </div>
                                                )}
                                            </div>
                                            {booking.notes && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    <strong>Notes:</strong> {booking.notes}
                                                </div>
                                            )}
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
                            <CardDescription>
                                Your musician profile details. Click "Edit Profile" to make changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="font-semibold">Stage Name:</div>
                                <div>{musician.stageName || 'Not set'}</div>

                                <div className="font-semibold">Contact Email:</div>
                                <div>{musician.email || 'Not set'}</div>

                                <div className="font-semibold">Phone:</div>
                                <div>{musician.phone || 'Not set'}</div>
                                
                                <div className="font-semibold">Genre (single):</div>
                                <div>{musician.genre || 'Not set'}</div>

                                <div className="font-semibold">Genres (array):</div>
                                <div className="flex flex-wrap gap-1">
                                    {musician.genres && musician.genres.length > 0 ? (
                                        musician.genres.map((g: string, i: number) => <Badge key={i} variant="secondary">{g}</Badge>)
                                    ) : 'Not set'}
                                </div>
                                
                                <div className="font-semibold">Genres Debug:</div>
                                <div>{JSON.stringify(musician.genres)}</div>

                                <div className="font-semibold">Instruments:</div>
                                <div className="flex flex-wrap gap-1">
                                    {musician.instruments && musician.instruments.length > 0 ? (
                                        musician.instruments.map((i: string, index: number) => <Badge key={index} variant="secondary">{i}</Badge>)
                                    ) : 'Not set'}
                                </div>

                                <div className="font-semibold">Location:</div>
                                <div>
                                    {[musician.city, musician.state, musician.country].filter(Boolean).join(', ') || 'Not set'}
                                </div>

                                <div className="font-semibold">Years of Experience:</div>
                                <div>{musician.yearsExperience ?? 'Not provided'}</div>

                                <div className="font-semibold">Experience Level:</div>
                                <div>{musician.experience || 'Not set'}</div>
                                
                                <div className="font-semibold">Website:</div>
                                <div>
                                    {musician.website ? (
                                        <a href={musician.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {musician.website}
                                        </a>
                                    ) : 'Not set'}
                                </div>
                            </div>
                            <div className="pt-4">
                                <h4 className="font-semibold mb-2">Bio:</h4>
                                <p className="text-sm text-muted-foreground">{musician.bio || 'No bio provided.'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 