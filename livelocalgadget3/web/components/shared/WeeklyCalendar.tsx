import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

interface WeeklyCalendarProps {
    data: Record<string, TimeSlot[]>;
    onRemoveSlot?: (day: string, index: number) => void;
    renderSlot?: (slot: TimeSlot, day: string, index: number) => React.ReactNode;
    emptyMessage?: string;
    maxPastWeeks?: number;
    showNavigation?: boolean;
    className?: string;
}

export default function WeeklyCalendar({
    data,
    onRemoveSlot,
    renderSlot,
    emptyMessage = "No availability",
    maxPastWeeks = 4,
    showNavigation = true,
    className = ""
}: WeeklyCalendarProps) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // State for current week offset
    const [weekOffset, setWeekOffset] = useState(0);
    
    // Get current week's dates
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Monday start
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }
    
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };
    
    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };
    
    const defaultRenderSlot = (slot: TimeSlot, day: string, index: number) => (
        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs">
            <div>
                <div className="font-medium">
                    {slot.startTime} - {slot.endTime}
                </div>
                {slot.date && (
                    <div className="text-muted-foreground">
                        {new Date(slot.date).toLocaleDateString()}
                    </div>
                )}
            </div>
            {onRemoveSlot && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveSlot(day, index)}
                    className="h-6 px-2 text-xs"
                    disabled={isPast(weekDates[days.indexOf(day)])}
                >
                    ×
                </Button>
            )}
        </div>
    );
    
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Week Navigation */}
            {showNavigation && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(weekOffset - 1)}
                        disabled={weekOffset <= -maxPastWeeks}
                    >
                        ← Previous Week
                    </Button>
                    <div className="text-sm font-medium">
                        {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(weekOffset + 1)}
                    >
                        Next Week →
                    </Button>
                </div>
            )}
            
            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-4">
                {days.map((day, index) => {
                    const date = weekDates[index];
                    const isCurrentDay = isToday(date);
                    const isPastDay = isPast(date);
                    const dayData = data[day] || [];
                    
                    return (
                        <Card 
                            key={day} 
                            className={`min-h-[200px] ${
                                isCurrentDay 
                                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                                    : isPastDay 
                                        ? 'opacity-50 bg-gray-50' 
                                        : ''
                            }`}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-center">
                                    <div className={`text-xs mb-1 ${
                                        isCurrentDay 
                                            ? 'text-blue-600 font-semibold' 
                                            : isPastDay 
                                                ? 'text-gray-400' 
                                                : 'text-muted-foreground'
                                    }`}>
                                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className={isCurrentDay ? 'text-blue-600 font-semibold' : ''}>
                                        {dayNames[index]}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {dayData.length > 0 ? (
                                    <div className="space-y-2">
                                        {dayData.map((slot, slotIndex) => 
                                            renderSlot ? renderSlot(slot, day, slotIndex) : defaultRenderSlot(slot, day, slotIndex)
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground text-xs py-8">
                                        <Clock className="mx-auto h-4 w-4 mb-2 opacity-50" />
                                        {emptyMessage}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
} 