import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Plus, X, Save, Settings, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Music, Building } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface Event {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'confirmed' | 'proposed' | 'cancelled';
    musician?: {
        id: string;
        name: string;
        stageName?: string;
    };
    totalAmount?: number;
    notes?: string;
}

interface Application {
    id: string;
    event: {
        id: string;
    };
    status: string;
    musician: {
        id: string;
        name: string;
        stageName?: string;
    };
}

interface VenueEventCalendarProps {
    events: Event[];
    applications?: Application[];
    onAddEvent?: (event: Partial<Event>) => Promise<void>;
    onUpdateEvent?: (eventId: string, updates: Partial<Event>) => Promise<void>;
    onDeleteEvent?: (eventId: string) => Promise<void>;
    onEditEvent?: (event: Event) => void;
    onEventClick?: (event: Event) => void;
    isEditing?: boolean;
    onEditToggle?: () => void;
    title?: string;
    description?: string;
}

type ViewMode = 'weekly' | 'monthly';
type EventType = 'all' | 'confirmed' | 'proposed';

export default function VenueEventCalendar({
    events,
    applications,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onEditEvent,
    onEventClick,
    isEditing = false,
    onEditToggle,
    title = "Venue Event Calendar",
    description = "Manage your venue's events and bookings"
}: VenueEventCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [eventTypeFilter, setEventTypeFilter] = useState<EventType>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Filter events based on type
    const filteredEvents = events.filter(event => {
        if (eventTypeFilter === 'all') return true;
        return event.status === eventTypeFilter;
    });

    // Helper to get application count for an event
    const getApplicationCount = (eventId: string) => {
        return applications?.filter(app => app.event?.id === eventId).length || 0;
    };

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            confirmed: "bg-green-100 text-green-800",
            proposed: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

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
                    <div className="space-y-4">
                        {weekDates.map((date, index) => {
                            const dayEvents = getEventsForDate(date);
                            const isTodayDate = isToday(date);
                            
                            return (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">
                                                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </h3>
                                            {isTodayDate && (
                                                <Badge variant="secondary">Today</Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    
                                    {dayEvents.length > 0 ? (
                                        <div className="space-y-2">
                                            {dayEvents.map((event) => {
                                                const applicationCount = getApplicationCount(event.id);
                                                return (
                                                    <div 
                                                        key={event.id} 
                                                        className={`
                                                            p-3 border rounded-lg cursor-pointer transition-colors
                                                            ${applicationCount > 0 ? 'bg-yellow-50 border-yellow-200' :
                                                              event.status === 'confirmed' ? 'bg-green-50 border-green-200' : 
                                                              event.status === 'proposed' ? 'bg-yellow-50 border-yellow-200' : 
                                                              'bg-gray-50 border-gray-200'}
                                                            hover:shadow-md
                                                        `}
                                                        onClick={() => (onEventClick ? onEventClick(event) : onEditEvent?.(event))}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="font-medium">{event.title}</p>
                                                                    {applicationCount > 0 && (
                                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                                                            {applicationCount} Musician{applicationCount !== 1 ? 's' : ''} Applied
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {event.startTime} - {event.endTime}
                                                                </p>
                                                                {event.musician && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        <Link 
                                                                            to={`/musician/${event.musician.id}`}
                                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {event.musician.stageName || event.musician.name}
                                                                        </Link>
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {getStatusBadge(event.status)}
                                                                {event.totalAmount && (
                                                                    <Badge variant="outline">
                                                                        ${event.totalAmount}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground">
                                            <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No events scheduled</p>
                                        </div>
                                    )}
                                </div>
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
                            <div
                                key={index}
                                className={`
                                    min-h-[100px] p-2 border rounded-lg transition-colors
                                    ${isCurrentMonthDate ? 'bg-white' : 'bg-gray-50'}
                                    ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                                    ${dayEvents.length > 0 ? 'bg-blue-50 border-blue-200' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`
                                        text-sm font-medium
                                        ${isCurrentMonthDate ? 'text-gray-900' : 'text-gray-400'}
                                        ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                                    `}>
                                        {date.getDate()}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {dayEvents.length}
                                        </Badge>
                                    )}
                                </div>
                                {dayEvents.length > 0 && (
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map((event) => {
                                            const applicationCount = getApplicationCount(event.id);
                                            return (
                                                <div 
                                                    key={event.id} 
                                                    className={`
                                                        text-xs p-1 rounded border cursor-pointer hover:bg-gray-50
                                                        ${applicationCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}
                                                    `}
                                                    onClick={() => (onEventClick ? onEventClick(event) : onEditEvent?.(event))}
                                                >
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <div className="font-medium truncate flex-1">{event.title}</div>
                                                        {applicationCount > 0 && (
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-1">
                                                                {applicationCount}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground truncate">
                                                        {event.startTime} - {event.musician && (
                                                            <Link 
                                                                to={`/musician/${event.musician.id}`}
                                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {event.musician.stageName || event.musician.name}
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusBadge(event.status)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-muted-foreground text-center">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">View:</span>
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
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
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
                    </div>
                </CardContent>
            </Card>

            {/* Calendar View */}
            {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
        </div>
    );
} 