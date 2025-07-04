import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import {
  ActionButtons,
  BasicInformationSection,
  DateTimeSection,
  EquipmentSection,
  EventFormData,
  GenresSection,
  MusicianSettingsSection,
  PricingCapacitySection,
  generateTimeOptions,
  getDefaultEquipment,
  availableGenres
} from "../components/forms/event";

export default function CreateEventPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timeOptions = generateTimeOptions();

    // Event form state
    const [eventForm, setEventForm] = useState<EventFormData>({
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
        eventStatus: "open", // Changed from "status" to "eventStatus" - events should be open for applications
        eventType: "open", // New field for radio button selection
        musicianId: "none",
        genres: [],
        equipment: getDefaultEquipment(),
        isRecurring: false,
        recurringPattern: "weekly",
        recurringInterval: 1,
        recurringEndDate: "",
        recurringDays: []
    });

    // State for data fetching
    const [venue, setVenue] = useState<any>(null);
    const [musicians, setMusicians] = useState<any[]>([]);
    const [venueFetching, setVenueFetching] = useState(false);
    const [musiciansFetching, setMusiciansFetching] = useState(false);

    // Fetch venue data
    useEffect(() => {
        const fetchVenue = async () => {
            if (!user?.id) return;

            setVenueFetching(true);
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const { data: venueData, error } = await supabase
                    .from('venues')
                    .select('id, name, city, state')
                    .eq('email', authUser.email)
                    .single();

                if (error) {
                    console.error("Error fetching venue:", error);
                    return;
                }

                setVenue(venueData);
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setVenueFetching(false);
            }
        };

        fetchVenue();
    }, [user?.id]);

    // Fetch musicians for selection
    useEffect(() => {
        const fetchMusicians = async () => {
            setMusiciansFetching(true);
            try {
                const { data: musiciansData, error } = await supabase
                    .from('musicians')
                    .select('id, stage_name, genre, city, state, hourly_rate')
                    .limit(50);

                if (error) {
                    console.error("Error fetching musicians:", error);
                    return;
                }

                // Transform data to match expected format
                const transformedMusicians = musiciansData?.map(musician => ({
                    ...musician,
                    stageName: musician.stage_name,
                    hourlyRate: musician.hourly_rate
                })) || [];

                setMusicians(transformedMusicians);
            } catch (error) {
                console.error("Error fetching musicians:", error);
            } finally {
                setMusiciansFetching(false);
            }
        };

        fetchMusicians();
    }, []);

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

        if (!eventForm.eventType) {
            alert("Please select an event type (Open or Invited)");
            return;
        }

        setIsSubmitting(true);

        try {
            // Format date and time to match musician availability format
            const dateString = eventForm.date; // Already in yyyy-MM-dd format from input
            const startTimeString = eventForm.startTime || "00:00";
            const endTimeString = eventForm.endTime || "23:59";
            
            // Create ISO datetime string for the event date field (local time, not UTC)
            const startDateTime = `${dateString}T${startTimeString}:00`;

            // Format recurring end date if provided (local time, not UTC)
            let recurringEndDateTime = null;
            if (eventForm.isRecurring && eventForm.recurringEndDate) {
                recurringEndDateTime = `${eventForm.recurringEndDate}T23:59:59`;
            }

            const newEvent = {
                title: eventForm.title,
                description: eventForm.description,
                date: startDateTime, // Use the ISO datetime string for the event date
                start_time: startTimeString, // Keep as HH:MM format
                end_time: endTimeString, // Keep as HH:MM format
                ticket_price: parseFloat(eventForm.ticketPrice) || 0,
                rate: parseFloat(eventForm.rate) || 0,
                total_capacity: parseInt(eventForm.totalCapacity) || 0,
                category: eventForm.category,
                ticket_type: eventForm.ticketType,
                genres: eventForm.genres,
                equipment: eventForm.equipment,
                is_public: eventForm.isPublic,
                is_active: eventForm.isActive,
                event_status: eventForm.eventType, // Use eventType for eventStatus
                is_recurring: eventForm.isRecurring,
                recurring_pattern: eventForm.recurringPattern,
                recurring_interval: eventForm.recurringInterval,
                recurring_days: eventForm.recurringDays,
                ...(recurringEndDateTime && { recurring_end_date: recurringEndDateTime }),
                venue_id: venue.id,
                created_by: user.id,
                ...(eventForm.musicianId !== "none" && { musician_id: eventForm.musicianId })
            };

            console.log("Creating event with data:", newEvent);
            console.log("User context:", user);
            console.log("Venue data:", venue);
            
            const { data: result, error } = await supabase
                .from('events')
                .insert([newEvent])
                .select()
                .single();
            
            if (error) {
                console.error("Create event error:", error);
                alert(`Failed to create event: ${error.message || 'Unknown error'}`);
                return;
            }
            
            console.log("Event created successfully:", result);
            
            // Redirect based on event type
            if (eventForm.eventType === "invited") {
                // Redirect to musician selection page for invited events
                navigate("/venue-musicians", { 
                    state: { 
                        eventId: result.data?.id,
                        eventTitle: eventForm.title,
                        action: "invite"
                    }
                });
            } else {
                // Redirect to venue events page for open events
                navigate("/venue-events");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean | string[] | number) => {
        setEventForm(prev => ({
                ...prev,
                [field]: value
        }));
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
                    <BasicInformationSection 
                        eventForm={eventForm}
                        handleInputChange={handleInputChange}
                    />

                    {/* Date & Time */}
                    <DateTimeSection 
                        eventForm={eventForm}
                        handleInputChange={handleInputChange}
                        handleRecurringDayChange={handleRecurringDayChange}
                        handleRecurringToggle={handleRecurringToggle}
                        timeOptions={timeOptions}
                    />

                    {/* Music Genres */}
                    <GenresSection 
                        eventForm={eventForm}
                        handleGenreChange={handleGenreChange}
                        availableGenres={availableGenres}
                    />

                    {/* Equipment & Supplies */}
                    <EquipmentSection 
                        eventForm={eventForm}
                        handleEquipmentChange={handleEquipmentChange}
                    />

                    {/* Pricing & Capacity */}
                    <PricingCapacitySection 
                        eventForm={eventForm}
                        handleInputChange={handleInputChange}
                    />

                    {/* Musician & Settings */}
                    <MusicianSettingsSection 
                        eventForm={eventForm}
                        handleInputChange={handleInputChange}
                        musicians={musicians}
                    />
                </div>

                {/* Action Buttons */}
                <ActionButtons 
                    isSubmitting={isSubmitting}
                    cancelPath="/venue-events"
                    submitLabel="Create Event"
                />
            </form>
        </div>
    );
} 
