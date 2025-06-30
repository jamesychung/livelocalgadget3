import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, X } from "lucide-react";

interface VenueEventDetailsCardProps {
  event: any;
  isEditing: boolean;
  editFormData: any;
  setEditFormData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  handleSaveEvent: () => void;
}

// Common music genres
const AVAILABLE_GENRES = [
  "Jazz", "Blues", "Rock", "Pop", "Country", "Folk", "Classical", "Electronic",
  "Hip Hop", "R&B", "Soul", "Funk", "Reggae", "Latin", "World Music", "Indie",
  "Alternative", "Metal", "Punk", "Gospel", "Bluegrass", "Swing", "Bossa Nova",
  "Salsa", "Merengue", "Cumbia", "Tango", "Flamenco", "Celtic", "Irish Folk",
  "Scottish Folk", "Acoustic", "Instrumental", "Vocal", "Cover Band", "Original Music"
];

export const VenueEventDetailsCard: React.FC<VenueEventDetailsCardProps> = ({
  event,
  isEditing,
  editFormData,
  setEditFormData,
  setIsEditing,
  handleSaveEvent
}) => {
  const handleGenreToggle = (genre: string) => {
    const currentGenres = editFormData?.genres || [];
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g: string) => g !== genre)
      : [...currentGenres, genre];
    
    setEditFormData({ ...editFormData, genres: updatedGenres });
  };

  const removeGenre = (genreToRemove: string) => {
    const currentGenres = editFormData?.genres || [];
    const updatedGenres = currentGenres.filter((g: string) => g !== genreToRemove);
    setEditFormData({ ...editFormData, genres: updatedGenres });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Date</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editFormData?.date || ""}
                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              />
            ) : (
              <p className="font-medium">
                {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'N/A'}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Time</Label>
            <div className="grid grid-cols-2 gap-2">
              {isEditing ? (
                <>
                  <Input
                    value={editFormData?.startTime || ""}
                    onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                    placeholder="Start Time"
                  />
                  <Input
                    value={editFormData?.endTime || ""}
                    onChange={(e) => setEditFormData({...editFormData, endTime: e.target.value})}
                    placeholder="End Time"
                  />
                </>
              ) : (
                <p className="font-medium">
                  {event?.startTime || 'N/A'} - {event?.endTime || 'N/A'}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editFormData?.totalCapacity || ""}
                onChange={(e) => setEditFormData({...editFormData, totalCapacity: e.target.value})}
                placeholder="Capacity"
              />
            ) : (
              <p className="font-medium">
                {event?.totalCapacity || 'N/A'} people
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Ticket Price</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editFormData?.ticketPrice || ""}
                onChange={(e) => setEditFormData({...editFormData, ticketPrice: e.target.value})}
                placeholder="Price"
              />
            ) : (
              <p className="font-medium">
                ${event?.ticketPrice || 'N/A'}
              </p>
            )}
          </div>
        </div>

        {/* Genres Section */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Preferred Genres</Label>
          {isEditing ? (
            <div className="space-y-3">
              {/* Selected Genres */}
              {(editFormData?.genres || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(editFormData?.genres || []).map((genre: string) => (
                    <Badge 
                      key={genre} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Genre Selection */}
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`text-left px-2 py-1 rounded text-sm transition-colors ${
                        (editFormData?.genres || []).includes(genre)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Select genres that match the type of music you want for your event
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {(event?.genres || []).length > 0 ? (
                (event.genres || []).map((genre: string) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No genres specified</p>
              )}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
          {isEditing ? (
            <textarea
              value={editFormData?.description || ""}
              onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              className="w-full border rounded p-2 min-h-[80px]"
              placeholder="Event description"
            />
          ) : (
            <p className="text-sm">{event?.description || 'No description'}</p>
          )}
        </div>
        
        {/* Edit Event Button - positioned at bottom right */}
        <div className="flex justify-end pt-4 border-t">
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 