import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface VenueEventsHeaderProps {
    venueName?: string;
}

export function VenueEventsHeader({ venueName }: VenueEventsHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link to="/venue-dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Venue Events Management</h1>
                    <p className="text-muted-foreground">
                        Manage events and bookings for {venueName ?? "your venue"}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                {/* Create Event button moved to calendar section */}
            </div>
        </div>
    );
} 