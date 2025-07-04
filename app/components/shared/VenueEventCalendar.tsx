import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Clock, Plus, X, Save, Settings, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Music, Building, Users, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Link } from 'react-router-dom';
import { EventStatusBadge } from "./EventStatusBadge";
import { CalendarDayCell } from "./CalendarDayCell";

interface Event {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    eventStatus?: 'confirmed' | 'proposed' | 'cancelled' | 'open' | null;
    musician?: {
        id: string;
        name: string;
        stageName?: string;
    };
    totalAmount?: number;
    notes?: string;
    // Add booking-related fields
    confirmedBookings?: number;
    pendingApplications?: number;
    hasConfirmedBooking?: boolean;
}

interface VenueEventCalendarProps {
    events: Event[];
    onAddEvent?: (event: Partial<Event>) => Promise<void>;
    onUpdateEvent?: (eventId: string, updates: Partial<Event>) => Promise<void>;
    onDeleteEvent?: (eventId: string) => Promise<void>;
    onEditEvent?: (event: Event) => void;
    isEditing?: boolean;
    onEditToggle?: () => void;
    title?: string;
    description?: string;
    // Add booking management props
    bookings?: any[];
    onViewBookingDetails?: (eventId: string) => void;
}

type ViewMode = 'weekly' | 'monthly';
type EventType = 'all' | 'confirmed' | 'proposed' | 'bookings';

export default function VenueEventCalendar({
    events,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onEditEvent,
    isEditing = false,
    onEditToggle,
    title = "Venue Event Calendar",
    description = "Manage your venue's events and bookings",
    bookings = [],
    onViewBookingDetails
}: VenueEventCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [eventTypeFilter, setEventTypeFilter] = useState<EventType>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Enhance events with booking information
    const enhancedEvents = events.map(event => {
        const eventBookings = bookings.filter(booking => booking.event?.id === event.id);
        const confirmedBookings = eventBookings.filter(booking => booking.status === 'confirmed');
        const pendingApplications = eventBookings.filter(booking => 
            booking.status === 'applied' || booking.status === 'selected'
        );
        
        return {
            ...event,
            confirmedBookings: confirmedBookings.length,
            pendingApplications: pendingApplications.length,
            hasConfirmedBooking: confirmedBookings.length > 0
        };
    });

    // Filter events based on type
    const filteredEvents = enhancedEvents.filter(event => {
        if (eventTypeFilter === 'all') return true;
        if (eventTypeFilter === 'bookings') return event.hasConfirmedBooking;
        return event.eventStatus === eventTypeFilter;
    });

    // Status badge logic is now handled by EventStatusBadge component

    const getWeekDates = (startDate: Date) => {
        const dates = [];
        const startOfWeek = new Date(startDate);
        // Adjust to start of week (Sunday)
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentWeek(prev => {
            const newWeek = new Date(prev);
            if (direction === 'prev') {
                newWeek.setDate(prev.getDate() - 7);
            } else {
                newWeek.setDate(prev.getDate() + 7);
            }
            return newWeek;
        });
    };

    const getMonthDates = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const dates = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= lastDay || dates.length < 42) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return format(eventDate, 'yyyy-MM-dd') === dateStr;
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth() && 
               date.getFullYear() === currentMonth.getFullYear();
    };

    const renderWeeklyView = () => {
        const weekDates = getWeekDates(currentWeek);
        const startDate = weekDates[0];
        const endDate = weekDates[6];
        
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Weekly Events</CardTitle>
                            <CardDescription>
                                Your venue's events for {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek('prev')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentWeek(new Date())}
                            >
                                Today
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek('next')}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            {isEditing && onAddEvent && (
                                <Button asChild>
                                    <Link to="/create-event">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Event
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {weekDates.map((date, index) => {
                            const dayEvents = getEventsForDate(date);
                            const isTodayDate = isToday(date);
                            // Weekly view: always current month for all days in week
                            return (
                                <CalendarDayCell
                                    key={index}
                                    date={date}
                                    dayEvents={dayEvents}
                                    isToday={isTodayDate}
                                    isCurrentMonth={true}
                                    onEventClick={onEditEvent}
                                />
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderMonthlyView = () => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Monthly Events</CardTitle>
                        <CardDescription>
                            Overview of your venue's events for {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateMonth('prev')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(new Date())}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateMonth('next')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button asChild>
                            <Link to="/create-event">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {getMonthDates().map((date, index) => {
                        const dayEvents = getEventsForDate(date);
                        const isTodayDate = isToday(date);
                        const isCurrentMonthDate = isCurrentMonth(date);
                        return (
                            <CalendarDayCell
                                key={index}
                                date={date}
                                dayEvents={dayEvents}
                                isToday={isTodayDate}
                                isCurrentMonth={isCurrentMonthDate}
                                onEventClick={onEditEvent}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                {title}
                            </CardTitle>
                            <CardDescription>
                                {description}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button 
                                        variant="outline" 
                                        onClick={onEditToggle}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button asChild>
                                    <Link to="/create-event">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Event
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* View Mode Toggle */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Calendar View</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'weekly' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('weekly')}
                            >
                                Weekly
                            </Button>
                            <Button
                                variant={viewMode === 'monthly' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('monthly')}
                            >
                                Monthly
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Event Type Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Button
                            variant={eventTypeFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEventTypeFilter('all')}
                        >
                            All Events
                        </Button>
                        <Button
                            variant={eventTypeFilter === 'confirmed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEventTypeFilter('confirmed')}
                        >
                            Confirmed
                        </Button>
                        <Button
                            variant={eventTypeFilter === 'proposed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEventTypeFilter('proposed')}
                        >
                            Proposed
                        </Button>
                        <Button
                            variant={eventTypeFilter === 'bookings' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setEventTypeFilter('bookings')}
                        >
                            Bookings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar View */}
            {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}

            {/* Event Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Summary</CardTitle>
                    <CardDescription>
                        Overview of your venue's events
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Total Events</h4>
                            <div className="text-2xl font-bold text-blue-600">
                                {events.length}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Confirmed Events</h4>
                            <div className="text-2xl font-bold text-green-600">
                                {events.filter(e => e.eventStatus === 'confirmed').length}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Proposed Events</h4>
                            <div className="text-2xl font-bold text-yellow-600">
                                {events.filter(e => e.eventStatus === 'proposed').length}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
