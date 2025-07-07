import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Save, Calendar as CalendarIcon, AlertTriangle, Plus } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription } from "../ui/alert";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

interface AvailabilityFormProps {
    onAddAvailability: (availability: TimeSlot[]) => Promise<void>;
    currentAvailability?: Record<string, TimeSlot[]>;
    title?: string;
    description?: string;
}

type DateSelectionMode = 'single' | 'range';

export default function AvailabilityForm({
    onAddAvailability,
    currentAvailability = {},
    title = "Manage Availability",
    description = "Click the button below to add your availability."
}: AvailabilityFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dateSelectionMode, setDateSelectionMode] = useState<DateSelectionMode>('single');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [recurringDays, setRecurringDays] = useState<string[]>([]);
    const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(undefined);
    const [isRecurring, setIsRecurring] = useState(false);
    const [conflicts, setConflicts] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Debug: Log when currentAvailability changes
    useEffect(() => {
        setConflicts([]); // Clear conflicts when data changes
    }, [currentAvailability]);

    // Generate time options (every half hour)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(time);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    };

    // Handle "Add New Availability" button click
    const handleAddNewClick = () => {
        setSelectedDate(undefined);
        setDateRange(undefined);
        setIsRecurring(false);
        setIsDialogOpen(true);
    };

    // Check for time conflicts
    const checkTimeConflict = (start1: string, end1: string, start2: string, end2: string): boolean => {
        const s1 = new Date(`2000-01-01T${start1}`);
        const e1 = new Date(`2000-01-01T${end1}`);
        const s2 = new Date(`2000-01-01T${start2}`);
        const e2 = new Date(`2000-01-01T${end2}`);
        
        return (s1 < e2 && e1 > s2);
    };

    // Check for conflicts with existing availability
    const checkConflicts = (): string[] => {
        const conflictMessages = new Set<string>();
        
        if (!startTime || !endTime) return [];

        // Validate time range
        if (startTime >= endTime) {
            conflictMessages.add("End time must be after start time");
            return Array.from(conflictMessages);
        }

        const newSlots: TimeSlot[] = [];

        if (isRecurring && recurringDays.length > 0) {
            // Generate slots for recurring days
            recurringDays.forEach(day => {
                newSlots.push({ 
                    startTime, 
                    endTime,
                    date: undefined,
                    recurringDays: [day],
                    recurringEndDate: recurringEndDate ? format(recurringEndDate, 'yyyy-MM-dd') : undefined
                });
            });
        } else if (dateSelectionMode === 'single' && selectedDate) {
            // Generate slot for specific date
            newSlots.push({ 
                startTime, 
                endTime,
                date: format(selectedDate, 'yyyy-MM-dd')
            });
        } else if (dateSelectionMode === 'range' && dateRange?.from && dateRange?.to) {
            // Generate slots for date range
            const currentDate = new Date(dateRange.from);
            const endDate = new Date(dateRange.to);
            
            while (currentDate <= endDate) {
                newSlots.push({ 
                    startTime, 
                    endTime,
                    date: format(currentDate, 'yyyy-MM-dd')
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // Check each new slot against existing availability
        newSlots.forEach(slot => {
            if (slot.date) {
                // Check specific date
                const existingSlots = currentAvailability[slot.date] || [];
                existingSlots.forEach(existingSlot => {
                    if (checkTimeConflict(slot.startTime, slot.endTime, existingSlot.startTime, existingSlot.endTime)) {
                        // Fix date formatting to avoid timezone issues
                        const [year, month, day] = slot.date!.split('-').map(Number);
                        const dateObj = new Date(year, month - 1, day); // month is 0-indexed
                        const conflictMsg = `Conflict on ${format(dateObj, 'EEEE, MMMM d, yyyy')}: ${slot.startTime}-${slot.endTime} overlaps with existing ${existingSlot.startTime}-${existingSlot.endTime}`;
                        conflictMessages.add(conflictMsg);
                    }
                });
            } else if (slot.recurringDays) {
                // Check recurring days
                slot.recurringDays.forEach(day => {
                    const existingSlots = currentAvailability[day] || [];
                    existingSlots.forEach(existingSlot => {
                        if (checkTimeConflict(slot.startTime, slot.endTime, existingSlot.startTime, existingSlot.endTime)) {
                            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                            const conflictMsg = `Conflict on ${dayName}: ${slot.startTime}-${slot.endTime} overlaps with existing ${existingSlot.startTime}-${existingSlot.endTime}`;
                            conflictMessages.add(conflictMsg);
                        }
                    });
                });
            }
        });

        return Array.from(conflictMessages);
    };

    // Update conflicts when form values change
    useEffect(() => {
        // Don't check conflicts while saving to prevent false conflicts during data refresh
        if (isSaving) return;
        
        const newConflicts = checkConflicts();
        setConflicts(newConflicts);
    }, [startTime, endTime, selectedDate, dateRange, recurringDays, isRecurring, currentAvailability, isSaving]);

    const handleSave = async () => {
        if (!startTime || !endTime) return;

        // Check for conflicts before saving
        const newConflicts = checkConflicts();
        if (newConflicts.length > 0) {
            setConflicts(newConflicts);
            return;
        }

        const newSlots: TimeSlot[] = [];

        if (isRecurring && recurringDays.length > 0) {
            // Apply to recurring days
            recurringDays.forEach(day => {
                newSlots.push({ 
                    startTime, 
                    endTime,
                    date: undefined,
                    recurringDays: recurringDays,
                    recurringEndDate: recurringEndDate ? format(recurringEndDate, 'yyyy-MM-dd') : undefined
                });
            });
        } else if (dateSelectionMode === 'single' && selectedDate) {
            // Apply to specific date
            newSlots.push({ 
                startTime, 
                endTime,
                date: format(selectedDate, 'yyyy-MM-dd')
            });
        } else if (dateSelectionMode === 'range' && dateRange?.from && dateRange?.to) {
            // Apply to date range
            const currentDate = new Date(dateRange.from);
            const endDate = new Date(dateRange.to);
            
            while (currentDate <= endDate) {
                newSlots.push({ 
                    startTime, 
                    endTime,
                    date: format(currentDate, 'yyyy-MM-dd')
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        if (newSlots.length > 0) {
            try {
                setIsSaving(true);
                await onAddAvailability(newSlots);
                
                // Reset form and close dialog
                setSelectedDate(undefined);
                setDateRange(undefined);
                setStartTime("09:00");
                setEndTime("17:00");
                setRecurringDays([]);
                setRecurringEndDate(undefined);
                setIsRecurring(false);
                setConflicts([]);
                setIsDialogOpen(false);
            } catch (error) {
                console.error("Error adding availability:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleSingleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    const handleRangeSelect = (range: DateRange | undefined) => {
        if (!range) {
            setDateRange(undefined);
            return;
        }
        setDateRange(range);
    };



    return (
        <Card className="w-full">
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
                <CardTitle className="text-base sm:text-lg md:text-xl leading-tight break-words">{title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed break-words">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
                {/* Add New Availability Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Availability
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Availability</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* Conflict Alert */}
                            {conflicts.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-1">
                                            <p className="font-medium">Conflicts detected:</p>
                                            {conflicts.map((conflict, index) => (
                                                <p key={index} className="text-sm">• {conflict}</p>
                                            ))}
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Date Selection Mode Tabs */}
                            <Tabs value={dateSelectionMode} onValueChange={(value) => setDateSelectionMode(value as DateSelectionMode)}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="single">One Day</TabsTrigger>
                                    <TabsTrigger value="range">Multiple Days</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* Calendar for Date Selection */}
                            <div className="border rounded-lg p-3">
                                {dateSelectionMode === 'single' ? (
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleSingleDateSelect}
                                        numberOfMonths={1}
                                        className="rounded-md w-full"
                                        disabled={(date) => date < new Date()}
                                    />
                                ) : (
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={handleRangeSelect}
                                        numberOfMonths={1}
                                        className="rounded-md w-full"
                                        disabled={(date) => date < new Date()}
                                    />
                                )}
                            </div>

                            {/* Selected Date Display */}
                            {(selectedDate || dateRange?.from) && (
                                <div className="p-2 bg-gray-50 rounded border text-sm">
                                    {dateSelectionMode === 'single' ? (
                                        selectedDate && (
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                                </span>
                                            </div>
                                        )
                                    ) : (
                                        dateRange?.from && (
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {format(dateRange.from, "MMM d, yyyy")}
                                                    {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Time Selection */}
                            <div className="space-y-2">
                                <Label>Time Range</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-sm">From</Label>
                                        <Select value={startTime} onValueChange={setStartTime}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeOptions.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm">To</Label>
                                        <Select value={endTime} onValueChange={setEndTime}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeOptions.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Recurring Option */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="recurring"
                                        checked={isRecurring}
                                        onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                                    />
                                    <Label htmlFor="recurring">Apply to recurring days</Label>
                                </div>

                                {/* Day Selection */}
                                {isRecurring && (
                                    <div className="space-y-3">
                                        <Label>Select Days</Label>
                                        <div className="grid grid-cols-7 gap-2">
                                            {[
                                                { key: 'monday', label: 'Mon' },
                                                { key: 'tuesday', label: 'Tue' },
                                                { key: 'wednesday', label: 'Wed' },
                                                { key: 'thursday', label: 'Thu' },
                                                { key: 'friday', label: 'Fri' },
                                                { key: 'saturday', label: 'Sat' },
                                                { key: 'sunday', label: 'Sun' }
                                            ].map((day) => (
                                                <div key={day.key} className="flex items-center space-x-1">
                                                    <Checkbox
                                                        id={day.key}
                                                        checked={recurringDays.includes(day.key)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setRecurringDays([...recurringDays, day.key]);
                                                            } else {
                                                                setRecurringDays(recurringDays.filter(d => d !== day.key));
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={day.key} className="text-sm">
                                                        {day.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recurring End Date */}
                                        <div className="space-y-2">
                                            <Label>End Date (Optional)</Label>
                                            <Calendar
                                                mode="single"
                                                selected={recurringEndDate}
                                                onSelect={setRecurringEndDate}
                                                className="rounded-md border"
                                                disabled={(date) => date < new Date()}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <Button
                                onClick={handleSave}
                                className="w-full"
                                disabled={
                                    isSaving ||
                                    !startTime || 
                                    !endTime || 
                                    conflicts.length > 0 ||
                                    (isRecurring && recurringDays.length === 0) ||
                                    (dateSelectionMode === 'single' && !selectedDate && !isRecurring) ||
                                    (dateSelectionMode === 'range' && (!dateRange?.from || !dateRange?.to) && !isRecurring)
                                }
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Availability"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
} 
