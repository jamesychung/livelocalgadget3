import React from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Music } from "lucide-react";
import { Event } from "./types";

interface EventTitleCardProps {
  event: Event;
  isEditing: boolean;
  editFormData: any;
  setEditFormData: (data: any) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getEventStatus: () => string;
}

export const EventTitleCard: React.FC<EventTitleCardProps> = ({
  event,
  isEditing,
  editFormData,
  setEditFormData,
  getStatusBadge,
  getEventStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {isEditing ? (
              <Input
                value={editFormData?.title || ""}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                className="text-2xl font-bold border-0 p-0 h-auto"
                placeholder="Event Title"
              />
            ) : (
              <CardTitle className="text-2xl">{event.title}</CardTitle>
            )}
            <p className="text-muted-foreground mt-2">
              {event.venue?.name} • {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(getEventStatus())}
            {event.musician && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Music className="mr-1 h-3 w-3" />
                Musician Booked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}; 