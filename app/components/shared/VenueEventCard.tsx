import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { EventActions } from "./EventActions";

interface VenueEventCardProps {
    event: {
        id: string;
        title: string;
        date: string;
        startTime: string;
        endTime: string;
        eventStatus: string;
        totalCapacity?: number;
        availableTickets?: number;
        ticketPrice?: number;
        venue?: {
            id: string;
            name: string;
        };
        musician?: {
            id: string;
            stageName: string;
            genre?: string;
            city?: string;
            state?: string;
        };
    };
    applicationCount: number;
    onEventClick: (event: any) => void;
    onEditEvent: (event: any) => void;
    getStatusBadge: (status: string | null | undefined) => { className: string; text: string };
}

export const VenueEventCard: React.FC<VenueEventCardProps> = ({
    event,
    applicationCount,
    onEventClick,
    onEditEvent,
    getStatusBadge,
}) => {
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

    const statusBadge = getStatusBadge(event.eventStatus);

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </span>
                            </div>
                            {event.venue && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.venue.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={statusBadge.className}>
                            {statusBadge.text}
                        </Badge>
                        {applicationCount > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Users className="h-3 w-3 mr-1" />
                                {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {event.musician && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Musician:</span>
                                <span>{event.musician.stageName}</span>
                                {event.musician.city && event.musician.state && (
                                    <span className="text-gray-500">
                                        ({event.musician.city}, {event.musician.state})
                                    </span>
                                )}
                            </div>
                        )}
                        {event.totalCapacity && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Capacity:</span>
                                <span>{event.totalCapacity}</span>
                            </div>
                        )}
                        {event.ticketPrice && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Price:</span>
                                <span>${event.ticketPrice}</span>
                            </div>
                        )}
                    </div>
                    
                    <EventActions
                        onView={() => onEventClick(event)}
                        onEdit={() => onEditEvent(event)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}; 
