import React from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Clock, X } from "lucide-react";

interface TimeSlot {
    startTime: string;
    endTime: string;
}

interface TimeSlotEditorProps {
    slot: TimeSlot;
    onUpdate: (field: 'startTime' | 'endTime', value: string) => void;
    onRemove: () => void;
    timeOptions: string[];
}

export default function TimeSlotEditor({
    slot,
    onUpdate,
    onRemove,
    timeOptions
}: TimeSlotEditorProps) {
    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select
                value={slot.startTime}
                onValueChange={(value) => onUpdate('startTime', value)}
            >
                <SelectTrigger className="w-24">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span>to</span>
            <Select
                value={slot.endTime}
                onValueChange={(value) => onUpdate('endTime', value)}
            >
                <SelectTrigger className="w-24">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
} 
