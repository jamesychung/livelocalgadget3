import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Clock, Music, DollarSign, MapPin, Edit, CheckCircle, User } from "lucide-react";

interface VenueEventCardProps {
    event: any;
    applicationCount: number;
    onEventClick: (event: any) => void;
    onEditEvent: (event: any) => void;
    getStatusBadge: (status: string | null | undefined) => { className: string; text: string };
}

export function VenueEventCard({
    event,
    applicationCount,
    onEventClick,
    onEditEvent,
    getStatusBadge
}: VenueEventCardProps) {
    const statusBadge = getStatusBadge(event.eventStatus);

    return (
        <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h3 
                        className="font-semibold cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => onEventClick(event)}
                    >
                        {event.title}
                    </h3>
                    {applicationCount > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                            {applicationCount} Musician{applicationCount !== 1 ? 's' : ''} Applied
                        </Badge>
                    )}
                    <Badge className={statusBadge.className}>
                        {statusBadge.text}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                    </div>
                    <Button
                        className="h-8 px-3 text-xs"
                        onClick={() => onEditEvent(event)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.startTime && event.endTime ? 
                        `${event.startTime} - ${event.endTime}` : 
                        'Time TBD'
                    }
                </div>
                {event.musician && (
                    <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <Link 
                            to={`/musician/${event.musician.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            {event.musician.stageName}
                        </Link>
                    </div>
                )}
                {event.ticketPrice && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        ${event.ticketPrice}
                    </div>
                )}
            </div>
            
            {/* Confirmed Musician Information */}
            {event.musician && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium text-green-800">Confirmed Musician</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{event.musician.stageName}</span>
                        </div>
                        {event.musician.genre && (
                            <div className="flex items-center gap-2">
                                <Music className="h-4 w-4 text-muted-foreground" />
                                <span>{event.musician.genre}</span>
                            </div>
                        )}
                        {event.musician.city && event.musician.state && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.musician.city}, {event.musician.state}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 