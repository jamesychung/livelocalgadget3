import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Building, DollarSign, Star, Mail, Phone, Globe, Edit, Plus, CalendarDays, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useOutletContext, useSearchParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

interface VenueProfile {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  priceRange: string;
  amenities: string[];
  hours: any;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    primaryRole: string;
  };
}

interface Booking {
  id: string;
  status: string;
  proposedDateTime: string;
  terms: string;
  musician: {
    id: string;
    name: string;
    location: string;
  };
  event: {
    id: string;
    title: string;
    description: string;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  status: string;
  musician: {
    id: string;
    name: string;
    location: string;
  };
}

export default function VenueDashboard() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [activeTab, setActiveTab] = useState("overview");
  const [venueProfile, setVenueProfile] = useState<VenueProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadVenueData();
  }, []);

  // Handle tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'bookings', 'events', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const loadVenueData = async () => {
    try {
      setLoading(true);

      // Load venue profile
      const profileResult = await api.venue.findMany({
        filter: { owner: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
          city: true,
          state: true,
          country: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          priceRange: true,
          amenities: true,
          hours: true,
          isActive: true,
          isVerified: true,
          rating: true,
          owner: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            primaryRole: true,
          },
        },
        first: 1
      });

      if (profileResult && profileResult.length > 0) {
        setVenueProfile(profileResult[0]);
      }

      // Load bookings (mock data for now)
      setBookings([
        {
          id: "1",
          status: "pending",
          proposedDateTime: "2024-01-15T20:00:00Z",
          terms: "Jazz trio performance, 3 hours",
          musician: {
            id: "1",
            name: "Sarah Johnson",
            location: "New York, NY"
          },
          event: {
            id: "1",
            title: "Jazz Night",
            description: "Evening of smooth jazz"
          }
        }
      ]);

      // Load events (mock data for now)
      setEvents([
        {
          id: "1",
          title: "Jazz Night",
          description: "Evening of smooth jazz with Sarah Johnson",
          dateTime: "2024-01-15T20:00:00Z",
          status: "confirmed",
          musician: {
            id: "1",
            name: "Sarah Johnson",
            location: "New York, NY"
          }
        }
      ]);

    } catch (err) {
      console.error("Error loading venue data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive", label: string } } = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const config = statusMap[status.toLowerCase()] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Safe string conversion function
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.key) return String(value.key);
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!venueProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Venue Profile Not Found</CardTitle>
            <CardDescription>
              It looks like you don't have a venue profile yet. Let's create one!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/venue-profile/edit">
                Create Venue Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Email Verification Banner */}
        {!user.emailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800">
                  Please verify your email address
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Check your email for a verification link to unlock all features.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Resend verification email
                  api.user.sendVerifyEmail({ email: user.email });
                  alert("Verification email sent! Please check your inbox.");
                }}
              >
                Resend Email
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {safeString(venueProfile.name) || `${safeString(user.firstName)} ${safeString(user.lastName)}`}!
            </h1>
            <p className="text-muted-foreground">
              Manage your venue, events, and bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/venue-profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild>
              <Link to="/venue-events">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-2xl font-bold">{safeString(venueProfile.rating) || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Price Range</p>
                  <p className="text-2xl font-bold">{safeString(venueProfile.priceRange) || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pending Bookings</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status.toLowerCase() === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{safeString(booking.musician?.name)}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(booking.proposedDateTime)}
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent bookings</p>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events.filter(e => new Date(e.dateTime) > new Date()).slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                      {events
                        .filter(e => new Date(e.dateTime) > new Date())
                        .slice(0, 5)
                        .map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{safeString(event.title)}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(event.dateTime)}
                              </p>
                            </div>
                            {getStatusBadge(event.status)}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming events</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>
                  Manage booking requests from musicians
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{safeString(booking.musician?.name)}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="inline h-4 w-4 mr-1" />
                              {formatDateTime(booking.proposedDateTime)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <MapPin className="inline h-4 w-4 mr-1" />
                              {safeString(booking.musician?.location)}
                            </p>
                            {booking.terms && (
                              <p className="text-sm">{safeString(booking.terms)}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {booking.status.toLowerCase() === "pending" && (
                              <>
                                <Button size="sm" variant="default">Accept</Button>
                                <Button size="sm" variant="outline">Decline</Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No bookings found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
                <CardDescription>
                  View and manage your scheduled events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{safeString(event.title)}</h3>
                              {getStatusBadge(event.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="inline h-4 w-4 mr-1" />
                              {formatDateTime(event.dateTime)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <MapPin className="inline h-4 w-4 mr-1" />
                              {safeString(event.musician?.name)} - {safeString(event.musician?.location)}
                            </p>
                            {event.description && (
                              <p className="text-sm">{safeString(event.description)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No events found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Venue Name</label>
                    <p className="text-lg">{safeString(venueProfile.name) || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm">{safeString(venueProfile.description) || "No description added"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <p className="text-sm">{safeString(venueProfile.type) || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Capacity</label>
                    <p className="text-sm">{safeString(venueProfile.capacity) || 0} people</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{safeString(venueProfile.email)}</span>
                  </div>
                  {venueProfile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{safeString(venueProfile.phone)}</span>
                    </div>
                  )}
                  {venueProfile.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={safeString(venueProfile.website)} className="text-sm text-primary hover:underline">
                        {safeString(venueProfile.website)}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {[safeString(venueProfile.city), safeString(venueProfile.state), safeString(venueProfile.country)]
                        .filter(Boolean)
                        .join(", ") || "Location not set"}
                    </span>
                  </div>
                  {venueProfile.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{safeString(venueProfile.address)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Venue Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Price Range</label>
                    <p className="text-sm">{safeString(venueProfile.priceRange) || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amenities</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {venueProfile.amenities && venueProfile.amenities.length > 0 ? (
                        venueProfile.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary">{safeString(amenity)}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No amenities specified</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Venue Active</span>
                    <Badge variant={venueProfile.isActive ? "default" : "secondary"}>
                      {venueProfile.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verified</span>
                    <Badge variant={venueProfile.isVerified ? "default" : "secondary"}>
                      {venueProfile.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{safeString(venueProfile.rating) || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Events</span>
                    <span className="text-sm">{events.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 