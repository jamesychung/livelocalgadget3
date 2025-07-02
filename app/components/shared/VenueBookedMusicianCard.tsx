import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Phone, Mail, MapPin, Music } from "lucide-react";

interface VenueBookedMusicianCardProps {
  musician: any;
}

export const VenueBookedMusicianCard: React.FC<VenueBookedMusicianCardProps> = ({ musician }) => {
  if (!musician) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Musician</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {musician.profilePicture ? (
              <img 
                src={musician.profilePicture} 
                alt={musician.stageName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <Music className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{musician.stageName}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {musician.genre && (
                <div className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  <span>{musician.genre}</span>
                </div>
              )}
              {musician.city && musician.state && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{musician.city}, {musician.state}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              {musician.phone && (
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{musician.phone}</span>
                </div>
              )}
              {musician.email && (
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{musician.email}</span>
                </div>
              )}
            </div>
            
            {musician.hourlyRate && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-sm">
                  ${musician.hourlyRate}/hour
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
