import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";
import { Music } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const MusicianSettingsSection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleInputChange,
  musicians = []
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musician & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="musician">Featured Musician</Label>
          <Select value={eventForm.musicianId} onValueChange={(value) => handleInputChange("musicianId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a musician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No musician selected</SelectItem>
              {musicians.map((musician) => (
                <SelectItem key={musician.id} value={musician.id}>
                  {musician.stageName}
                  {musician.city && ` (${musician.city}, ${musician.state})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Event</Label>
              <p className="text-sm text-muted-foreground">
                Make this event visible to the public
              </p>
            </div>
            <Switch
              checked={eventForm.isPublic}
              onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Event</Label>
              <p className="text-sm text-muted-foreground">
                Event is currently active and bookable
              </p>
            </div>
            <Switch
              checked={eventForm.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 