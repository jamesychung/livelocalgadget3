import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, ExternalLink } from "lucide-react";

interface VenueInfoCardProps {
  venue: any;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ venue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Venue Name</span>
          <p className="font-medium">{venue?.name || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Address</span>
          <p className="text-sm">
            {venue?.address || 'N/A'}<br />
            {venue?.city || 'N/A'}, {venue?.state || 'N/A'} {venue?.zipCode || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{venue?.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{venue?.email || 'N/A'}</span>
        </div>
        {venue?.website && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a 
              href={venue.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {venue.website}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 