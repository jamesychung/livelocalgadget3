import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, Music, DollarSign, Save, X, Settings, Repeat } from "lucide-react";
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

    // Available genres for events
    const availableGenres = [
        "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip Hop", 
        "R&B", "Classical", "Reggae", "Latin", "World Music", "Alternative", "Indie",
        "Metal", "Punk", "Soul", "Funk", "Gospel", "Bluegrass", "EDM", "House", "Techno"
    ];

    // Equipment and supplies data
    const equipmentData = [
        {
            item: "Power Outlets",
            venueProvides: true,
            musicianProvides: false,
            notes: "Accessible, grounded outlets near performance area are a must"
        },
        {
            item: "PA System",
            venueProvides: false,
            musicianProvides: true,
            notes: "Musicians often bring portable PA (e.g. Bose, JBL, Yamaha)"
        },
        {
            item: "Microphones",
            venueProvides: false,
            musicianProvides: true,
            notes: "Vocal mics, sometimes instrument mics"
        },
        {
            item: "Mic Stands & Cables",
            venueProvides: false,
            musicianProvides: true,
            notes: "Musicians bring all essentials"
        },
        {
            item: "Instruments",
            venueProvides: false,
            musicianProvides: true,
            notes: "Guitars, keyboards, etc."
        },
        {
            item: "Amps (Guitar/Bass)",
            venueProvides: false,
            musicianProvides: true,
            notes: "Small/medium amps for compact spaces"
        },
        {
            item: "Monitors (Stage)",
            venueProvides: false,
            musicianProvides: false,
            notes: "Not usually provided; some musicians use in-ear monitors or small wedges"
        },
        {
            item: "Lighting",
            venueProvides: true,
            musicianProvides: false,
            notes: "Basic ambient only; Optional portable lighting can help if venue is dim"
        }
    ];

    // Event form state
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "19:00", // Default to 7:00 PM
        endTime: "22:00", // Default to 10:00 PM
        ticketPrice: "",
        rate: "", // How much venue pays musicians
        totalCapacity: "",
        category: "live-music", // Default to Live Music
        ticketType: "general",
        isPublic: true,
        isActive: true,
        status: "open", // Changed from "confirmed" to "open" - events should be open for applications
        musicianId: "none",
        genres: [] as string[],
        equipment: equipmentData.map(item => ({
            item: item.item,
            venueProvides: item.venueProvides,
            musicianProvides: item.musicianProvides,
            notes: item.notes
        })),
        isRecurring: false,
        recurringPattern: "weekly",
        recurringInterval: 1,
        recurringEndDate: "",
        recurringDays: [] as string[]
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

            // Format recurring end date if provided
            let recurringEndDateTime = null;
            if (eventForm.isRecurring && eventForm.recurringEndDate) {
                recurringEndDateTime = `${eventForm.recurringEndDate}T23:59:59.000Z`;
            }

            const newEvent = {
                title: eventForm.title,
                description: eventForm.description,
                date: startDateTime, // Use the ISO datetime string for the event date
                startTime: startTimeString, // Keep as HH:MM format
                endTime: endTimeString, // Keep as HH:MM format
                ticketPrice: parseFloat(eventForm.ticketPrice) || 0,
                rate: parseFloat(eventForm.rate) || 0,
                totalCapacity: parseInt(eventForm.totalCapacity) || 0,
                category: eventForm.category,
                ticketType: eventForm.ticketType,
                genres: eventForm.genres,
                equipment: eventForm.equipment,
                isPublic: eventForm.isPublic,
                isActive: eventForm.isActive,
                status: eventForm.status,
                isRecurring: eventForm.isRecurring,
                recurringPattern: eventForm.recurringPattern,
                recurringInterval: eventForm.recurringInterval,
                recurringDays: eventForm.recurringDays,
                ...(recurringEndDateTime && { recurringEndDate: recurringEndDateTime }),
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

    const handleInputChange = (field: string, value: string | boolean | string[] | number) => {
        console.log(`handleInputChange called: ${field} = ${value}`);
        setEventForm(prev => {
            const newState = {
                ...prev,
                [field]: value
            };
            console.log(`New form state:`, newState);
            return newState;
        });
    };

    const handleGenreChange = (genre: string, checked: boolean) => {
        setEventForm(prev => ({
            ...prev,
            genres: checked 
                ? [...prev.genres, genre]
                : prev.genres.filter(g => g !== genre)
        }));
    };

    const handleEquipmentChange = (itemIndex: number, provider: 'venueProvides' | 'musicianProvides', checked: boolean) => {
        setEventForm(prev => ({
            ...prev,
            equipment: prev.equipment.map((equipment, index) => 
                index === itemIndex 
                    ? { ...equipment, [provider]: checked }
                    : equipment
            )
        }));
    };

    const handleRecurringDayChange = (day: string, checked: boolean) => {
        setEventForm(prev => ({
            ...prev,
            recurringDays: checked 
                ? [...prev.recurringDays, day]
                : prev.recurringDays.filter(d => d !== day)
        }));
    };

    const handleRecurringToggle = (checked: boolean) => {
        console.log(`Recurring toggle changed to: ${checked}`);
        setEventForm(prev => ({
            ...prev,
            isRecurring: checked
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
                            <Button asChild>
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
                    <Button asChild>
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

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={eventForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="live-music">Live Music</SelectItem>
                                        <SelectItem value="dj">DJ</SelectItem>
                                    </SelectContent>
                                </Select>
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

                            {/* Recurring Event Options */}
                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-medium">Recurring Event</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Make this event repeat on a schedule
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Current state: {eventForm.isRecurring ? 'Enabled' : 'Disabled'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recurring-toggle"
                                            checked={eventForm.isRecurring}
                                            onCheckedChange={handleRecurringToggle}
                                        />
                                        <Label htmlFor="recurring-toggle" className="text-sm">
                                            Enable recurring
                                        </Label>
                                    </div>
                                </div>

                                {eventForm.isRecurring && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="recurringPattern">Repeat Pattern</Label>
                                                <Select 
                                                    value={eventForm.recurringPattern} 
                                                    onValueChange={(value) => handleInputChange("recurringPattern", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="daily">Daily</SelectItem>
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Weekly Pattern - Day Selection */}
                                        {eventForm.recurringPattern === 'weekly' && (
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Repeat on Days</Label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                        <div key={day} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`day-${day}`}
                                                                checked={eventForm.recurringDays.includes(day)}
                                                                onCheckedChange={(checked) => handleRecurringDayChange(day, checked as boolean)}
                                                            />
                                                            <Label 
                                                                htmlFor={`day-${day}`} 
                                                                className="text-sm font-normal cursor-pointer"
                                                            >
                                                                {day.slice(0, 3)}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Select which days of the week to repeat
                                                </p>
                                            </div>
                                        )}

                                        {/* Bi-weekly Pattern - Every 2 weeks */}
                                        {eventForm.recurringPattern === 'bi-weekly' && (
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Bi-weekly Schedule</Label>
                                                <div className="p-3 bg-muted rounded-md">
                                                    <p className="text-sm">
                                                        Event will repeat every 2 weeks on the same day of the week.
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Example: If your event is on Monday, it will repeat every other Monday.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Monthly Pattern - Calendar Selection */}
                                        {eventForm.recurringPattern === 'monthly' && (
                                            <div>
                                                <Label className="text-sm font-medium mb-2 block">Repeat on Day of Month</Label>
                                                <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto border rounded-md p-3">
                                                    {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                                                        <div key={day} className="flex items-center space-x-1">
                                                            <Checkbox
                                                                id={`monthday-${day}`}
                                                                checked={eventForm.recurringDays.includes(day.toString())}
                                                                onCheckedChange={(checked) => handleRecurringDayChange(day.toString(), checked as boolean)}
                                                            />
                                                            <Label 
                                                                htmlFor={`monthday-${day}`} 
                                                                className="text-xs font-normal cursor-pointer"
                                                            >
                                                                {day}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Select which day(s) of the month to repeat (e.g., 15th = 15th of every month)
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="recurringEndDate">End Date (Optional)</Label>
                                            <Input
                                                id="recurringEndDate"
                                                type="date"
                                                value={eventForm.recurringEndDate}
                                                onChange={(e) => handleInputChange("recurringEndDate", e.target.value)}
                                                placeholder="Leave empty for no end date"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Leave empty if the event should continue indefinitely
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Music Genres */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Music Genres
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select the genres that best describe this event
                            </p>
                            <div className="grid grid-cols-3 gap-2 border rounded-md p-3">
                                {availableGenres.map((genre) => (
                                    <div key={genre} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`genre-${genre}`}
                                            checked={eventForm.genres.includes(genre)}
                                            onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                                        />
                                        <Label 
                                            htmlFor={`genre-${genre}`} 
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {genre}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Equipment & Supplies */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Equipment & Supplies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Check who will provide each item for this event
                            </p>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Item</TableHead>
                                            <TableHead className="w-[120px] text-center">Venue Provides</TableHead>
                                            <TableHead className="w-[120px] text-center">Musician Provides</TableHead>
                                            <TableHead>Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {eventForm.equipment.map((equipment, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{equipment.item}</TableCell>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={equipment.venueProvides}
                                                        onCheckedChange={(checked) => handleEquipmentChange(index, 'venueProvides', checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={equipment.musicianProvides}
                                                        onCheckedChange={(checked) => handleEquipmentChange(index, 'musicianProvides', checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {equipment.notes}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                                {musician.stageName}
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