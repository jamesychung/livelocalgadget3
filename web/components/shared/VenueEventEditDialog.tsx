import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface VenueEventEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingEvent: any;
    editFormData: {
        title: string;
        description: string;
        date: string;
        startTime: string;
        endTime: string;
        ticketPrice: string;
        totalCapacity: string;
        musicianId: string;
        status: string;
    };
    onEditFormDataChange: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function VenueEventEditDialog({
    open,
    onOpenChange,
    editingEvent,
    editFormData,
    onEditFormDataChange,
    onSubmit
}: VenueEventEditDialogProps) {
    const handleInputChange = (field: string, value: string) => {
        onEditFormDataChange({
            ...editFormData,
            [field]: value
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                value={editFormData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Enter event title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={editFormData.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={editFormData.startTime}
                                onChange={(e) => handleInputChange("startTime", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={editFormData.endTime}
                                onChange={(e) => handleInputChange("endTime", e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                            <Input
                                id="ticketPrice"
                                type="number"
                                value={editFormData.ticketPrice}
                                onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalCapacity">Total Capacity</Label>
                            <Input
                                id="totalCapacity"
                                type="number"
                                value={editFormData.totalCapacity}
                                onChange={(e) => handleInputChange("totalCapacity", e.target.value)}
                                placeholder="100"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={editFormData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 