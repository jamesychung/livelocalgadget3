import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Music } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const GenresSection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleGenreChange,
  availableGenres = []
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Genres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Select the genres that best describe this event
        </p>
        <div className="grid grid-cols-3 gap-2 border rounded-md p-3">
          {availableGenres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={eventForm.genres.includes(genre)}
                onCheckedChange={(checked) => handleGenreChange && handleGenreChange(genre, checked as boolean)}
              />
              <Label 
                htmlFor={`genre-${genre}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 