import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Calendar, Clock, Music, DollarSign, Save, X } from "lucide-react";
import { Link, useOutletContext, useNavigate } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function CreateEventPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate time options (every half hour) - same as musician availability
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(time);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    // Event form state
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "19:00", // Default to 7:00 PM
        endTime: "22:00", // Default to 10:00 PM
        ticketPrice: "",
        totalCapacity: "",
        category: "live-music",
        ticketType: "general",
        isPublic: true,
        isActive: true,
        status: "confirmed",
        musicianId: "none"
    });

    // Fetch venue data
    const [{ data: venueData, fetching: venueFetching }] = useFindMany(api.venue, {
        filter: { owner: { id: { equals: user?.id } } },
        select: {
            id: true,
            name: true,
            city: true,
            state: true
        },
        first: 1,
        pause: !user?.id,
    });

    const venue = venueData?.[0] as any;

    // Fetch musicians for selection
    const [{ data: musiciansData, fetching: musiciansFetching }] = useFindMany(api.musician, {
        select: {
            id: true,
            name: true,
            stageName: true,
            genre: true,
            city: true,
            state: true,
            hourlyRate: true
        },
        first: 50,
    });

    const musicians: any[] = musiciansData || [];

    // Create event action
    const [createEventResult, createEvent] = useAction(api.event.create);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!venue?.id) {
            alert("Please create a venue profile first");
            return;
        }

        if (!eventForm.title || !eventForm.date) {
            alert("Please fill in the required fields (Title and Date)");
            return;
        }

        setIsSubmitting(true);

        try {
            // Format date and time to match musician availability format
            const dateString = eventForm.date; // Already in yyyy-MM-dd format from input
            const startTimeString = eventForm.startTime || "00:00";
            const endTimeString = eventForm.endTime || "23:59";
            
            // Create ISO datetime string for the event date field
            const startDateTime = `${dateString}T${startTimeString}:00.000Z`;

            const newEvent = {
                title: eventForm.title,
                description: eventForm.description,
                date: startDateTime, // Use the ISO datetime string for the event date
                startTime: startTimeString, // Keep as HH:MM format
                endTime: endTimeString, // Keep as HH:MM format
                ticketPrice: parseFloat(eventForm.ticketPrice) || 0,
                totalCapacity: parseInt(eventForm.totalCapacity) || 0,
                category: eventForm.category,
                ticketType: eventForm.ticketType,
                isPublic: eventForm.isPublic,
                isActive: eventForm.isActive,
                status: eventForm.status,
                venue: { _link: venue.id },
                createdBy: { _link: user.id },
                ...(eventForm.musicianId !== "none" && { musician: { _link: eventForm.musicianId } })
            };

            console.log("Creating event with data:", newEvent);
            console.log("User context:", user);
            console.log("Venue data:", venue);
            
            const result = await createEvent(newEvent);
            console.log("Create event result:", result);
            
            if (result.error) {
                console.error("Create event error:", result.error);
                alert(`Failed to create event: ${result.error.message || 'Unknown error'}`);
                return;
            }
            
            console.log("Event created successfully:", result.data);
            
            // Navigate back to venue events page
            navigate("/venue-events");
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setEventForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Show loading state while fetching venue
    if (venueFetching) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading venue information...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If no venue profile found
    if (!venue) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold mb-4">Create Event</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to create a venue profile before you can create events.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button asChild>
                                <Link to="/venue-profile/edit">
                                    Create Venue Profile
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/venue-events">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Events
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
                        <Link to="/venue-events">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Event</h1>
                        <p className="text-muted-foreground">
                            Add a new event to {venue.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Event Creation Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={eventForm.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Enter event title"
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={eventForm.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Describe your event..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={eventForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="live-music">Live Music</SelectItem>
                                            <SelectItem value="comedy">Comedy</SelectItem>
                                            <SelectItem value="theater">Theater</SelectItem>
                                            <SelectItem value="dance">Dance</SelectItem>
                                            <SelectItem value="poetry">Poetry</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="ticketType">Ticket Type</Label>
                                    <Select value={eventForm.ticketType} onValueChange={(value) => handleInputChange("ticketType", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Admission</SelectItem>
                                            <SelectItem value="vip">VIP</SelectItem>
                                            <SelectItem value="reserved">Reserved Seating</SelectItem>
                                            <SelectItem value="standing">Standing Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date & Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Date & Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="date">Event Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Select value={eventForm.startTime} onValueChange={(value) => handleInputChange("startTime", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Select value={eventForm.endTime} onValueChange={(value) => handleInputChange("endTime", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Capacity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing & Capacity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                                <Input
                                    id="ticketPrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={eventForm.ticketPrice}
                                    onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="totalCapacity">Total Capacity</Label>
                                <Input
                                    id="totalCapacity"
                                    type="number"
                                    min="1"
                                    value={eventForm.totalCapacity}
                                    onChange={(e) => handleInputChange("totalCapacity", e.target.value)}
                                    placeholder="100"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Musician & Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Musician & Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="musician">Featured Musician</Label>
                                <Select value={eventForm.musicianId} onValueChange={(value) => handleInputChange("musicianId", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a musician" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No musician selected</SelectItem>
                                        {musicians.map((musician) => (
                                            <SelectItem key={musician.id} value={musician.id}>
                                                {musician.stageName || musician.name}
                                                {musician.city && ` (${musician.city}, ${musician.state})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Public Event</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Make this event visible to the public
                                        </p>
                                    </div>
                                    <Switch
                                        checked={eventForm.isPublic}
                                        onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Active Event</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Event is currently active and bookable
                                        </p>
                                    </div>
                                    <Switch
                                        checked={eventForm.isActive}
                                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate("/venue-events")}
                                disabled={isSubmitting}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Creating Event..." : "Create Event"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
} 