import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeSlot {
    startTime: string;
    endTime: string;
}

interface AvailabilityData {
    [day: string]: TimeSlot[];
}

interface AvailabilitySummaryProps {
    availability: AvailabilityData;
    title?: string;
}

export default function AvailabilitySummary({
    availability,
    title = "Availability Summary"
}: AvailabilitySummaryProps) {
    const calculateTotalHours = () => {
        let totalHours = 0;
        Object.values(availability).forEach(daySlots => {
            daySlots.forEach(slot => {
                const start = new Date(`2000-01-01T${slot.startTime}`);
                const end = new Date(`2000-01-01T${slot.endTime}`);
                totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            });
        });
        return totalHours;
    };

    const totalTimeSlots = Object.values(availability).reduce((total, daySlots) => total + daySlots.length, 0);
    const daysAvailable = Object.keys(availability).length;
    const totalHours = calculateTotalHours();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {daysAvailable}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Available</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {totalTimeSlots}
                        </div>
                        <div className="text-sm text-muted-foreground">Time Slots</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {Math.round(totalHours)}h
                        </div>
                        <div className="text-sm text-muted-foreground">Total Hours</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 