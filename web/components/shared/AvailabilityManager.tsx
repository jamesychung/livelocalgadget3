import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";
import AvailabilityForm from "./AvailabilityForm";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

interface AvailabilityManagerProps {
    availability: Record<string, TimeSlot[]>;
    onSave: (availability: Record<string, TimeSlot[]>) => Promise<void>;
    title?: string;
    description?: string;
}

export default function AvailabilityManager({
    availability,
    onSave,
    title = "Your Availability Schedule",
    description = "Set your available time slots for venues to see when booking you. You can view this in weekly or monthly format."
}: AvailabilityManagerProps) {
    const [currentAvailability, setCurrentAvailability] = useState<Record<string, TimeSlot[]>>(availability);
    const [currentTab, setCurrentTab] = useState(() => {
        // Try to get the saved tab from localStorage, default to "weekly"
        return localStorage.getItem('availability-tab') || "weekly";
    });

    // Save tab selection to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('availability-tab', currentTab);
    }, [currentTab]);

    // Sync local state with prop changes
    useEffect(() => {
        setCurrentAvailability(availability);
    }, [availability]);

    const handleAddAvailability = async (newSlots: TimeSlot[]) => {
        const updatedAvailability = { ...currentAvailability };
        
        newSlots.forEach(slot => {
            if (slot.date) {
                // Single date slot
                if (!updatedAvailability[slot.date]) {
                    updatedAvailability[slot.date] = [];
                }
                updatedAvailability[slot.date].push(slot);
            } else if (slot.recurringDays) {
                // Recurring slots
                slot.recurringDays.forEach(day => {
                    if (!updatedAvailability[day]) {
                        updatedAvailability[day] = [];
                    }
                    updatedAvailability[day].push({
                        ...slot,
                        recurringDays: [day]
                    });
                });
            }
        });

        setCurrentAvailability(updatedAvailability);
        await onSave(updatedAvailability);
    };

    const handleRemoveSlot = async (day: string, index: number) => {
        const updatedAvailability = { ...currentAvailability };
        if (updatedAvailability[day]) {
            updatedAvailability[day].splice(index, 1);
            if (updatedAvailability[day].length === 0) {
                delete updatedAvailability[day];
            }
        }
        setCurrentAvailability(updatedAvailability);
        await onSave(updatedAvailability);
    };

    return (
        <div className="space-y-6">
            {/* Calendar and Form Section */}
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent>
                    <AvailabilityForm
                        onAddAvailability={handleAddAvailability}
                        currentAvailability={currentAvailability}
                        title="Add New Availability"
                        description="Select dates and times for your availability"
                    />
                </CardContent>
            </Card>

            {/* View Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>View Your Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="weekly">
                                <Calendar className="mr-2 h-4 w-4" />
                                Weekly View
                            </TabsTrigger>
                            <TabsTrigger value="monthly">
                                <List className="mr-2 h-4 w-4" />
                                Monthly View
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="weekly" className="mt-6">
                            <WeeklyCalendar
                                data={currentAvailability}
                                onRemoveSlot={handleRemoveSlot}
                                emptyMessage="No availability"
                            />
                        </TabsContent>
                        
                        <TabsContent value="monthly" className="mt-6">
                            <MonthlyCalendar
                                data={currentAvailability}
                                onRemoveSlot={handleRemoveSlot}
                                emptyMessage="No availability"
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
} 