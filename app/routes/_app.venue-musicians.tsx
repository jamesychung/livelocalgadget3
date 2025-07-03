import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ArrowLeft, Users, Search, Filter, Calendar, MapPin, Music, DollarSign, Send } from "lucide-react";
import { Link, useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useVenueProfile, useSupabaseQuery, useSupabaseMutation } from "../hooks/useSupabaseData";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";

interface Musician {
    id: string;
    stage_name: string;
    genres: string[];
    availability: any;
    email: string;
    phone: string;
    city: string;
    state: string;
    bio: string;
    hourly_rate: number;
}

interface Event {
    id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    genres: string[];
    venue: {
        id: string;
        name: string;
    };
}

export default function VenueMusiciansPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMusicians, setSelectedMusicians] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [genreFilter, setGenreFilter] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get event data from navigation state
    const eventData = location.state as { eventId?: string; eventTitle?: string; action?: string };

    // Fetch venue profile
    const { data: venue, loading: venueLoading } = useVenueProfile(user?.id);

    // Fetch all musicians
    const { data: musiciansData, loading: musiciansLoading } = useSupabaseQuery(
        async () => {
            return await supabase
                .from('musicians')
                .select(`
                    id,
                    stage_name,
                    genres,
                    availability,
                    email,
                    phone,
                    city,
                    state,
                    bio,
                    hourly_rate
                `)
                .limit(100);
        },
        []
    );

    // Fetch venue's events
    const { data: eventsData, loading: eventsLoading } = useSupabaseQuery(
        async () => {
            if (!venue?.id) return { data: null, error: null };
            return await supabase
                .from('events')
                .select(`
                    id,
                    title,
                    date,
                    start_time,
                    end_time,
                    genres,
                    venue:venues(
                        id,
                        name
                    )
                `)
                .eq('venue_id', venue.id)
                .eq('status', 'invited');
        },
        [venue?.id]
    );

    // Mutation hook for creating bookings
    const { mutate: createBooking, loading: createBookingLoading } = useSupabaseMutation();

    const musicians: Musician[] = musiciansData || [];
    const events: Event[] = eventsData || [];

    // If we have a specific event from navigation, select it
    useEffect(() => {
        if (eventData?.eventId) {
            setSelectedEvents([eventData.eventId]);
        }
    }, [eventData?.eventId]);

    // Available genres for filtering
    const availableGenres = [
        "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip Hop", 
        "R&B", "Classical", "Reggae", "Latin", "World Music", "Alternative", "Indie",
        "Metal", "Punk", "Soul", "Funk", "Gospel", "Bluegrass", "EDM", "House", "Techno"
    ];

    // Filter musicians based on search and genre
    const filteredMusicians = musicians.filter(musician => {
        const matchesSearch = musician.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            musician.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            musician.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            musician.bio?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGenre = genreFilter.length === 0 || 
                           genreFilter.some(genre => 
                               musician.genres?.some(musicianGenre => 
                                   musicianGenre.toLowerCase().includes(genre.toLowerCase())
                               )
                           );
        
        return matchesSearch && matchesGenre;
    });

    // Handle musician selection
    const handleMusicianSelection = (musicianId: string, checked: boolean) => {
        if (checked) {
            setSelectedMusicians(prev => [...prev, musicianId]);
        } else {
            setSelectedMusicians(prev => prev.filter(id => id !== musicianId));
        }
    };

    // Handle event selection
    const handleEventSelection = (eventId: string, checked: boolean) => {
        if (checked) {
            setSelectedEvents(prev => [...prev, eventId]);
        } else {
            setSelectedEvents(prev => prev.filter(id => id !== eventId));
        }
    };

    // Handle genre filter
    const handleGenreFilter = (genre: string, checked: boolean) => {
        if (checked) {
            setGenreFilter(prev => [...prev, genre]);
        } else {
            setGenreFilter(prev => prev.filter(g => g !== genre));
        }
    };

    // Send invitations
    const handleSendInvitations = async () => {
        if (selectedMusicians.length === 0) {
            alert("Please select at least one musician to invite.");
            return;
        }

        if (selectedEvents.length === 0) {
            alert("Please select at least one event to invite musicians to.");
            return;
        }

        setIsSubmitting(true);

        try {
            const invitations = [];
            
            for (const eventId of selectedEvents) {
                for (const musicianId of selectedMusicians) {
                    const event = events.find(e => e.id === eventId);
                    const musician = musicians.find(m => m.id === musicianId);
                    
                    if (event && musician) {
                        invitations.push({
                            event_id: eventId,
                            musician_id: musicianId,
                            venue_id: venue?.id,
                            status: "applied",
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    }
                }
            }

            // Create all invitations
            for (const invitation of invitations) {
                await createBooking(async () => {
                    return await supabase
                        .from('bookings')
                        .insert(invitation);
                });
            }

            alert(`Successfully sent ${invitations.length} invitation(s)!`);
            navigate("/venue-events");
        } catch (error) {
            console.error("Error sending invitations:", error);
            alert("Failed to send invitations. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (venueLoading || musiciansLoading || eventsLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading musicians and events...</p>
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
                    <Button asChild variant="outline" size="sm">
                        <Link to="/venue-events">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Invite Musicians</h1>
                        <p className="text-muted-foreground">
                            Select musicians to invite to your events
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {musicians.length} Musicians
                    </Badge>
                    <Badge variant="secondary">
                        {events.length} Events
                    </Badge>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="search">Search Musicians</Label>
                            <Input
                                id="search"
                                placeholder="Search by name, location, or bio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Filter by Genre</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {availableGenres.slice(0, 8).map((genre) => (
                                    <div key={genre} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={genre}
                                            checked={genreFilter.includes(genre)}
                                            onCheckedChange={(checked) => 
                                                handleGenreFilter(genre, checked as boolean)
                                            }
                                        />
                                        <Label htmlFor={genre} className="text-sm">{genre}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Select Events
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map((event) => (
                                <div key={event.id} className="border rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={selectedEvents.includes(event.id)}
                                            onCheckedChange={(checked) => 
                                                handleEventSelection(event.id, checked as boolean)
                                            }
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(event.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {event.start_time} - {event.end_time}
                                            </p>
                                            {event.genres && event.genres.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {event.genres.map((genre, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {genre}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-muted-foreground">No events available for invitations</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Create events first to invite musicians
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Musicians Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Select Musicians ({filteredMusicians.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredMusicians.length > 0 ? (
                        <div className="space-y-4">
                            {filteredMusicians.map((musician) => (
                                <div key={musician.id} className="border rounded-lg p-4">
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            checked={selectedMusicians.includes(musician.id)}
                                            onCheckedChange={(checked) => 
                                                handleMusicianSelection(musician.id, checked as boolean)
                                            }
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium">{musician.stage_name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {musician.city}, {musician.state}
                                                    </span>
                                                    {musician.hourly_rate && (
                                                        <>
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">
                                                                ${musician.hourly_rate}/hr
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {musician.bio && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {musician.bio}
                                                </p>
                                            )}
                                            {musician.genres && musician.genres.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {musician.genres.map((genre, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {genre}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-muted-foreground">No musicians found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Button asChild variant="outline">
                    <Link to="/venue-events">Cancel</Link>
                </Button>
                <Button 
                    onClick={handleSendInvitations}
                    disabled={selectedMusicians.length === 0 || selectedEvents.length === 0 || isSubmitting}
                    className="flex items-center gap-2"
                >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Sending...' : `Send ${selectedMusicians.length * selectedEvents.length} Invitation(s)`}
                </Button>
            </div>
        </div>
    );
} 
