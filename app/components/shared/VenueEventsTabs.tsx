import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { VenueEventsList } from "./VenueEventsList";
import VenueEventCalendar from "./VenueEventCalendar";
import { VenueEventsWithApplications } from "./VenueEventsWithApplications";
import { VenueEventHistoryTab } from "./VenueEventHistoryTab";

interface VenueEventsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    allEvents: any[];
    venueBookings: any[];
    getApplicationCount: (eventId: string) => number;
    onEventClick: (event: any) => void;
    onEditEvent: (event: any) => void;
    getStatusBadge: (status: string | null | undefined) => { className: string; text: string };
    expandedApplications: Set<string>;
    toggleApplicationExpansion: (eventId: string) => void;
    handleBookApplication: (applicationId: string, eventId: string) => void;
    handleRejectApplication: (applicationId: string) => void;
}

export function VenueEventsTabs({
    activeTab,
    setActiveTab,
    allEvents,
    venueBookings,
    getApplicationCount,
    onEventClick,
    onEditEvent,
    getStatusBadge,
    expandedApplications,
    toggleApplicationExpansion,
    handleBookApplication,
    handleRejectApplication
}: VenueEventsTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="history">Event History</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
                <VenueEventCalendar 
                    events={allEvents}
                    onEditEvent={onEditEvent}
                />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
                <VenueEventsList
                    allEvents={allEvents}
                    getApplicationCount={getApplicationCount}
                    onEventClick={onEventClick}
                    onEditEvent={onEditEvent}
                    getStatusBadge={getStatusBadge}
                />
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
                <VenueEventsWithApplications
                    key={`applications-${venueBookings.length}-${JSON.stringify(venueBookings.map(b => ({ id: b.id, status: b.status })))}`}
                    events={allEvents}
                    bookings={venueBookings}
                    onAcceptApplication={handleBookApplication}
                    onRejectApplication={handleRejectApplication}
                />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
                <VenueEventHistoryTab eventId="" />
            </TabsContent>
        </Tabs>
    );
} 
