import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { User, Building, Music } from "lucide-react";
import { AccountSettings, AccountSettingsProps } from "./types";

export const AccountSettingsTab: React.FC<AccountSettingsProps> = ({
  user,
  musician,
  venue,
  isLoading,
  onUpdate
}) => {
  const [settings, setSettings] = useState<AccountSettings>({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: musician?.phone || venue?.phone || '',
    city: musician?.city || venue?.city || '',
    state: musician?.state || venue?.state || '',
    // Musician-specific fields
    stageName: musician?.stage_name || '',
    hourlyRate: musician?.hourly_rate || 0,
    // Venue-specific fields
    venueName: venue?.name || '',
    venueEmail: venue?.email || '',
    venueWebsite: venue?.website || '',
    venueCapacity: venue?.capacity || 0,
    venuePriceRange: venue?.price_range || '',
  });

  // Update form when props change
  useEffect(() => {
    setSettings({
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: musician?.phone || venue?.phone || '',
      city: musician?.city || venue?.city || '',
      state: musician?.state || venue?.state || '',
      // Musician-specific fields
      stageName: musician?.stage_name || '',
      hourlyRate: musician?.hourly_rate || 0,
      // Venue-specific fields
      venueName: venue?.name || '',
      venueEmail: venue?.email || '',
      venueWebsite: venue?.website || '',
      venueCapacity: venue?.capacity || 0,
      venuePriceRange: venue?.price_range || '',
    });
  }, [user, musician, venue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(settings);
  };

  const isMusician = !!musician;
  const isVenueOwner = !!venue;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={settings.state}
                onChange={(e) => setSettings(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
          </div>

          {/* Musician-specific fields */}
          {isMusician && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Musician Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stageName">Stage Name</Label>
                    <Input
                      id="stageName"
                      value={settings.stageName}
                      onChange={(e) => setSettings(prev => ({ ...prev, stageName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={settings.hourlyRate}
                      onChange={(e) => setSettings(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Venue-specific fields */}
          {isVenueOwner && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Venue Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="venueName">Venue Name</Label>
                    <Input
                      id="venueName"
                      value={settings.venueName}
                      onChange={(e) => setSettings(prev => ({ ...prev, venueName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venueEmail">Venue Email</Label>
                    <Input
                      id="venueEmail"
                      type="email"
                      value={settings.venueEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, venueEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venueWebsite">Website</Label>
                    <Input
                      id="venueWebsite"
                      value={settings.venueWebsite}
                      onChange={(e) => setSettings(prev => ({ ...prev, venueWebsite: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venueCapacity">Capacity</Label>
                    <Input
                      id="venueCapacity"
                      type="number"
                      value={settings.venueCapacity}
                      onChange={(e) => setSettings(prev => ({ ...prev, venueCapacity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venuePriceRange">Price Range</Label>
                    <Select
                      value={settings.venuePriceRange}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, venuePriceRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ (Under $50)</SelectItem>
                        <SelectItem value="$$">$$ ($50-$100)</SelectItem>
                        <SelectItem value="$$$">$$$ ($100-$200)</SelectItem>
                        <SelectItem value="$$$$">$$$$ (Over $200)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};