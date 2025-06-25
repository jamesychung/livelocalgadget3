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
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // State for current week offset
    const [weekOffset, setWeekOffset] = useState(0);
    
    // Get current week's dates - start from Sunday
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const sundayOffset = -currentDay; // Adjust for Sunday start
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + sundayOffset + (weekOffset * 7));
    
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        weekDates.push(date);
    }
    
    // Process data to handle both recurring and specific date availability
    const processDataForWeek = () => {
        const processedData: Record<string, TimeSlot[]> = {};
        
        // Initialize empty arrays for each day
        days.forEach(day => {
            processedData[day] = [];
        });
        
        // Process the data
        Object.entries(data).forEach(([key, slots]) => {
            if (days.includes(key)) {
                // This is recurring availability (sunday, monday, etc.)
                processedData[key] = [...slots];
            } else {
                // This is specific date availability (2025-06-22, etc.)
                try {
                    // Fix date parsing to avoid timezone issues
                    const [year, month, day] = key.split('-').map(Number);
                    const date = new Date(year, month - 1, day); // month is 0-indexed
                    const dayName = days[date.getDay()];
                    
                    // Check if this date falls within the current week
                    const weekStart = new Date(weekDates[0]);
                    const weekEnd = new Date(weekDates[6]);
                    weekStart.setHours(0, 0, 0, 0);
                    weekEnd.setHours(23, 59, 59, 999);
                    
                    if (date >= weekStart && date <= weekEnd) {
                        // Add slots for this specific date
                        slots.forEach(slot => {
                            processedData[dayName].push({
                                ...slot,
                                date: key // Preserve the original date
                            });
                        });
                    }
                } catch (error) {
                    console.warn('Invalid date format:', key);
                }
            }
        });
        
        return processedData;
    };
    
    const processedData = processDataForWeek();
    
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };
    
    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };
    
    const defaultRenderSlot = (slot: TimeSlot, day: string, index: number) => {
        // Determine the actual key for removal (day name for recurring, date for specific)
        const removeKey = slot.date || day;
        const removeIndex = slot.date ? 
            // For specific dates, find the index in the original data
            data[slot.date]?.findIndex(s => 
                s.startTime === slot.startTime && 
                s.endTime === slot.endTime
            ) ?? 0 : 
            index;
        
        // Fix date display to avoid timezone issues
        const formatDate = (dateString: string) => {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-indexed
            return date.toLocaleDateString();
        };
        
        return (
            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs">
                <div>
                    <div className="font-medium">
                        {slot.startTime} - {slot.endTime}
                    </div>
                    {/* Removed date display for cleaner weekly view */}
                </div>
                {onRemoveSlot && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveSlot(removeKey, removeIndex)}
                        className="h-6 px-2 text-xs"
                        disabled={isPast(weekDates[days.indexOf(day)])}
                    >
                        ×
                    </Button>
                )}
            </div>
        );
    };
    
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
                    const dayData = processedData[day] || [];
                    
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