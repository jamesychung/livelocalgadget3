import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Users, MapPin, DollarSign } from "lucide-react";
import { Musician } from "./types";

interface MusicianSelectionProps {
  filteredMusicians: Musician[];
  selectedMusicians: string[];
  handleMusicianSelection: (musicianId: string, checked: boolean) => void;
}

export const MusicianSelection: React.FC<MusicianSelectionProps> = ({
  filteredMusicians,
  selectedMusicians,
  handleMusicianSelection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Musicians ({filteredMusicians.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredMusicians.length > 0 ? (
          <div className="space-y-4">
            {filteredMusicians.map((musician) => (
              <div key={musician.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedMusicians.includes(musician.id)}
                    onCheckedChange={(checked) => 
                      handleMusicianSelection(musician.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{musician.stage_name}</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {musician.city}, {musician.state}
                        </span>
                        {musician.hourly_rate && (
                          <>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              ${musician.hourly_rate}/hr
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {musician.bio && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {musician.bio}
                      </p>
                    )}
                    {musician.genres && musician.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {musician.genres.map((genre, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No musicians found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 