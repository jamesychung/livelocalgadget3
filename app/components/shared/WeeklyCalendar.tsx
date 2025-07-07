import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Clock, Trash2 } from "lucide-react";

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
    
    // State for current week offset and dialog
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
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

    // Handle clicking on availability dots/times
    const handleAvailabilityClick = (day: string, date: Date) => {
        setSelectedDay(day);
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    // Format date for dialog title
    const formatDateForDialog = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Mobile dot renderer
    const renderMobileDots = (slots: TimeSlot[], day: string, date: Date) => (
        <div 
            className="flex flex-wrap gap-1 sm:hidden cursor-pointer p-2"
            onClick={() => handleAvailabilityClick(day, date)}
        >
            {slots.map((_, index) => (
                <div
                    key={index}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    title="Click to view times"
                />
            ))}
        </div>
    );

    // Desktop time renderer
    const renderDesktopTimes = (slots: TimeSlot[], day: string, date: Date) => (
        <div 
            className="hidden sm:block space-y-2 cursor-pointer"
            onClick={() => handleAvailabilityClick(day, date)}
        >
            {slots.map((slot, slotIndex) => 
                defaultRenderSlot(slot, day, slotIndex)
            )}
        </div>
    );
    
    const defaultRenderSlot = (slot: TimeSlot, day: string, index: number) => {
        return (
            <div key={index} className="p-2 bg-blue-50 rounded text-xs hover:bg-blue-100 transition-colors">
                <div className="font-medium">
                    {slot.startTime} - {slot.endTime}
                </div>
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
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {days.map((day, index) => {
                    const date = weekDates[index];
                    const isCurrentDay = isToday(date);
                    const isPastDay = isPast(date);
                    const dayData = processedData[day] || [];
                    
                    return (
                        <Card 
                            key={day} 
                            className={`min-h-[120px] sm:min-h-[200px] ${
                                isCurrentDay 
                                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                                    : isPastDay 
                                        ? 'opacity-50 bg-gray-50' 
                                        : ''
                            }`}
                        >
                            <CardHeader className="pb-1 sm:pb-2 p-2 sm:p-4">
                                <CardTitle className="text-xs sm:text-sm font-medium text-center">
                                    <div className={`text-xs mb-1 ${
                                        isCurrentDay 
                                            ? 'text-blue-600 font-semibold' 
                                            : isPastDay 
                                                ? 'text-gray-400' 
                                                : ''
                                    }`}>
                                        {dayNames[index]}
                                    </div>
                                    <div className={`text-lg sm:text-xl font-bold ${
                                        isCurrentDay 
                                            ? 'text-blue-600' 
                                            : isPastDay 
                                                ? 'text-gray-400' 
                                                : ''
                                    }`}>
                                        {date.getDate()}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="pt-0 p-1 sm:p-4">
                                {dayData.length > 0 ? (
                                    <>
                                        {/* Mobile: Show dots */}
                                        {renderMobileDots(dayData, day, date)}
                                        {/* Desktop: Show times */}
                                        {renderDesktopTimes(dayData, day, date)}
                                    </>
                                ) : (
                                    <div className="text-center text-muted-foreground text-xs py-4 sm:py-8">
                                        <Clock className="mx-auto h-3 w-3 sm:h-4 sm:w-4 mb-2 opacity-50" />
                                        <span className="hidden sm:inline">{emptyMessage}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Availability Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Availability for {selectedDate && formatDateForDialog(selectedDate)}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {selectedDay && processedData[selectedDay] && processedData[selectedDay].length > 0 ? (
                            processedData[selectedDay].map((slot, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">
                                            {slot.startTime} - {slot.endTime}
                                        </span>
                                    </div>
                                    {onRemoveSlot && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const removeKey = slot.date || selectedDay;
                                                const removeIndex = slot.date ? 
                                                    data[slot.date]?.findIndex(s => 
                                                        s.startTime === slot.startTime && 
                                                        s.endTime === slot.endTime
                                                    ) ?? 0 : 
                                                    index;
                                                
                                                onRemoveSlot(removeKey, removeIndex);
                                                
                                                // Close dialog if no more slots
                                                if (processedData[selectedDay].length === 1) {
                                                    setIsDialogOpen(false);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No availability found for this day.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
