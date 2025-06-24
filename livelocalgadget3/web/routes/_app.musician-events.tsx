import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Music, Users, Calendar as CalendarIcon, Search, Filter, X, Check, X as XIcon } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

interface FilterState {
  searchTerm: string;
  selectedGenre: string;
  selectedBudgetRange: string;
  selectedLocation: string;
  selectedStatus: string;
}

export default function MusicianEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("available");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        proposedRate: "",
        equipmentProvided: [] as string[],
        pitch: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localApplications, setLocalApplications] = useState<any[]>([]);
    const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

    const [filters, setFilters] = useState<FilterState>({
        searchTerm: "",
        selectedGenre: "all",
        selectedBudgetRange: "all",
        selectedLocation: "all",
        selectedStatus: "all"
    });

    // Fetch musician profile
    const [{ data: musicianData, fetching: musicianFetching }] = useFindMany(api.musician, {
        filter: { user: { id: { equals: user?.id } } },
        select: {
            id: true,
            name: true,
            stageName: true,
            genre: true,
            genres: true,
            city: true,
            state: true,
            hourlyRate: true
        },
        first: 1,
        pause: !user?.id,
    });

    const musician = musicianData?.[0] as any;

    // Fetch all events (both open and confirmed)
    const [{ data: eventsData, fetching: eventsFetching, error: eventsError }] = useFindMany(api.event, {
        filter: { 
            isActive: { equals: true },
            isPublic: { equals: true }
        },
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            genres: true,
            budgetRange: true,
            locationRequirements: true,
            interestDeadline: true,
            equipment: true,
            bookingType: true,
            status: true,
            ticketPrice: true,
            venue: {
                id: true,
                name: true,
                city: true,
                state: true,
                address: true
            },
            musician: {
                id: true,
                name: true,
                stageName: true,
                genre: true
            }
        },
        sort: { date: "Ascending" }
    });

    // Fetch musician's submitted interests/applications
    const [{ data: applicationsData, fetching: applicationsFetching }] = useFindMany(api.booking, {
        filter: { 
            musician: { id: { equals: musician?.id } }
        },
        select: {
            id: true,
            status: true,
            proposedRate: true,
            musicianPitch: true,
            equipmentProvided: true,
            date: true,
            startTime: true,
            endTime: true,
            bookingType: true,
            createdAt: true,
            event: {
                id: true,
                title: true,
                date: true,
                status: true,
                venue: {
                    id: true,
                    name: true,
                    city: true,
                    state: true
                }
            }
        },
        pause: !musician?.id,
    });

    // Initialize local applications with fetched data
    useEffect(() => {
        if (applicationsData && applicationsData.length > 0 && localApplications.length === 0) {
            setLocalApplications(applicationsData);
        }
    }, [applicationsData, localApplications.length]);

    // Create booking action for applications
    const [createBookingResult, createBooking] = useAction(api.booking.create);

    const events = (eventsData || []) as any[];
    const applications = (applicationsData || []) as any[];
    
    // Use local applications state, initialized with fetched data
    const allApplications = localApplications.length > 0 ? localApplications : applications;

    // Check if musician has already applied for an event
    const getApplicationForEvent = (eventId: string) => {
        return allApplications.find(app => app.event?.id === eventId);
    };

    // Separate events by type
    const openEvents = events.filter(event => 
        event.bookingType === "open_marketplace" && 
        event.status === "open" &&
        (!event.interestDeadline || new Date(event.interestDeadline) > new Date()) &&
        !getApplicationForEvent(event.id) // Filter out events already applied for
    );

    const confirmedEvents = events.filter(event => 
        event.status === "confirmed" && event.musician
    );

    const appliedEvents = allApplications.filter(app => 
        app.bookingType === "interest_expression" || app.bookingType === "direct_invitation"
    );

    // Filter events based on criteria
    const filterEvents = (eventList: any[]) => {
        return eventList.filter((event) => {
            // Search term filter
            const matchesSearch = !filters.searchTerm || 
                (event.title && event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
                (event.description && event.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
                (event.venue?.name && event.venue.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
            
            // Genre filter
            const matchesGenre = filters.selectedGenre === "all" || 
                (event.genres && event.genres.some((g: string) => g.toLowerCase() === filters.selectedGenre.toLowerCase()));
            
            // Location filter
            const matchesLocation = filters.selectedLocation === "all" || 
                (event.venue?.city && event.venue?.state && 
                 `${event.venue.city}, ${event.venue.state}` === filters.selectedLocation);
            
            // Budget filter
            let matchesBudget = true;
            if (filters.selectedBudgetRange !== "all" && event.budgetRange) {
                const minBudget = event.budgetRange.min || 0;
                const maxBudget = event.budgetRange.max || 0;
                switch (filters.selectedBudgetRange) {
                    case "under100":
                        matchesBudget = maxBudget < 100;
                        break;
                    case "100to300":
                        matchesBudget = minBudget >= 100 && maxBudget <= 300;
                        break;
                    case "300to500":
                        matchesBudget = minBudget >= 300 && maxBudget <= 500;
                        break;
                    case "over500":
                        matchesBudget = minBudget > 500;
                        break;
                }
            }
            
            return matchesSearch && matchesGenre && matchesLocation && matchesBudget;
        });
    };

    const filteredOpenEvents = filterEvents(openEvents);
    const filteredConfirmedEvents = filterEvents(confirmedEvents);

    // Get unique genres for filter
    const genres = Array.from(new Set(
        events.flatMap(event => event.genres || []).filter(Boolean)
    )).sort();

    // Get unique locations for filter
    const locations = Array.from(new Set(
        events.map(event => `${event.venue?.city}, ${event.venue?.state}`).filter(Boolean)
    )).sort();

    const handleApply = async () => {
        if (!selectedEvent || !musician?.id) return;
        
        setIsSubmitting(true);
        try {
            const newBooking = {
                bookingType: "interest_expression",
                status: "interest_expressed",
                proposedRate: parseFloat(applicationForm.proposedRate),
                musicianPitch: applicationForm.pitch,
                equipmentProvided: applicationForm.equipmentProvided,
                date: selectedEvent.date,
                startTime: selectedEvent.startTime,
                endTime: selectedEvent.endTime,
                totalAmount: parseFloat(applicationForm.proposedRate),
                isActive: true,
                musician: { _link: musician.id },
                venue: { _link: selectedEvent.venue.id },
                event: { _link: selectedEvent.id },
                bookedBy: { _link: user.id }
            };

            console.log("Submitting booking:", newBooking);

            const result = await createBooking(newBooking);
            
            if (result.error) {
                throw new Error(result.error.message || "Failed to submit application");
            }

            console.log("Booking created successfully:", result);

            // Create the new application object for local state
            const newApplication = {
                id: result.record?.id || `temp-${Date.now()}`,
                status: "interest_expressed",
                proposedRate: parseFloat(applicationForm.proposedRate),
                musicianPitch: applicationForm.pitch,
                equipmentProvided: applicationForm.equipmentProvided,
                date: selectedEvent.date,
                startTime: selectedEvent.startTime,
                endTime: selectedEvent.endTime,
                bookingType: "interest_expression",
                createdAt: new Date().toISOString(),
                event: {
                    id: selectedEvent.id,
                    title: selectedEvent.title,
                    date: selectedEvent.date,
                    status: selectedEvent.status,
                    venue: {
                        id: selectedEvent.venue.id,
                        name: selectedEvent.venue.name,
                        city: selectedEvent.venue.city,
                        state: selectedEvent.venue.state
                    }
                }
            };

            // Add to local applications state
            setLocalApplications(prev => [...prev, newApplication]);

            // Reset form and close dialog
            setApplicationForm({
                proposedRate: "",
                equipmentProvided: [],
                pitch: ""
            });
            setSelectedEvent(null);
            setIsDialogOpen(false);
            
            // Switch to applications tab
            setActiveTab("applications");
            
            // Show success message
            alert("Application submitted successfully! Check the 'My Applications' tab to view your submission.");
            
        } catch (error) {
            console.error("Error submitting application:", error);
            alert(`Error submitting application: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (eventId: string) => {
        // For now, just log the rejection
        // In a full implementation, this would create a booking record with "rejected" status
        console.log("Rejected event:", eventId);
    };

    const formatDateTime = (date: string, time: string) => {
        return new Date(`${date}T${time}`).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const formatDeadline = (deadline: string) => {
        return new Date(deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const getMatchPercentage = (event: any) => {
        // Simple matching algorithm - can be enhanced later
        let score = 0;
        if (musician?.genres && event.genres) {
            const matchingGenres = musician.genres.filter((g: string) => 
                event.genres.includes(g)
            );
            score += (matchingGenres.length / Math.max(musician.genres.length, event.genres.length)) * 50;
        }
        if (musician?.hourlyRate && event.budgetRange) {
            const avgBudget = (event.budgetRange.min + event.budgetRange.max) / 2;
            if (musician.hourlyRate >= event.budgetRange.min && musician.hourlyRate <= event.budgetRange.max) {
                score += 50;
            }
        }
        return Math.min(Math.round(score), 100);
    };

    // Format application timestamp
    const formatApplicationTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    // Toggle application expansion
    const toggleApplicationExpansion = (applicationId: string) => {
        setExpandedApplications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(applicationId)) {
                newSet.delete(applicationId);
            } else {
                newSet.add(applicationId);
            }
            return newSet;
        });
    };

    // Show loading state while fetching musician profile
    if (musicianFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading musician profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no musician profile found
    if (!musician) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Musician Events</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to create a musician profile before you can view events.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/musician-profile/edit">
                                    Create Musician Profile
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/musician-dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
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
                        <Link to="/musician-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Musician Events</h1>
                        <p className="text-muted-foreground">
                            Browse events and submit applications
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{filteredOpenEvents.length}</p>
                                <p className="text-sm text-muted-foreground">Available Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Music className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{appliedEvents.length}</p>
                                <p className="text-sm text-muted-foreground">Applications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">${musician.hourlyRate || 0}</p>
                                <p className="text-sm text-muted-foreground">Your Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-2xl font-bold">{filteredConfirmedEvents.length}</p>
                                <p className="text-sm text-muted-foreground">Confirmed Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Filters</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                            {showFilters ? "Hide" : "Show"} Filters
                        </Button>
                    </div>
                </CardHeader>
                {showFilters && (
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    placeholder="Search events..."
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="genre-filter">Genre</Label>
                                <Select value={filters.selectedGenre} onValueChange={(value) => setFilters({...filters, selectedGenre: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All genres" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All genres</SelectItem>
                                        {genres.map((genre) => (
                                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="budget-filter">Budget Range</Label>
                                <Select value={filters.selectedBudgetRange} onValueChange={(value) => setFilters({...filters, selectedBudgetRange: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All budgets" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All budgets</SelectItem>
                                        <SelectItem value="under100">Under $100</SelectItem>
                                        <SelectItem value="100to300">$100 - $300</SelectItem>
                                        <SelectItem value="300to500">$300 - $500</SelectItem>
                                        <SelectItem value="over500">Over $500</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="location-filter">Location</Label>
                                <Select value={filters.selectedLocation} onValueChange={(value) => setFilters({...filters, selectedLocation: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All locations</SelectItem>
                                        {locations.map((location) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="available">Available Events</TabsTrigger>
                    <TabsTrigger value="applications">My Applications</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed Events</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="space-y-6">
                    {eventsError && (
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-red-600">Error loading events: {eventsError.message}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-4">
                        {filteredOpenEvents.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No available events found matching your criteria.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredOpenEvents.map((event) => (
                                <Card key={event.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-semibold">{event.title}</h3>
                                                    <Badge variant="secondary">Match: {getMatchPercentage(event)}%</Badge>
                                                </div>
                                                <p className="text-muted-foreground mb-3">{event.description}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {formatDateTime(event.date, event.startTime)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {event.venue.name}, {event.venue.city}, {event.venue.state}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            ${event.budgetRange?.min || 0} - ${event.budgetRange?.max || 0}
                                                        </span>
                                                    </div>
                                                    
                                                    {event.interestDeadline && (
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                Deadline: {formatDeadline(event.interestDeadline)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {event.genres?.map((genre: string) => (
                                                        <Badge key={genre} variant="outline">{genre}</Badge>
                                                    ))}
                                                </div>

                                                {/* Musician-specific details */}
                                                <div className="bg-blue-50 p-4 rounded-md mb-4">
                                                    <h4 className="font-semibold text-blue-900 mb-2">Musician Details</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <strong>Budget Range:</strong> ${event.budgetRange?.min || 0} - ${event.budgetRange?.max || 0}
                                                        </div>
                                                        {event.locationRequirements && (
                                                            <div>
                                                                <strong>Location Requirements:</strong> {event.locationRequirements}
                                                            </div>
                                                        )}
                                                        {event.equipment && event.equipment.length > 0 && (
                                                            <div className="md:col-span-2">
                                                                <strong>Equipment Needs:</strong>
                                                                <ul className="list-disc list-inside mt-1">
                                                                    {event.equipment.map((eq: any, index: number) => (
                                                                        <li key={index}>
                                                                            {eq.item} - {eq.venueProvides ? 'Venue provides' : 'Musician provides'}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 ml-4">
                                                {(() => {
                                                    const application = getApplicationForEvent(event.id);
                                                    if (application) {
                                                        return (
                                                            <div className="flex flex-col items-end gap-2">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Applied: {formatApplicationTime(application.createdAt || new Date().toISOString())}
                                                                </Badge>
                                                                <Badge variant={
                                                                    application.status === "interest_expressed" ? "secondary" :
                                                                    application.status === "pending_confirmation" ? "default" :
                                                                    application.status === "confirmed" ? "default" :
                                                                    "destructive"
                                                                } className="text-xs">
                                                                    {application.status.replace("_", " ").toUpperCase()}
                                                                </Badge>
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    return (
                                                        <>
                                                            <Dialog open={isDialogOpen && selectedEvent?.id === event.id} onOpenChange={setIsDialogOpen}>
                                                                <DialogTrigger asChild>
                                                                    <Button 
                                                                        onClick={() => {
                                                                            setSelectedEvent(event);
                                                                            setIsDialogOpen(true);
                                                                        }}
                                                                        variant="default"
                                                                    >
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        Apply
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-md">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Apply for {event.title}</DialogTitle>
                                                                    </DialogHeader>
                                                                    
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <Label htmlFor="proposed-rate">Your Proposed Rate ($)</Label>
                                                                            <Input
                                                                                id="proposed-rate"
                                                                                type="number"
                                                                                min={event.budgetRange?.min || 0}
                                                                                max={event.budgetRange?.max || 9999}
                                                                                value={applicationForm.proposedRate}
                                                                                onChange={(e) => setApplicationForm({...applicationForm, proposedRate: e.target.value})}
                                                                                placeholder="Enter your rate"
                                                                                className={(() => {
                                                                                    const rate = parseFloat(applicationForm.proposedRate);
                                                                                    const minBudget = event.budgetRange?.min || 0;
                                                                                    return rate > 0 && rate < minBudget ? "border-red-500" : "";
                                                                                })()}
                                                                            />
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                Budget range: ${event.budgetRange?.min || 0} - ${event.budgetRange?.max || 0}
                                                                            </p>
                                                                            {(() => {
                                                                                const rate = parseFloat(applicationForm.proposedRate);
                                                                                const minBudget = event.budgetRange?.min || 0;
                                                                                if (rate > 0 && rate < minBudget) {
                                                                                    return (
                                                                                        <p className="text-xs text-red-600 mt-1">
                                                                                            ⚠️ Your rate is below the venue's minimum budget. Please increase your rate to at least ${minBudget}.
                                                                                        </p>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <Label htmlFor="equipment">Equipment You Can Provide</Label>
                                                                            <div className="space-y-2 mt-2">
                                                                                {/* Select All checkbox */}
                                                                                {event.equipment?.filter((eq: any) => !eq.venueProvides).length > 0 && (
                                                                                    <div className="border-b pb-2 mb-2">
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                id="select-all-equipment"
                                                                                                checked={
                                                                                                    event.equipment?.filter((eq: any) => !eq.venueProvides).length > 0 &&
                                                                                                    event.equipment?.filter((eq: any) => !eq.venueProvides).every((eq: any) => 
                                                                                                        applicationForm.equipmentProvided.includes(eq.item)
                                                                                                    )
                                                                                                }
                                                                                                onChange={(e) => {
                                                                                                    const equipmentItems = event.equipment?.filter((eq: any) => !eq.venueProvides).map((eq: any) => eq.item) || [];
                                                                                                    if (e.target.checked) {
                                                                                                        // Select all equipment items
                                                                                                        setApplicationForm({
                                                                                                            ...applicationForm,
                                                                                                            equipmentProvided: [...new Set([...applicationForm.equipmentProvided, ...equipmentItems])]
                                                                                                        });
                                                                                                    } else {
                                                                                                        // Deselect all equipment items
                                                                                                        setApplicationForm({
                                                                                                            ...applicationForm,
                                                                                                            equipmentProvided: applicationForm.equipmentProvided.filter(item => !equipmentItems.includes(item))
                                                                                                        });
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <label htmlFor="select-all-equipment" className="text-sm font-medium">
                                                                                                Select All Equipment
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                
                                                                                {/* Individual equipment checkboxes */}
                                                                                {event.equipment?.filter((eq: any) => !eq.venueProvides).map((equipment: any, index: number) => (
                                                                                    <div key={index} className="flex items-center space-x-2">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`equipment-${index}`}
                                                                                            checked={applicationForm.equipmentProvided.includes(equipment.item)}
                                                                                            onChange={(e) => {
                                                                                                if (e.target.checked) {
                                                                                                    setApplicationForm({
                                                                                                        ...applicationForm,
                                                                                                        equipmentProvided: [...applicationForm.equipmentProvided, equipment.item]
                                                                                                    });
                                                                                                } else {
                                                                                                    setApplicationForm({
                                                                                                        ...applicationForm,
                                                                                                        equipmentProvided: applicationForm.equipmentProvided.filter(item => item !== equipment.item)
                                                                                                    });
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <label htmlFor={`equipment-${index}`} className="text-sm">
                                                                                            {equipment.item}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <Label htmlFor="pitch">Why You're a Great Fit</Label>
                                                                            <Textarea
                                                                                id="pitch"
                                                                                value={applicationForm.pitch}
                                                                                onChange={(e) => setApplicationForm({...applicationForm, pitch: e.target.value})}
                                                                                placeholder="Tell the venue why you'd be perfect for this event..."
                                                                                rows={4}
                                                                            />
                                                                        </div>
                                                                        
                                                                        <div className="flex gap-2 justify-end">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setSelectedEvent(null);
                                                                                    setIsDialogOpen(false);
                                                                                    setApplicationForm({
                                                                                        proposedRate: "",
                                                                                        equipmentProvided: [],
                                                                                        pitch: ""
                                                                                    });
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                onClick={handleApply}
                                                                                disabled={(() => {
                                                                                    const rate = parseFloat(applicationForm.proposedRate);
                                                                                    const minBudget = selectedEvent?.budgetRange?.min || 0;
                                                                                    return isSubmitting || 
                                                                                           !applicationForm.proposedRate || 
                                                                                           !applicationForm.pitch ||
                                                                                           (rate > 0 && rate < minBudget);
                                                                                })()}
                                                                            >
                                                                                {isSubmitting ? "Submitting..." : "Submit Application"}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                            
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => handleReject(event.id)}
                                                            >
                                                                <XIcon className="mr-2 h-4 w-4" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appliedEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Browse available events and submit applications to get started!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {appliedEvents.map((application) => (
                                        <Card key={application.id} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-6">
                                                {/* Event Details Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="text-xl font-semibold">
                                                                {application.event?.title}
                                                            </h3>
                                                            <Badge variant={
                                                                application.status === "interest_expressed" ? "secondary" :
                                                                application.status === "pending_confirmation" ? "default" :
                                                                application.status === "confirmed" ? "default" :
                                                                "destructive"
                                                            }>
                                                                {application.status.replace("_", " ").toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        
                                                        {/* Application Timestamp */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Badge variant="outline" className="text-xs">
                                                                Applied: {formatApplicationTime(application.createdAt || new Date().toISOString())}
                                                            </Badge>
                                                        </div>
                                                        
                                                        {/* Event Details Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>
                                                                    {application.event?.venue?.name}, {application.event?.venue?.city}, {application.event?.venue?.state}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {application.event?.date ? new Date(application.event.date).toLocaleDateString() : "TBD"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                <span>
                                                                    {application.startTime} - {application.endTime}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Expand/Collapse Button */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleApplicationExpansion(application.id)}
                                                        className="ml-4"
                                                    >
                                                        {expandedApplications.has(application.id) ? "Hide Details" : "Show Details"}
                                                    </Button>
                                                </div>
                                                
                                                {/* Expandable Event Details */}
                                                {expandedApplications.has(application.id) && (
                                                    <div className="border-t pt-4 space-y-4">
                                                        {/* Full Event Details */}
                                                        <div className="bg-gray-50 p-4 rounded-md">
                                                            <h4 className="font-semibold text-gray-900 mb-3">Event Details</h4>
                                                            
                                                            {/* Event Description */}
                                                            {application.event?.description && (
                                                                <div className="mb-4">
                                                                    <strong>Description:</strong>
                                                                    <p className="mt-1 text-muted-foreground">{application.event.description}</p>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Event Details Grid */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                                                <div>
                                                                    <strong>Event Date:</strong>
                                                                    <p className="text-muted-foreground">
                                                                        {application.event?.date ? new Date(application.event.date).toLocaleDateString("en-US", {
                                                                            weekday: "long",
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric"
                                                                        }) : "TBD"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <strong>Event Time:</strong>
                                                                    <p className="text-muted-foreground">
                                                                        {application.startTime} - {application.endTime}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <strong>Venue:</strong>
                                                                    <p className="text-muted-foreground">
                                                                        {application.event?.venue?.name}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <strong>Location:</strong>
                                                                    <p className="text-muted-foreground">
                                                                        {application.event?.venue?.city}, {application.event?.venue?.state}
                                                                    </p>
                                                                </div>
                                                                {application.event?.venue?.address && (
                                                                    <div className="md:col-span-2">
                                                                        <strong>Address:</strong>
                                                                        <p className="text-muted-foreground">{application.event.venue.address}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Event Requirements */}
                                                            <div className="space-y-3">
                                                                {/* Budget Range */}
                                                                {application.event?.budgetRange && (
                                                                    <div>
                                                                        <strong>Budget Range:</strong>
                                                                        <p className="text-muted-foreground">
                                                                            ${application.event.budgetRange.min || 0} - ${application.event.budgetRange.max || 0}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Genres */}
                                                                {application.event?.genres && application.event.genres.length > 0 && (
                                                                    <div>
                                                                        <strong>Genres:</strong>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {application.event.genres.map((genre: string, index: number) => (
                                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                                    {genre}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Equipment Needs */}
                                                                {application.event?.equipment && application.event.equipment.length > 0 && (
                                                                    <div>
                                                                        <strong>Equipment Needs:</strong>
                                                                        <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                                            {application.event.equipment.map((eq: any, index: number) => (
                                                                                <li key={index}>
                                                                                    {eq.item} - {eq.venueProvides ? 'Venue provides' : 'Musician provides'}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Location Requirements */}
                                                                {application.event?.locationRequirements && (
                                                                    <div>
                                                                        <strong>Location Requirements:</strong>
                                                                        <p className="text-muted-foreground">{application.event.locationRequirements}</p>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Interest Deadline */}
                                                                {application.event?.interestDeadline && (
                                                                    <div>
                                                                        <strong>Interest Deadline:</strong>
                                                                        <p className="text-muted-foreground">
                                                                            {new Date(application.event.interestDeadline).toLocaleDateString("en-US", {
                                                                                month: "short",
                                                                                day: "numeric",
                                                                                year: "numeric"
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Your Application Details */}
                                                        <div className="bg-blue-50 p-4 rounded-md">
                                                            <h4 className="font-semibold text-blue-900 mb-3">Your Application Details</h4>
                                                            
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <strong>Proposed Rate:</strong> ${application.proposedRate}
                                                                </div>
                                                                <div>
                                                                    <strong>Application Type:</strong> {application.bookingType.replace("_", " ").toUpperCase()}
                                                                </div>
                                                                
                                                                {application.musicianPitch && (
                                                                    <div className="md:col-span-2">
                                                                        <strong>Your Pitch:</strong>
                                                                        <p className="mt-1 text-muted-foreground">{application.musicianPitch}</p>
                                                                    </div>
                                                                )}
                                                                
                                                                {application.equipmentProvided && application.equipmentProvided.length > 0 && (
                                                                    <div className="md:col-span-2">
                                                                        <strong>Equipment You Offered:</strong>
                                                                        <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                                            {application.equipmentProvided.map((equipment: string, index: number) => (
                                                                                <li key={index}>{equipment}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="confirmed" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirmed Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredConfirmedEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No confirmed events found.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredConfirmedEvents.map((event) => (
                                        <Card key={event.id} className="border-l-4 border-l-green-500">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold">{event.title}</h3>
                                                            <Badge variant="default">CONFIRMED</Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>
                                                                    {event.venue.name}, {event.venue.city}, {event.venue.state}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {formatDateTime(event.date, event.startTime)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4" />
                                                                <span>${event.ticketPrice || 0}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 