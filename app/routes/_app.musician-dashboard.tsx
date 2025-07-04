import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
    AlertCircle,
    RefreshCw,
    Eye
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { BookingActionButtons } from '../components/shared/BookingActionButtons';
import { BookingDetailDialog } from '../components/shared/BookingDetailDialog';

// Helper function to render status badges
function getStatusBadge(status: string) {
    const statusColors: Record<string, string> = {
        applied: "bg-blue-100 text-blue-800",
        selected: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-gray-100 text-gray-800",
        pending_cancel: "bg-orange-100 text-orange-800",
    };
    
    const statusLabels: Record<string, string> = {
        applied: "📝 Applied",
        selected: "⭐ Venue Selected You",
        confirmed: "✅ Confirmed",
        cancelled: "❌ Cancelled",
        completed: "🎉 Completed",
        pending_cancel: "⏳ Cancel Requested",
    };
    
    return (
        <Badge className={statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800"}>
            {statusLabels[status?.toLowerCase()] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown")}
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
    const context = useOutletContext<AuthOutletContext>();
    const user = context?.user;
    const [isLoading, setIsLoading] = useState(true);
    const [musician, setMusician] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const refreshBookings = async () => {
        if (!musician?.id) return;
        
        console.log('Refreshing bookings for musician:', musician.id);
        setIsRefreshing(true);
        try {
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    event:events (
                        id,
                        title,
                        date,
                        start_time,
                        end_time,
                        description,
                        created_at,
                        venue:venues (
                            id, 
                            name, 
                            address,
                            city,
                            state
                        )
                    ),
                    musician:musicians (
                        id,
                        stage_name,
                        email
                    )
                `)
                .eq('musician_id', musician.id);

            if (bookingsError) {
                console.error("Error refreshing bookings data:", bookingsError);
            } else {
                console.log('Bookings refreshed successfully:', bookingsData);
                console.log('Current bookings statuses:', bookingsData?.map(b => ({ id: b.id, status: b.status, event: b.event?.title })));
                setBookings(bookingsData || []);
                setLastRefreshTime(new Date());
            }
        } catch (error) {
            console.error('Error refreshing bookings:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Handle booking click to view details
    const handleBookingClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    // Handle booking status update
    const handleBookingStatusUpdate = (updatedBooking: any) => {
        setBookings(prevBookings => 
            prevBookings.map(b => 
                b.id === updatedBooking.id 
                    ? updatedBooking
                    : b
            )
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user?.id) {
                    setError("User not found");
                    setIsLoading(false);
                    return;
                }

                // Check if user has a musician profile
                const { data: musicianData, error: musicianError } = await supabase
                    .from('musicians')
                    .select('*')
                    .eq('email', user.email)
                    .single();

                if (musicianError) {
                    console.error("Error loading musician data:", musicianError);
                    setError("Could not load musician profile");
                    setIsLoading(false);
                    return;
                }

                setMusician(musicianData);

                // If musician profile exists, fetch bookings
                if (musicianData?.id) {
                    const { data: bookingsData, error: bookingsError } = await supabase
                        .from('bookings')
                        .select(`
                            *,
                            event:events (
                                id,
                                title,
                                date,
                                start_time,
                                end_time,
                                description,
                                created_at,
                                venue:venues (
                                    id, 
                                    name, 
                                    address,
                                    city,
                                    state
                                )
                            ),
                            musician:musicians (
                                id,
                                stage_name,
                                email
                            )
                        `)
                        .eq('musician_id', musicianData.id);

                    if (bookingsError) {
                        console.error("Error loading bookings data:", bookingsError);
                    } else {
                        setBookings(bookingsData || []);
                        setLastRefreshTime(new Date());
                    }
                }
            } catch (err) {
                console.error("Error in data fetching:", err);
                setError("An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Auto-refresh bookings every 30 seconds to check for status updates
    useEffect(() => {
        if (!musician?.id) return;

        const interval = setInterval(() => {
            refreshBookings();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [musician?.id]);

    // Show loading state while fetching
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your musician dashboard...</p>
                </div>
            </div>
        );
    }

    // If error occurred
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // If no musician profile found after loading, show a message with option to create one
    if (!musician) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] px-4">
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
        );
    }
    
    const upcomingEvents = bookings.filter((b: any) => b.event?.date && new Date(b.event.date) > new Date()) ?? [];
    const bookingsNeedingAttention = bookings.filter((b: any) => b.status === 'selected').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Musician Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {musician.stage_name || user?.first_name}!
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Last updated: {lastRefreshTime.toLocaleTimeString()}
                        {bookingsNeedingAttention > 0 && (
                            <span className="ml-2 text-orange-600 font-medium">
                                • {bookingsNeedingAttention} booking{bookingsNeedingAttention > 1 ? 's' : ''} need{bookingsNeedingAttention > 1 ? '' : 's'} your attention
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2 self-start">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={refreshBookings}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/availability">
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Availability
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link to={`/musician-profile/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{musician.total_gigs ?? 0}</div></CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{musician.rating ?? 'N/A'}</div></CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">${musician.hourly_rate ?? 0}</div></CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Awaiting Confirmation</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{bookings.filter(b => b.status === 'selected').length ?? 0}</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Upcoming Bookings</CardTitle>
                                <CardDescription>Your next scheduled performances</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {upcomingEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingEvents.slice(0, 3).map((booking: any) => (
                                            <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <p className="font-medium">{booking.event?.title || "Untitled Event"}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.event?.venue?.name} • {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
                                                    </p>
                                                </div>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No upcoming bookings scheduled.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Profile Summary</CardTitle>
                                <CardDescription>Your musician profile information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Genres: {musician.genres?.join(', ') || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Location: {[musician.city, musician.state].filter(Boolean).join(', ') || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Contact: {musician.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Email: {musician.email}</span>
                                    </div>
                                    {musician.website && (
                                        <div className="flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <a href={musician.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                                Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>My Bookings</CardTitle>
                            <CardDescription>Manage your performance schedule and confirm bookings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking: any) => (
                                        <div key={booking.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-medium text-lg">{booking.event?.title || "Untitled Event"}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.event?.venue?.name || "Unknown Venue"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {booking.event?.start_time && booking.event?.end_time 
                                                            ? `${booking.event.start_time} - ${booking.event.end_time}`
                                                            : "Time TBD"
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        ${booking.proposed_rate || booking.musician?.hourly_rate || 0}/hr
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {booking.musician_pitch && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Pitch:</p>
                                                    <p className="text-sm bg-muted p-2 rounded">{booking.musician_pitch}</p>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between mt-3">
                                                <BookingActionButtons 
                                                    booking={booking}
                                                    currentUser={user}
                                                    onStatusUpdate={handleBookingStatusUpdate}
                                                />
                                                
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleBookingClick(booking)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
                                            
                                            {booking.status === "confirmed" && (
                                                <div className="mt-3">
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        ✅ Booking Confirmed
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No Bookings Yet</h3>
                                    <p className="text-muted-foreground mt-2">
                                        You don't have any bookings yet. Apply to events to get started.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Musician Profile</CardTitle>
                            <CardDescription>Your public profile information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {musician.profile_picture && (
                                    <div className="flex justify-center">
                                        <img 
                                            src={musician.profile_picture} 
                                            alt={musician.stage_name} 
                                            className="h-40 w-40 object-cover rounded-full"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <h3 className="text-lg font-medium">About</h3>
                                    <p className="text-muted-foreground mt-2">
                                        {musician.bio || "No bio provided yet."}
                                    </p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium">Details</h4>
                                        <ul className="mt-2 space-y-2">
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Stage Name:</span>
                                                <span>{musician.stage_name}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Genres:</span>
                                                <span>{musician.genres?.join(', ') || 'Not specified'}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Location:</span>
                                                <span>{[musician.city, musician.state].filter(Boolean).join(', ') || 'Not specified'}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Experience:</span>
                                                <span>{musician.years_experience ? `${musician.years_experience} years` : 'Not specified'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium">Contact & Booking</h4>
                                        <ul className="mt-2 space-y-2">
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Email:</span>
                                                <span>{musician.email}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Phone:</span>
                                                <span>{musician.phone || 'Not provided'}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-muted-foreground">Hourly Rate:</span>
                                                <span>${musician.hourly_rate || 'Not set'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <Button asChild>
                                        <Link to="/musician-profile/edit">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {/* Booking Detail Dialog with Activity Log */}
            <BookingDetailDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                booking={selectedBooking}
                currentUser={user}
                onStatusUpdate={handleBookingStatusUpdate}
            />
        </div>
    );
} 
