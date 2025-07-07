import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trash2, Clock } from "lucide-react";

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
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
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

    // Handle clicking on availability dots/times
    const handleAvailabilityClick = (date: string) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    // Format date for dialog title
    const formatDateForDialog = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Mobile dot renderer
    const renderMobileDots = (slots: TimeSlot[], date: string) => (
        <div 
            className="flex flex-wrap gap-1 sm:hidden cursor-pointer"
            onClick={() => handleAvailabilityClick(date)}
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
    const renderDesktopTimes = (slots: TimeSlot[], date: string) => (
        <div 
            className="hidden sm:block space-y-1 cursor-pointer"
            onClick={() => handleAvailabilityClick(date)}
        >
            {slots.map((slot, slotIndex) => 
                defaultRenderSlot(slot, date, slotIndex)
            )}
        </div>
    );

    const defaultRenderSlot = (slot: TimeSlot, date: string, index: number) => (
        <div
            key={index}
            className="text-xs p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            title="Click to view and manage times"
        >
            <span>{slot.startTime}-{slot.endTime}</span>
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
                            className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border rounded-lg ${
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
                                        <>
                                            {/* Mobile: Show dots */}
                                            {renderMobileDots(data[dayInfo.date], dayInfo.date)}
                                            {/* Desktop: Show times */}
                                            {renderDesktopTimes(data[dayInfo.date], dayInfo.date)}
                                        </>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
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
                        {selectedDate && data[selectedDate] ? (
                            data[selectedDate].map((slot, index) => (
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
                                                onRemoveSlot(selectedDate, index);
                                                // Close dialog if no more slots
                                                if (data[selectedDate].length === 1) {
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
                                No availability found for this date.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
