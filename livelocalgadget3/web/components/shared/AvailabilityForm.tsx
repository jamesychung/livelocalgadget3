import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    title = "Add Availability",
    description = "Select dates and times for your availability. Choose between single day or multiple days."
}: AvailabilityFormProps) {
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
                
                // Reset form
                setSelectedDate(undefined);
                setDateRange(undefined);
                setStartTime("09:00");
                setEndTime("17:00");
                setRecurringDays([]);
                setRecurringEndDate(undefined);
                setIsRecurring(false);
                setConflicts([]);
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
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Calendar */}
                    <div className="space-y-4">
                        {/* Date Selection Mode Tabs */}
                        <Tabs value={dateSelectionMode} onValueChange={(value) => setDateSelectionMode(value as DateSelectionMode)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="single">One Day</TabsTrigger>
                                <TabsTrigger value="range">Multiple Days</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Calendar - Always Visible */}
                        <div className="border rounded-lg p-4">
                            {dateSelectionMode === 'single' ? (
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleSingleDateSelect}
                                    numberOfMonths={2}
                                    className="rounded-md"
                                    disabled={(date) => date < new Date()}
                                />
                            ) : (
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={handleRangeSelect}
                                    numberOfMonths={2}
                                    className="rounded-md"
                                    disabled={(date) => date < new Date()}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Side - Form Controls */}
                    <div className="space-y-6">
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

                        {/* Selected Date/Range Display */}
                        <div className="space-y-2">
                            <Label>Selected {dateSelectionMode === 'single' ? 'Date' : 'Date Range'}</Label>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                                {dateSelectionMode === 'single' ? (
                                    selectedDate ? (
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">No date selected</span>
                                    )
                                ) : (
                                    dateRange?.from ? (
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {format(dateRange.from, "MMM d, yyyy")}
                                                {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">No date range selected</span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-4">
                            <Label>Time Range</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
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
                                <div className="space-y-2">
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
                        <div className="space-y-4">
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
                                <div className="space-y-4">
                                    <Label>Select Days</Label>
                                    <div className="grid grid-cols-7 gap-2">
                                        {[
                                            { key: 'monday', label: 'M' },
                                            { key: 'tuesday', label: 'T' },
                                            { key: 'wednesday', label: 'W' },
                                            { key: 'thursday', label: 'Th' },
                                            { key: 'friday', label: 'F' },
                                            { key: 'saturday', label: 'Sa' },
                                            { key: 'sunday', label: 'Su' }
                                        ].map((day) => (
                                            <div key={day.key} className="flex items-center space-x-2">
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
                </div>
            </CardContent>
        </Card>
    );
} 