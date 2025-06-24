import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useFindOne, useAction } from "@gadgetinc/react";
import { api } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, X } from "lucide-react";
import { format } from 'date-fns';

export default function EditEventPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [updateEvent, { fetching: updatingEvent }] = useAction(api.event.update);

    const [{ data: event, fetching, error }] = useFindOne(api.event, eventId!, {
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            ticketPrice: true,
            totalCapacity: true,
        }
    });

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        totalCapacity: ""
    });

    // Update form data when event is loaded
    React.useEffect(() => {
        if (event) {
            setFormData({
                title: (event as any).title || "",
                description: (event as any).description || "",
                date: (event as any).date ? format(new Date((event as any).date), 'yyyy-MM-dd') : "",
                startTime: (event as any).startTime || "",
                endTime: (event as any).endTime || "",
                ticketPrice: (event as any).ticketPrice?.toString() || "",
                totalCapacity: (event as any).totalCapacity?.toString() || ""
            });
        }
    }, [event]);

    if (!eventId) {
        return <div className="p-4 text-red-500">No event ID provided.</div>;
    }

    if (fetching) {
        return <div className="p-4">Loading...</div>;
    }

    if (error || !event) {
        return (
            <div className="p-4 text-red-500">
                <h2 className="text-lg font-bold">Error loading event details.</h2>
                <p>Event ID: {eventId}</p>
                {error && <pre className="mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateEvent({
                id: (event as any).id,
                title: formData.title,
                description: formData.description,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                ticketPrice: parseFloat(formData.ticketPrice) || 0,
                totalCapacity: parseInt(formData.totalCapacity) || 0,
            });
            
            navigate(`/event/${eventId}`);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate(`/event/${eventId}`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Event
                </Button>
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <div className="w-20"></div> {/* Spacer for centering */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                                <Input
                                    id="ticketPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.ticketPrice}
                                    onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalCapacity">Total Capacity</Label>
                                <Input
                                    id="totalCapacity"
                                    type="number"
                                    min="1"
                                    value={formData.totalCapacity}
                                    onChange={(e) => handleInputChange('totalCapacity', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate(`/event/${eventId}`)}
                            >
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button type="submit" disabled={updatingEvent}>
                                <Save className="mr-2 h-4 w-4" />
                                {updatingEvent ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 