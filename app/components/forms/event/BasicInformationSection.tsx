import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Calendar } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const BasicInformationSection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleInputChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={eventForm.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={eventForm.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your event..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={eventForm.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live-music">Live Music</SelectItem>
              <SelectItem value="dj">DJ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">Event Type *</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Choose how you want to handle musician applications for this event
          </p>
          <RadioGroup 
            value={eventForm.eventType} 
            onValueChange={(value) => handleInputChange("eventType", value)}
            required
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="open" id="event-type-open" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="event-type-open" className="text-base font-medium cursor-pointer">
                    Open Event
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Any musician can see and apply to this event. Great for finding new talent and getting more applications.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="invited" id="event-type-invited" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="event-type-invited" className="text-base font-medium cursor-pointer">
                    Invited Event
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only musicians you specifically invite can apply. You'll be redirected to select musicians after creating the event.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}; 