import { VenueEventCard } from "./VenueEventCard";

interface VenueEventsListProps {
    allEvents: any[];
    getApplicationCount: (eventId: string) => number;
    onEventClick: (event: any) => void;
    onEditEvent: (event: any) => void;
    getStatusBadge: (status: string | null | undefined) => { className: string; text: string };
}

export function VenueEventsList({
    allEvents,
    getApplicationCount,
    onEventClick,
    onEditEvent,
    getStatusBadge
}: VenueEventsListProps) {
    if (allEvents.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No events found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {allEvents.map((event) => (
                <VenueEventCard
                    key={event.id}
                    event={event}
                    applicationCount={getApplicationCount(event.id)}
                    onEventClick={onEventClick}
                    onEditEvent={onEditEvent}
                    getStatusBadge={getStatusBadge}
                />
            ))}
        </div>
    );
} 