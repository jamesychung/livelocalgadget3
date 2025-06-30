import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface VenueEventDetailsCardProps {
  event: any;
  isEditing: boolean;
  editFormData: any;
  setEditFormData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  handleSaveEvent: () => void;
}

export const VenueEventDetailsCard: React.FC<VenueEventDetailsCardProps> = ({
  event,
  isEditing,
  editFormData,
  setEditFormData,
  setIsEditing,
  handleSaveEvent
}) => {
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