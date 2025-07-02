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
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

interface Musician {
    id: string;
    stageName: string;
    genres: string[];
    availability: any;
    email: string;
    phone: string;
    city: string;
    state: string;
    bio: string;
    hourlyRate: number;
}

interface Event {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
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

    // Fetch all musicians
    const [{ data: musiciansData, fetching: musiciansFetching }] = useFindMany(api.musician, {
        select: {
            id: true,
            stageName: true,
            genres: true,
            availability: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            bio: true,
            hourlyRate: true
        },
        first: 100
    });

    // Fetch venue's events
    const [{ data: eventsData, fetching: eventsFetching }] = useFindMany(api.event, {
        filter: { 
            venue: { owner: { id: { equals: user?.id } } },
            eventStatus: { equals: "invited" }
        },
        select: {
            id: true,
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            genres: true,
            venue: {
                id: true,
                name: true
            }
        }
    });

    // Create booking action for invitations - temporarily disabled
    // const [createBookingResult, createBooking] = useAction(api.booking.create);

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
        const matchesSearch = musician.stageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                            booking: {
                                event: { _link: eventId },
                                musician: { _link: musicianId },
                                bookedBy: { _link: user.id },
                                status: "invited",
                            }
                        });
                    }
                }
            }

            // Create all invitations
            for (const invitation of invitations) {
                // await createBooking(invitation);
                console.log("Would create invitation:", invitation);
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
    if (musiciansFetching || eventsFetching) {
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
                    <Button variant="outline" asChild>
                        <Link to="/venue-events">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Invite Musicians</h1>
                        <p className="text-muted-foreground">
                            {eventData?.eventTitle ? `Invite musicians to "${eventData.eventTitle}"` : "Select events and musicians to invite"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Event Selection */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Select Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <p className="text-muted-foreground">No invited events found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                            <Checkbox
                                                id={`event-${event.id}`}
                                                checked={selectedEvents.includes(event.id)}
                                                onCheckedChange={(checked) => handleEventSelection(event.id, checked as boolean)}
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={`event-${event.id}`} className="font-medium cursor-pointer">
                                                    {event.title}
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                                                </p>
                                                {event.genres && event.genres.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {event.genres.slice(0, 2).map((genre, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {genre}
                                                            </Badge>
                                                        ))}
                                                        {event.genres.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{event.genres.length - 2} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Genre Filter */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Filter by Genre
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                {availableGenres.map((genre) => (
                                    <div key={genre} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`genre-${genre}`}
                                            checked={genreFilter.includes(genre)}
                                            onCheckedChange={(checked) => handleGenreFilter(genre, checked as boolean)}
                                        />
                                        <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                                            {genre}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Musician Selection */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Select Musicians ({selectedMusicians.length} selected)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search musicians by name, location, or bio..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Musicians Table */}
                            {filteredMusicians.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">Select</TableHead>
                                                <TableHead>Musician</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Genres</TableHead>
                                                <TableHead>Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredMusicians.map((musician) => (
                                                <TableRow key={musician.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedMusicians.includes(musician.id)}
                                                            onCheckedChange={(checked) => handleMusicianSelection(musician.id, checked as boolean)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{musician.stageName}</div>
                                                            <div className="text-sm text-muted-foreground">{musician.email}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <MapPin className="h-3 w-3" />
                                                            {musician.city && musician.state ? `${musician.city}, ${musician.state}` : 'Not specified'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {musician.genres?.slice(0, 3).map((genre, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {genre}
                                                                </Badge>
                                                            ))}
                                                            {musician.genres && musician.genres.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{musician.genres.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {musician.hourlyRate ? (
                                                            <div className="flex items-center gap-1 text-green-600">
                                                                <DollarSign className="h-3 w-3" />
                                                                {musician.hourlyRate}/hr
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">TBD</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No musicians found</h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm || genreFilter.length > 0 
                                            ? "Try adjusting your search or filter criteria."
                                            : "There are currently no musicians available."
                                        }
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild>
                            <Link to="/venue-events">Cancel</Link>
                        </Button>
                        <Button 
                            onClick={handleSendInvitations}
                            disabled={selectedMusicians.length === 0 || selectedEvents.length === 0 || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Sending..." : `Send ${selectedMusicians.length * selectedEvents.length} Invitation(s)`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
