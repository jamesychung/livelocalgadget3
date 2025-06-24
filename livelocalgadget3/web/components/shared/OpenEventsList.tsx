import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, DollarSign, Music, Users, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface OpenEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  genres: string[];
  budgetRange: { min: number; max: number };
  locationRequirements: string;
  interestDeadline: string;
  venue: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  equipment: Array<{
    item: string;
    venueProvides: boolean;
    musicianProvides: boolean;
    notes: string;
  }>;
}

interface OpenEventsListProps {
  events: OpenEvent[];
  onSubmitInterest: (eventId: string, interestData: {
    proposedRate: number;
    equipmentProvided: string[];
    pitch: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function OpenEventsList({ events, onSubmitInterest, isLoading = false }: OpenEventsListProps) {
  const [filters, setFilters] = useState({
    genre: "",
    budgetMin: "",
    budgetMax: "",
    location: ""
  });
  
  const [selectedEvent, setSelectedEvent] = useState<OpenEvent | null>(null);
  const [interestForm, setInterestForm] = useState({
    proposedRate: "",
    equipmentProvided: [] as string[],
    pitch: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available genres for filtering
  const availableGenres = [
    "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip Hop", 
    "R&B", "Classical", "Reggae", "Latin", "World Music", "Alternative", "Indie",
    "Metal", "Punk", "Soul", "Funk", "Gospel", "Bluegrass", "EDM", "House", "Techno"
  ];

  // Filter events based on criteria
  const filteredEvents = events.filter(event => {
    if (filters.genre && !event.genres.includes(filters.genre)) return false;
    if (filters.budgetMin && event.budgetRange.max < parseInt(filters.budgetMin)) return false;
    if (filters.budgetMax && event.budgetRange.min > parseInt(filters.budgetMax)) return false;
    if (filters.location && !event.venue.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const handleSubmitInterest = async () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitInterest(selectedEvent.id, {
        proposedRate: parseFloat(interestForm.proposedRate),
        equipmentProvided: interestForm.equipmentProvided,
        pitch: interestForm.pitch
      });
      
      // Reset form
      setInterestForm({
        proposedRate: "",
        equipmentProvided: [],
        pitch: ""
      });
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error submitting interest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), "MMM dd, yyyy 'at' h:mm a");
  };

  const formatDeadline = (deadline: string) => {
    return format(new Date(deadline), "MMM dd, yyyy");
  };

  const getMatchPercentage = (event: OpenEvent) => {
    // Simple matching algorithm - can be enhanced later
    let score = 0;
    // Add more sophisticated matching logic here
    return Math.min(score, 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Open Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="genre-filter">Genre</Label>
              <Select value={filters.genre} onValueChange={(value) => setFilters({...filters, genre: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All genres</SelectItem>
                  {availableGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget-min">Min Budget</Label>
              <Input
                id="budget-min"
                type="number"
                placeholder="Min $"
                value={filters.budgetMin}
                onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="budget-max">Max Budget</Label>
              <Input
                id="budget-max"
                type="number"
                placeholder="Max $"
                value={filters.budgetMax}
                onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="location-filter">Location</Label>
              <Input
                id="location-filter"
                placeholder="City or state"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No open events found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge variant="secondary">Match: {getMatchPercentage(event)}%</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateTime(event.date, event.startTime)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.venue.name}, {event.venue.city}, {event.venue.state}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          ${event.budgetRange.min} - ${event.budgetRange.max}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Deadline: {formatDeadline(event.interestDeadline)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.genres.map((genre) => (
                        <Badge key={genre} variant="outline">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedEvent(event)}
                        className="ml-4"
                      >
                        Submit Interest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit Interest - {event.title}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="proposed-rate">Your Proposed Rate ($)</Label>
                          <Input
                            id="proposed-rate"
                            type="number"
                            min={event.budgetRange.min}
                            max={event.budgetRange.max}
                            value={interestForm.proposedRate}
                            onChange={(e) => setInterestForm({...interestForm, proposedRate: e.target.value})}
                            placeholder="Enter your rate"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Budget range: ${event.budgetRange.min} - ${event.budgetRange.max}
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="equipment">Equipment You Can Provide</Label>
                          <div className="space-y-2 mt-2">
                            {event.equipment.filter(eq => !eq.venueProvides).map((equipment, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`equipment-${index}`}
                                  checked={interestForm.equipmentProvided.includes(equipment.item)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setInterestForm({
                                        ...interestForm,
                                        equipmentProvided: [...interestForm.equipmentProvided, equipment.item]
                                      });
                                    } else {
                                      setInterestForm({
                                        ...interestForm,
                                        equipmentProvided: interestForm.equipmentProvided.filter(item => item !== equipment.item)
                                      });
                                    }
                                  }}
                                />
                                <label htmlFor={`equipment-${index}`} className="text-sm">
                                  {equipment.item}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="pitch">Why You're a Great Fit</Label>
                          <Textarea
                            id="pitch"
                            value={interestForm.pitch}
                            onChange={(e) => setInterestForm({...interestForm, pitch: e.target.value})}
                            placeholder="Tell the venue why you'd be perfect for this event..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedEvent(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitInterest}
                            disabled={isSubmitting || !interestForm.proposedRate || !interestForm.pitch}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Interest"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 