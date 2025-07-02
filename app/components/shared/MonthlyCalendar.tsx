import React, { useState } from "react";
import { Button } from "../ui/button";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

interface MonthlyCalendarProps {
    data: Record<string, TimeSlot[]>;
    onRemoveSlot?: (date: string, index: number) => void;
    renderSlot?: (slot: TimeSlot, date: string, index: number) => React.ReactNode;
    emptyMessage?: string;
    maxPastMonths?: number;
    showNavigation?: boolean;
    className?: string;
}

export default function MonthlyCalendar({
    data,
    onRemoveSlot,
    renderSlot,
    emptyMessage = "No availability",
    maxPastMonths = 12,
    showNavigation = true,
    className = ""
}: MonthlyCalendarProps) {
    const [monthOffset, setMonthOffset] = useState(0);
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Calculate the month to display
    const displayMonth = new Date(currentYear, currentMonth + monthOffset, 1);
    const displayYear = displayMonth.getFullYear();
    const displayMonthIndex = displayMonth.getMonth();
    
    const daysInMonth = new Date(displayYear, displayMonthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(displayYear, displayMonthIndex, 1).getDay();
    
    // Adjust for Sunday start (0 = Sunday, 6 = Saturday)
    const sundayStart = firstDayOfMonth;
    
    const days = [];
    for (let i = 0; i < sundayStart; i++) {
        days.push(null); // Empty cells for days before month starts
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(displayYear, displayMonthIndex, day);
        const dateString = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        days.push({
            day,
            date: dateString,
            dayName,
            hasData: data[dateString] && data[dateString].length > 0,
            isToday: date.toDateString() === today.toDateString(),
            isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
        });
    }

    const defaultRenderSlot = (slot: TimeSlot, date: string, index: number) => (
        <div
            key={index}
            className="flex items-center justify-between text-xs p-1 rounded bg-blue-50 text-blue-700"
            title={`${slot.startTime} - ${slot.endTime}`}
        >
            <span>{slot.startTime}-{slot.endTime}</span>
            {onRemoveSlot && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSlot(date, index);
                    }}
                    className="h-4 w-4 p-0 text-xs ml-1"
                >
                    ×
                </Button>
            )}
        </div>
    );
    
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Month Navigation */}
            {showNavigation && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMonthOffset(monthOffset - 1)}
                        disabled={monthOffset <= -maxPastMonths}
                    >
                        ← Previous Month
                    </Button>
                    <div className="text-sm font-medium">
                        {displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMonthOffset(monthOffset + 1)}
                    >
                        Next Month →
                    </Button>
                </div>
            )}
            
            {/* Calendar Grid */}
            <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((dayInfo, index) => (
                        <div
                            key={index}
                            className={`min-h-[80px] p-2 border rounded-lg ${
                                dayInfo ? (
                                    dayInfo.isToday 
                                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                                        : dayInfo.isPast 
                                            ? 'opacity-50 bg-gray-50' 
                                            : 'bg-white'
                                ) : 'bg-gray-50'
                            }`}
                        >
                            {dayInfo ? (
                                <div className="space-y-1">
                                    <div className={`text-sm font-medium ${
                                        dayInfo.isToday 
                                            ? 'text-blue-600 font-semibold' 
                                            : dayInfo.isPast 
                                                ? 'text-gray-400' 
                                                : ''
                                    }`}>
                                        {dayInfo.day}
                                    </div>
                                    {dayInfo.hasData && (
                                        <div className="space-y-1">
                                            {data[dayInfo.date]?.map((slot, slotIndex) => 
                                                renderSlot ? renderSlot(slot, dayInfo.date, slotIndex) : defaultRenderSlot(slot, dayInfo.date, slotIndex)
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
