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
    bookings?: any[]; // Array of booking objects
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

type EventType = 'all' | 'confirmed' | 'proposed' | 'bookings' | 'open';

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
    const [currentMonth, setCurrentMonth] = useState(new Date());
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
            bookings: eventBookings, // Include the actual booking objects
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



    const renderMonthlyView = () => {
        const monthDates = getMonthDates();
        
        // Helper function to format time
        const formatTime = (timeString?: string) => {
            if (!timeString) return '';
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes}${ampm}`;
        };

        // Helper function to format event display
        const formatEventDisplay = (event: Event) => {
            const startTime = formatTime(event.startTime);
            const endTime = formatTime(event.endTime);
            const timeRange = startTime && endTime ? `${startTime}-${endTime}` : startTime || endTime || '';
            const showName = event.title || 'Event';
            
            if (timeRange) {
                return `${timeRange} - ${showName}`;
            }
            return showName;
        };
        
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
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
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="border rounded-lg overflow-hidden">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 bg-gray-50 border-b">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Calendar days */}
                            <div className="grid grid-cols-7">
                                {monthDates.map((date, index) => {
                                    const dayEvents = getEventsForDate(date);
                                    const isTodayDate = isToday(date);
                                    const isCurrentMonthDate = isCurrentMonth(date);
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`min-h-[140px] p-2 border-r border-b ${
                                                !isCurrentMonthDate 
                                                    ? 'bg-gray-50 text-gray-400' 
                                                    : isTodayDate 
                                                        ? 'bg-blue-50' 
                                                        : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className={`text-sm font-medium mb-2 ${
                                                isTodayDate ? 'text-blue-600' : isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                                    <div
                                                        key={eventIndex}
                                                        onClick={() => onEditEvent && onEditEvent(event)}
                                                        className={`text-xs p-2 rounded cursor-pointer transition-colors ${
                                                            event.hasConfirmedBooking 
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200' 
                                                                : event.eventStatus === 'open'
                                                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
                                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                                                        }`}
                                                        title={formatEventDisplay(event)} // Full text on hover
                                                    >
                                                        <div className="font-medium leading-tight">
                                                            {formatEventDisplay(event)}
                                                        </div>
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-xs text-gray-500 px-2 py-1">
                                                        +{dayEvents.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Compact Header with Stats and Controls */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title and Description */}
                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <p className="text-gray-600">{description}</p>
                        </div>
                        
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Event Type Filter */}
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
                                    variant={eventTypeFilter === 'open' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setEventTypeFilter('open')}
                                >
                                    Open
                                </Button>
                            </div>



                            {/* Create Event Button - only show if editing is enabled */}
                            {onAddEvent && (
                                <Button asChild>
                                    <Link to="/create-event">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Event
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Events</p>
                                <p className="text-xl font-bold">{filteredEvents.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Confirmed</p>
                                <p className="text-xl font-bold text-green-600">{filteredEvents.filter(e => e.hasConfirmedBooking).length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Open Events</p>
                                <p className="text-xl font-bold text-blue-600">{filteredEvents.filter(e => e.eventStatus === 'open').length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Music className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Applications</p>
                                <p className="text-xl font-bold text-purple-600">{filteredEvents.reduce((sum, e) => sum + (e.pendingApplications || 0), 0)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar View */}
            {renderMonthlyView()}
        </div>
    );
} 
