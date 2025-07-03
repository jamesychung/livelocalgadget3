import { useState, useEffect } from "react";
import { useOutletContext, Link } from 'react-router-dom';
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
    AlertCircle
} from "lucide-react";
import { supabase } from "../lib/supabase";
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
    const context = useOutletContext<AuthOutletContext>();
    const user = context?.user;
    const [isLoading, setIsLoading] = useState(true);
    const [musician, setMusician] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                            venue:venues (
                                id, 
                                name, 
                                address,
                                city,
                                state
                            )
                        `)
                        .eq('musician_id', musicianData.id);

                    if (bookingsError) {
                        console.error("Error loading bookings data:", bookingsError);
                    } else {
                        setBookings(bookingsData || []);
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
    
    const upcomingEvents = bookings.filter((b: any) => b.date && new Date(b.date) > new Date()) ?? [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Musician Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {musician.stage_name || user?.first_name}!
                    </p>
                </div>
                <div className="flex gap-2 self-start">
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
                        <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length ?? 0}</div></CardContent>
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
                                                    <p className="font-medium">{booking.venue?.name || "Unnamed Venue"}</p>
                                                    <p className="text-sm text-muted-foreground">{formatDateTime(booking.date)}</p>
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
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>Manage your performance schedule</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking: any) => (
                                        <div key={booking.id} className="flex justify-between items-center border-b pb-4">
                                            <div>
                                                <p className="font-medium">{booking.venue?.name || "Unnamed Venue"}</p>
                                                <p className="text-sm text-muted-foreground">{formatDateTime(booking.date)}</p>
                                                <p className="text-sm">{booking.notes || "No additional notes"}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="mb-2">{getStatusBadge(booking.status)}</div>
                                                <p className="text-sm font-medium">${booking.totalAmount || 0}</p>
                                            </div>
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
        </div>
    );
} 
