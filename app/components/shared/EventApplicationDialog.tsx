import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Users, MessageSquare, Send } from "lucide-react";
import { Event, Musician } from "../../hooks/useMusicianEvents";

interface EventApplicationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedEvent: Event | null;
    matchingMusicians: Musician[];
    onApply: () => void;
    onNotInterested: () => void;
    onMessageVenue: () => void;
    getMusicianApplicationStatus: (eventId: string) => string;
}

export function EventApplicationDialog({
    isOpen,
    onOpenChange,
    selectedEvent,
    matchingMusicians,
    onApply,
    onNotInterested,
    onMessageVenue,
    getMusicianApplicationStatus
}: EventApplicationDialogProps) {
    if (!selectedEvent) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {selectedEvent.title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Event Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Date:</span> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'TBD'}</div>
                                <div><span className="font-medium">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</div>
                                <div><span className="font-medium">Rate:</span> {selectedEvent.rate ? `$${selectedEvent.rate}` : 'TBD'}</div>
                                <div><span className="font-medium">Status:</span> {selectedEvent.eventStatus}</div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Venue Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Name:</span> {selectedEvent.venue?.name}</div>
                                <div><span className="font-medium">Location:</span> {selectedEvent.venue?.city && selectedEvent.venue?.state ? `${selectedEvent.venue.city}, ${selectedEvent.venue.state}` : 'Not specified'}</div>
                                <div><span className="font-medium">Type:</span> {selectedEvent.venue?.type || 'Not specified'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {selectedEvent.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                        </div>
                    )}

                    {/* Genres */}
                    {selectedEvent.genres && selectedEvent.genres.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-1">
                                {selectedEvent.genres.map((genre: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Matching Musicians */}
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Matching Musicians ({matchingMusicians.length})
                        </h3>
                        
                        {matchingMusicians.length > 0 ? (
                            <div className="grid gap-3 max-h-60 overflow-y-auto">
                                {matchingMusicians.map((musician) => (
                                    <div key={musician.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h5 className="font-medium">{musician.stageName}</h5>
                                                {musician.hourlyRate && (
                                                    <Badge variant="outline" className="text-green-600 border-green-300">
                                                        ${musician.hourlyRate}/hr
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                                <div>
                                                    <span className="font-medium">Location:</span> {musician.city && musician.state ? `${musician.city}, ${musician.state}` : 'Not specified'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Contact:</span> {musician.email}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Genres:</span> {musician.genres?.join(", ") || "None specified"}
                                                </div>
                                            </div>
                                            
                                            {musician.bio && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    <span className="font-medium">Bio:</span> {musician.bio}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No matching musicians found for this event.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={onNotInterested}>
                            Not Interested
                        </Button>
                        <Button variant="outline" onClick={onMessageVenue}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Venue
                        </Button>
                        <Button 
                            onClick={onApply}
                            disabled={getMusicianApplicationStatus(selectedEvent.id) !== "available"}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Apply for Event
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
} 
