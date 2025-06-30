import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Clock, Calendar } from "lucide-react";

interface VenueEventsStatsProps {
    totalEvents: number;
    eventsWithApplications: number;
    totalApplications: number;
    pendingApplications: number;
    eventsThisMonth: number;
}

export function VenueEventsStats({
    totalEvents,
    eventsWithApplications,
    totalApplications,
    pendingApplications,
    eventsThisMonth
}: VenueEventsStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Music className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                        All events
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events with Applications</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                        {eventsWithApplications}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {totalApplications} total applications
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                        {pendingApplications}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting your decision
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                        {eventsThisMonth}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Events this month
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 