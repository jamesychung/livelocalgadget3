import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface TimeSlot {
    startTime: string;
    endTime: string;
    date?: string;
    recurringDays?: string[];
    recurringEndDate?: string;
}

interface AvailabilityFormProps {
    onAddAvailability: (availability: TimeSlot[]) => Promise<void>;
    title?: string;
    description?: string;
}

type DateSelectionMode = 'single' | 'range';

export default function AvailabilityForm({
    onAddAvailability,
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

    const handleSave = async () => {
        if (!startTime || !endTime) return;

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
                await onAddAvailability(newSlots);
                
                // Reset form
                setSelectedDate(undefined);
                setDateRange(undefined);
                setStartTime("09:00");
                setEndTime("17:00");
                setRecurringDays([]);
                setRecurringEndDate(undefined);
                setIsRecurring(false);
            } catch (error) {
                console.error("Error adding availability:", error);
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
                                !startTime || 
                                !endTime || 
                                (isRecurring && recurringDays.length === 0) ||
                                (dateSelectionMode === 'single' && !selectedDate && !isRecurring) ||
                                (dateSelectionMode === 'range' && (!dateRange?.from || !dateRange?.to) && !isRecurring)
                            }
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Availability
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 