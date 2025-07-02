import React, { useState } from "react";
import { api } from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function TestBookingPage() {
    const [eventId, setEventId] = useState("6");
    const [musicianId, setMusicianId] = useState("12");
    const [venueId, setVenueId] = useState("9");
    const [bookedById, setBookedById] = useState("1");
    const [status, setStatus] = useState("applied");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setResult(null);

        try {
            console.log("Testing booking creation with Gadget's built-in functionality...");
            
            // Debug: see what's available on the booking model
            console.log("api.booking:", api.booking);
            console.log("api.booking methods:", Object.getOwnPropertyNames(api.booking));
            
            const payload = {
                event: { _link: eventId },
                musician: { _link: musicianId },
                venue: { _link: venueId },
                bookedBy: { _link: bookedById },
                status: status,
                date: "2025-06-01T00:00:00.000-07:00",
                depositAmount: 123,
                depositPaid: true,
                endTime: "example value for endTime",
            };

            console.log("Payload:", payload);

            // Try direct API call
            if (typeof api.booking.create === 'function') {
                const bookingResult = await api.booking.create(payload);
                console.log("Success:", bookingResult);
                setResult(bookingResult);
            } else {
                setError("api.booking.create is still not available. The client may need more time to regenerate.");
            }
            
        } catch (err: any) {
            console.error("Error:", err);
            setError(err?.message || "Unknown error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Test Booking Creation</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="eventId">Event ID</Label>
                            <Input
                                id="eventId"
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                placeholder="Event ID"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="musicianId">Musician ID</Label>
                            <Input
                                id="musicianId"
                                value={musicianId}
                                onChange={(e) => setMusicianId(e.target.value)}
                                placeholder="Musician ID"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="venueId">Venue ID</Label>
                            <Input
                                id="venueId"
                                value={venueId}
                                onChange={(e) => setVenueId(e.target.value)}
                                placeholder="Venue ID"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="bookedById">Booked By ID</Label>
                            <Input
                                id="bookedById"
                                value={bookedById}
                                onChange={(e) => setBookedById(e.target.value)}
                                placeholder="Booked By ID"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="applied">Applied</SelectItem>
                                    <SelectItem value="invited">Invited</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="declined">Declined</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Creating..." : "Create Booking"}
                        </Button>
                    </form>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    {result && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            <strong>Success!</strong>
                            <pre className="mt-2 text-sm overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 
