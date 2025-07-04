import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
import { Music, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { OverviewTabProps } from './types';
import { getStatusBadge } from './utils';

export const OverviewTab: React.FC<OverviewTabProps> = ({
  musician,
  upcomingEvents
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your next scheduled performances</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{booking.event?.title || "Untitled Event"}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.event?.venue?.name} • {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming bookings scheduled.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
          <CardDescription>Your musician profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Genres: {musician.genres?.join(', ') || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Location: {[musician.city, musician.state].filter(Boolean).join(', ') || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Contact: {musician.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Email: {musician.email}</span>
            </div>
            {musician.website && (
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={musician.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 