import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useOutletContext, useNavigate } from "react-router";
import { Edit, Clock, MapPin, CalendarDays, Star, DollarSign, AlertCircle, Building, Calendar, Plus, Users, Phone, Globe } from "lucide-react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { ClickableImage } from "../components/shared/ClickableImage";

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

export default function VenueDashboard() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();

    const [{ data: venueData, fetching: venueFetching, error: venueError }] = useFindMany(api.venue, {
        filter: { owner: { id: { equals: user?.id } } },
        select: {
            id: true, name: true, description: true, type: true, capacity: true, city: true,
            state: true, country: true, address: true, website: true, profilePicture: true, 
            rating: true, priceRange: true, amenities: true, hours: true,
            phone: true, email: true, isActive: true, isVerified: true, zipCode: true,
            genres: true, socialLinks: true
        },
        sort: { updatedAt: "Descending" },
        first: 1,
        pause: !user?.id,
    });

    const venue: any = venueData?.[0];

    const [{ data: bookingsData, fetching: bookingsFetching, error: bookingsError }] = useFindMany(api.booking, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true, 
            status: true, 
            date: true,
            startTime: true,
            endTime: true,
            totalAmount: true,
            notes: true,
            musician: { 
                id: true, 
                stageName: true,
                city: true,
                state: true,
                genre: true,
                genres: true
            }
        },
        pause: !venue?.id,
    });

    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            status: true,
            musician: {
                id: true,
                stageName: true,
                city: true,
                state: true,
                genre: true
            }
        },
        pause: !venue?.id,
    });

    const [{ data: reviewsData, fetching: reviewsFetching, error: reviewsError }] = useFindMany(api.review, {
        filter: { venue: { id: { equals: venue?.id } } },
        select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
                firstName: true,
                lastName: true,
            },
        },
        sort: { createdAt: "Descending" },
        first: 10,
        pause: !venue?.id,
    });

    const bookings: any[] = bookingsData || [];
    const events: any[] = eventsData || [];
    const reviews: any[] = reviewsData || [];

    useEffect(() => {
        if (venueError) console.error("Error loading venue data:", venueError);
        if (bookingsError) console.error("Error loading bookings data:", bookingsError);
        if (eventsError) console.error("Error loading events data:", eventsError);
        if (reviewsError) console.error("Error loading reviews data:", reviewsError);
    }, [venueError, bookingsError, eventsError, reviewsError]);

    // Show loading state while fetching
    if (venueFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your venue dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no venue profile found after loading, show a message with option to create one
    if (!venue) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Welcome to Your Venue Dashboard</h1>
                        <p className="text-muted-foreground mb-6">
                            It looks like you haven't created your venue profile yet. Create your profile to start managing your events, bookings, and venue information.
                        </p>
                        <Button asChild>
                            <Link to="/venue-profile/create">
                                Create Venue Profile
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    const upcomingEvents = events.filter((e: any) => e.date && new Date(e.date) > new Date()) ?? [];
    const pendingBookings = bookings.filter((b: any) => b.status === 'pending') ?? [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Venue Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {venue.name || user?.firstName}!
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link to="/venue-events">
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Events
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/venue-profile/edit">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{events.length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{venue.rating ?? 'N/A'}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{venue.capacity ?? 'N/A'}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{pendingBookings.length}</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
                        <CardContent>
                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{event.title || 'Untitled Event'}</p>
                                                <p className="text-sm text-muted-foreground">{formatDateTime(event.date)}</p>
                                                {event.musician && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Featuring: {event.musician.stageName}
                                                    </p>
                                                )}
                                            </div>
                                            {getStatusBadge(event.status)}
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
                                                <h3 className="font-medium">
                                                    {booking.musician ? (
                                                        <Link 
                                                            to={`/musician/${booking.musician.id}`}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {booking.musician.stageName}
                                                        </Link>
                                                    ) : (
                                                        'Musician TBD'
                                                    )}
                                                </h3>
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
                                                        const musician = booking.musician;
                                                        if (musician?.city) {
                                                            return `${musician.city}${musician.state ? `, ${musician.state}` : ''}`;
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
                                                {booking.musician?.genre && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {booking.musician.genre}
                                                        </span>
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

                <TabsContent value="events">
                    <Card>
                        <CardHeader><CardTitle>All Events</CardTitle></CardHeader>
                        <CardContent>
                            {events && events.length > 0 ? (
                                <div className="space-y-4">
                                    {events.map((event) => (
                                        <div key={event.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium">{event.title || 'Untitled Event'}</h3>
                                                {getStatusBadge(event.status)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDateTime(event.date)}
                                                </div>
                                                {event.musician && (
                                                    <div className="flex items-center gap-2">
                                                        <span>Featuring: <Link 
                                                            to={`/musician/${event.musician.id}`}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {event.musician.stageName}
                                                        </Link></span>
                                                    </div>
                                                )}
                                                {event.musician?.city && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        {event.musician.city}{event.musician.state ? `, ${event.musician.state}` : ''}
                                                    </div>
                                                )}
                                                {event.musician?.genre && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {event.musician.genre}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {event.description && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {event.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No events found.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Venue Reviews
                            </CardTitle>
                            <CardDescription>
                                What people are saying about your venue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reviews && reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < review.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {review.reviewer.firstName} {review.reviewer.lastName}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No reviews yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Reviews will appear here after events are completed
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Your venue profile details. Click "Edit Profile" to make changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Profile Picture */}
                            {venue.profilePicture && (
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <ClickableImage 
                                            src={venue.profilePicture} 
                                            alt="Venue Profile" 
                                            className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="font-semibold">Venue Name:</div>
                                <div>{venue.name || 'Not set'}</div>

                                <div className="font-semibold">Contact Email:</div>
                                <div>{venue.email || user?.email || 'Not set'}</div>

                                <div className="font-semibold">Phone:</div>
                                <div>{venue.phone || 'Not set'}</div>
                                
                                <div className="font-semibold">Venue Type:</div>
                                <div>{venue.type || 'Not set'}</div>

                                <div className="font-semibold">Capacity:</div>
                                <div>{venue.capacity ? `${venue.capacity} people` : 'Not set'}</div>

                                <div className="font-semibold">Price Range:</div>
                                <div>{venue.priceRange || 'Not set'}</div>

                                <div className="font-semibold">Location:</div>
                                <div>
                                    {[venue.city, venue.state, venue.country].filter(Boolean).join(', ') || 'Not set'}
                                </div>

                                <div className="font-semibold">Address:</div>
                                <div>{venue.address || 'Not set'}</div>

                                <div className="font-semibold">Zip Code:</div>
                                <div>{venue.zipCode || 'Not set'}</div>
                                
                                <div className="font-semibold">Website:</div>
                                <div>
                                    {venue.website ? (
                                        <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {venue.website}
                                        </a>
                                    ) : 'Not set'}
                                </div>

                                <div className="font-semibold">Genres:</div>
                                <div className="flex flex-wrap gap-1">
                                    {venue.genres && venue.genres.length > 0 ? (
                                        venue.genres.map((g: string, i: number) => <Badge key={i} variant="secondary">{g}</Badge>)
                                    ) : 'Not set'}
                                </div>

                                <div className="font-semibold">Amenities:</div>
                                <div className="flex flex-wrap gap-1">
                                    {venue.amenities && venue.amenities.length > 0 ? (
                                        venue.amenities.map((a: string, i: number) => <Badge key={i} variant="outline">{a}</Badge>)
                                    ) : 'Not set'}
                                </div>
                            </div>
                            <div className="pt-4">
                                <h4 className="font-semibold mb-2">Description:</h4>
                                <p className="text-sm text-muted-foreground">{venue.description || 'No description provided.'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 