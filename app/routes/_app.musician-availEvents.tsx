import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, AlertCircle } from "lucide-react";
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { MusicianEventsSummaryDashboard } from '../components/shared/MusicianEventsSummaryDashboard';
import { MusicianStatsSettings } from '../components/shared/MusicianStatsSettings';
import { useMusicianAvailableEventsStats, createAvailableEventsStats } from '../hooks/useMusicianAvailableEventsStats';
import { FilterPanel, FilterState } from '../components/shared/FilterPanel';
import { useFilters, filterFunctions } from '../hooks/useFilters';
import { EventStatusLegend } from '../components/shared/EventStatusLegend';
import { EventCard } from '../components/shared/EventCard';
import { EventDialog } from '../components/shared/EventDialog';

export default function MusicianAvailEventsPage() {
    const { user } = useOutletContext<AuthOutletContext>();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    
    // State for data
    const [events, setEvents] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [musicianProfile, setMusicianProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        dateFrom: '',
        dateTo: '',
        status: 'all',
        search: '',
        venue: 'all'
    });

    // Stats customization state with localStorage persistence
    const [showStatsSettings, setShowStatsSettings] = useState(false);
    const [selectedStatIds, setSelectedStatIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('musician-available-events-stats');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (error) {
                    console.error('Error parsing saved stats:', error);
                }
            }
        }
        return ['totalEvents', 'openEvents', 'myApplications', 'matchingGenreEvents', 'upcomingEvents', 'averageEventRate'];
    });

    // Save to localStorage whenever selectedStatIds changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('musician-available-events-stats', JSON.stringify(selectedStatIds));
        }
    }, [selectedStatIds]);

    // Fetch data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch musician profile first
                let musicianData = null;
                if (user?.email) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('musicians')
                        .select('*')
                        .eq('email', user.email)
                        .single();
                    
                    if (!profileError && profileData) {
                        musicianData = profileData;
                        setMusicianProfile(profileData);
                    }
                }
                
                // Fetch all events
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select(`
                        id,
                        title,
                        description,
                        date,
                        start_time,
                        end_time,
                        event_status,
                        rate,
                        genres,
                        created_at,
                        venue_id,
                        venue:venues(id, name, city, state)
                    `)
                    .order('date', { ascending: true });

                if (eventsError) throw eventsError;

                // Fetch all bookings
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        event_id,
                        musician_id,
                        cancel_requested_at,
                        cancel_requested_by,
                        cancel_requested_by_role,
                        cancelled_at,
                        cancelled_by,
                        cancel_confirmed_by_role,
                        cancellation_reason,
                        applied_at,
                        selected_at,
                        confirmed_at,
                        completed_at,
                        completed_by,
                        completed_by_role,
                        proposed_rate,
                        musician_pitch,
                        musician:musicians(id, stage_name, city, state)
                    `);

                if (bookingsError) throw bookingsError;

                setEvents(eventsData || []);
                setBookings(bookingsData || []);
                
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, refreshTrigger]);

    // Get musician's application status for an event
    const getMusicianApplicationStatus = (eventId: string): { status: string; booking?: any } => {
        if (!musicianProfile?.id) return { status: "available" };
        
        const booking = bookings.find(booking => 
            booking.event_id === eventId && 
            booking.musician_id === musicianProfile.id
        );
        
        if (!booking) return { status: "available" };
        
        return { status: booking.status, booking };
    };

    // Filter events to only show opportunities where musician can still get hired
    const availableEvents = useMemo(() => {
        if (!musicianProfile?.id) return [];

        return events.filter(event => {
            // Skip past events
            if (event.date && new Date(event.date) < new Date()) return false;

            const applicationStatus = getMusicianApplicationStatus(event.id);
            const { status, booking } = applicationStatus;

            // Show these event types:
            switch (status) {
                case 'available':
                    // Open events or invited events (when invitation system is built)
                    return event.event_status === 'open' || event.event_status === 'invited';
                    
                case 'applied':
                    // Events where musician applied but venue hasn't selected anyone yet
                    return true;
                    
                case 'selected':
                    // Events where venue selected this musician but musician hasn't confirmed
                    return true;
                    
                default:
                    // Hide confirmed, cancelled, completed, or rejected events
                    return false;
            }
        }).map(event => {
            const applicationStatus = getMusicianApplicationStatus(event.id);
            return {
                ...event,
                applicationStatus: applicationStatus.status,
                booking: applicationStatus.booking,
                // For display purposes, map application status to event status
                eventStatus: applicationStatus.status === 'available' ? event.event_status : applicationStatus.status
            };
        });
    }, [events, bookings, musicianProfile?.id]);

    // Get unique venues for filter dropdown
    const uniqueVenues = useMemo(() => {
        const venues = new Set<string>();
        availableEvents.forEach(event => {
            if (event.venue?.name) {
                venues.add(event.venue.name);
            }
        });
        return Array.from(venues).sort();
    }, [availableEvents]);

    // Create filter function for available events
    const eventFilterFunction = (event: any, filters: FilterState): boolean => {
        // Date range filter
        if (!filterFunctions.dateRange(event.date, filters)) return false;

        // Status filter
        if (filters.status !== 'all') {
            switch (filters.status) {
                case 'open':
                    if (event.applicationStatus !== 'available' || event.event_status !== 'open') return false;
                    break;
                case 'invited':
                    if (event.applicationStatus !== 'available' || event.event_status !== 'invited') return false;
                    break;
                case 'applied':
                    if (event.applicationStatus !== 'applied') return false;
                    break;
                case 'selected':
                    if (event.applicationStatus !== 'selected') return false;
                    break;
                default:
                    break;
            }
        }

        // Search filter (searches title, description, venue name)
        const searchFields = [event.title, event.description, event.venue?.name];
        if (!filterFunctions.search(searchFields, filters)) return false;

        // Venue filter
        if (filters.venue && filters.venue !== 'all') {
            if (event.venue?.name !== filters.venue) return false;
        }

        return true;
    };

    // Use the filter hook for events
    const { filteredData: filteredEvents } = useFilters({
        data: availableEvents,
        filters,
        filterFunction: eventFilterFunction
    });

    // Get events needing action (selected by venue)
    const eventsNeedingAction = filteredEvents.filter(event => 
        event.applicationStatus === 'selected'
    );

    // Calculate stats
    const availableEventsStats = useMusicianAvailableEventsStats(
        availableEvents,
        bookings,
        musicianProfile?.id,
        musicianProfile?.genres
    );
    const allAvailableStats = createAvailableEventsStats(availableEventsStats);
    const selectedStats = allAvailableStats.filter(stat => selectedStatIds.includes(stat.id));

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
    };

    const handleApplyToEvent = async (eventId: string) => {
        if (!musicianProfile?.id) return;

        try {
            const { data: booking, error } = await supabase
                .from('bookings')
                .insert([
                    {
                        event_id: eventId,
                        musician_id: musicianProfile.id,
                        venue_id: selectedEvent?.venue_id,
                        booked_by: user.id,
                        status: "applied",
                        applied_at: new Date().toISOString(),
                        proposed_rate: musicianProfile.hourly_rate || 0,
                        musician_pitch: `I'm excited to perform at ${selectedEvent?.venue?.name || 'your venue'}! I have experience in ${musicianProfile.genres?.join(', ') || 'various genres'} and would love to contribute to your event.`
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            
            // Refresh data
            setRefreshTrigger(prev => prev + 1);
            setIsEventDialogOpen(false);
            
        } catch (error) {
            console.error("Error applying to event:", error);
        }
    };

    const handleConfirmBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ 
                    status: 'confirmed',
                    confirmed_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            if (error) throw error;
            
            // Refresh data
            setRefreshTrigger(prev => prev + 1);
            setIsEventDialogOpen(false);
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ 
                    status: 'cancelled',
                    cancelled_at: new Date().toISOString(),
                    cancel_requested_by_role: 'musician'
                })
                .eq('id', bookingId);

            if (error) throw error;
            
            // Refresh data
            setRefreshTrigger(prev => prev + 1);
            setIsEventDialogOpen(false);
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading available events...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <AlertCircle className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Error Loading Events</h3>
                        <p className="text-muted-foreground mb-4">
                            There was an error loading the available events. Please try refreshing the page.
                        </p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Refresh Page
                        </Button>
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
                        <h1 className="text-3xl font-bold">Available Events</h1>
                        <p className="text-muted-foreground">
                            Events where you can still get hired
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Required Section */}
            {eventsNeedingAction.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                            <AlertCircle className="h-5 w-5" />
                            Action Required - Venue Selected You!
                            <Badge variant="destructive" className="bg-blue-100 text-blue-800">
                                {eventsNeedingAction.length} total
                            </Badge>
                        </CardTitle>
                        <p className="text-sm text-blue-700">
                            These venues have selected you for their events and are waiting for your confirmation
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {eventsNeedingAction.map((event) => (
                                <div key={event.id} className="bg-white border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <span>{formatDate(event.date)}</span>
                                                <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                                                <span>{event.venue?.name}</span>
                                                {event.booking?.proposed_rate && (
                                                    <span className="font-medium text-green-600">
                                                        ${event.booking.proposed_rate}/hr
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="destructive" className="bg-blue-100 text-blue-800">
                                                Selected
                                            </Badge>
                                            <Button
                                                size="sm"
                                                onClick={() => handleConfirmBooking(event.booking.id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Confirm Booking
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRejectBooking(event.booking.id)}
                                            >
                                                Decline
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Customizable Stats Dashboard */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Event Stats</h2>
                    <Button size="sm" variant="outline" onClick={() => setShowStatsSettings(!showStatsSettings)}>
                        Customize
                    </Button>
                </div>
                <MusicianEventsSummaryDashboard
                    stats={selectedStats}
                    maxStats={8}
                />
                {showStatsSettings && (
                    <div className="mt-2">
                        <MusicianStatsSettings
                            availableStats={allAvailableStats}
                            selectedStatIds={selectedStatIds}
                            onStatsChange={setSelectedStatIds}
                            maxStats={8}
                            onClose={() => setShowStatsSettings(false)}
                        />
                    </div>
                )}
            </div>

            {/* Available Events Section with Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Events</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Events where you can still apply or need to take action
                    </p>
                </CardHeader>
                <CardContent>
                    {/* Filter Panel */}
                    <div className="mb-6">
                        <FilterPanel
                            config={{
                                search: {
                                    placeholder: "Search events by title, description, or venue...",
                                    enabled: true
                                },
                                dateRange: {
                                    enabled: true,
                                    fromLabel: "Event Date From",
                                    toLabel: "Event Date To"
                                },
                                status: {
                                    enabled: true,
                                    label: "Event Status",
                                    options: [
                                        { value: 'all', label: 'All Available Events' },
                                        { value: 'open', label: 'Open for Applications' },
                                        { value: 'invited', label: 'Invited Events' },
                                        { value: 'applied', label: 'Applied' },
                                        { value: 'selected', label: 'Selected (Action Required)' }
                                    ]
                                },
                                dropdowns: [
                                    {
                                        key: 'venue',
                                        label: 'Venue',
                                        options: ['all', ...uniqueVenues],
                                        placeholder: 'Search for venue...',
                                        searchable: true
                                    }
                                ]
                            }}
                            onFilterChange={(newFilters) => {
                                setFilters(newFilters);
                            }}
                            showActiveFilters={true}
                            initiallyExpanded={true}
                        />
                    </div>

                    {/* Event Status Legend */}
                    <EventStatusLegend events={filteredEvents} hideCompletedStatuses={true} />

                    {filteredEvents.length > 0 ? (
                        <div className="space-y-4">
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={{
                                        ...event,
                                        eventStatus: event.applicationStatus === 'available' ? event.event_status : event.applicationStatus
                                    }}
                                    onEventClick={() => handleEventClick(event)}
                                    showStatusBadge={true}
                                    showActions={false}
                                    clickText="Click for event details and to apply"
                                    className="hover:shadow-lg transition-shadow duration-200"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Available Events</h3>
                            <p className="text-muted-foreground mb-4">
                                No events match your current filters. Try adjusting your search criteria.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Event Detail Dialog */}
            <EventDialog
                isOpen={isEventDialogOpen}
                onClose={() => setIsEventDialogOpen(false)}
                event={selectedEvent}
                bookings={selectedEvent?.booking ? [selectedEvent.booking] : []}
                onAcceptApplication={selectedEvent?.applicationStatus === 'available' ? () => handleApplyToEvent(selectedEvent.id) : undefined}
                onRejectApplication={selectedEvent?.applicationStatus === 'selected' ? () => handleRejectBooking(selectedEvent.booking?.id) : undefined}
                currentUser={{ musician: { id: musicianProfile?.id } }}
                userRole="musician"
                showApplicationsList={false}
            />
        </div>
    );
} 
