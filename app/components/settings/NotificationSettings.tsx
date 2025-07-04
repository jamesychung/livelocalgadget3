import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Bell } from "lucide-react";
import { NotificationSettings, NotificationSettingsProps } from "./types";

export const NotificationSettingsTab: React.FC<NotificationSettingsProps> = ({
  userRole,
  settings,
  onSettingsChange
}) => {
  const isMusician = userRole === 'musician';
  const isVenueOwner = userRole === 'venue';

  const handleSwitchChange = (key: keyof NotificationSettings) => (checked: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: checked
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to be notified about important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={handleSwitchChange('emailNotifications')}
            />
          </div>

          {isMusician && (
            <>
              <Separator />
              <h3 className="text-lg font-medium">Musician Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingRequests">Booking Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      When venues request your services
                    </p>
                  </div>
                  <Switch
                    id="bookingRequests"
                    checked={settings.bookingRequests}
                    onCheckedChange={handleSwitchChange('bookingRequests')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingConfirmations">Booking Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      When bookings are confirmed or cancelled
                    </p>
                  </div>
                  <Switch
                    id="bookingConfirmations"
                    checked={settings.bookingConfirmations}
                    onCheckedChange={handleSwitchChange('bookingConfirmations')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newReviews">New Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      When you receive new reviews
                    </p>
                  </div>
                  <Switch
                    id="newReviews"
                    checked={settings.newReviews}
                    onCheckedChange={handleSwitchChange('newReviews')}
                  />
                </div>
              </div>
            </>
          )}

          {isVenueOwner && (
            <>
              <Separator />
              <h3 className="text-lg font-medium">Venue Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="eventRequests">Event Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      When musicians apply for your events
                    </p>
                  </div>
                  <Switch
                    id="eventRequests"
                    checked={settings.eventRequests}
                    onCheckedChange={handleSwitchChange('eventRequests')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="eventConfirmations">Event Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      When events are confirmed or cancelled
                    </p>
                  </div>
                  <Switch
                    id="eventConfirmations"
                    checked={settings.eventConfirmations}
                    onCheckedChange={handleSwitchChange('eventConfirmations')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="venueReviews">Venue Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      When you receive new reviews
                    </p>
                  </div>
                  <Switch
                    id="venueReviews"
                    checked={settings.venueReviews}
                    onCheckedChange={handleSwitchChange('venueReviews')}
                  />
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional content and updates
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={handleSwitchChange('marketingEmails')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 