import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Building,
  Music
} from "lucide-react";
import { Link } from "react-router";
import type { AuthOutletContext } from "./_app";

export default function SettingsPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch musician data
  const [{ data: musicianData }] = useFindMany(api.musician, {
    filter: { user: { id: { equals: user?.id } } },
    select: { 
      id: true, 
      stageName: true, 
      phone: true,
      city: true,
      state: true,
      hourlyRate: true,
    },
    first: 1,
    pause: !user?.id,
  });

  // Fetch venue data
  const [{ data: venueData }] = useFindMany(api.venue, {
    filter: { owner: { id: { equals: user?.id } } },
    select: { 
      id: true, 
      name: true, 
      phone: true,
      city: true,
      state: true,
      email: true,
      website: true,
      capacity: true,
      priceRange: true,
    },
    first: 1,
    pause: !user?.id,
  });

  const musician = musicianData?.[0] as any;
  const venue = venueData?.[0] as any;

  // Determine user role
  const isMusician = !!musician;
  const isVenueOwner = !!venue;
  const userRole = isMusician ? 'musician' : isVenueOwner ? 'venue' : 'user';

  // Actions
  const [updateUserResult, updateUser] = useAction(api.user.update, {
    pause: !user?.id,
  });
  const [updateMusicianResult, updateMusician] = useAction(api.musician.update, {
    pause: !user?.id,
  });
  const [updateVenueResult, updateVenue] = useAction(api.venue.update, {
    pause: !user?.id,
  });

  // Account Settings - different for each role
  const [accountSettings, setAccountSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: musician?.phone || venue?.phone || '',
    // Musician-specific fields
    stageName: musician?.stageName || '',
    hourlyRate: musician?.hourlyRate || 0,
    // Venue-specific fields
    venueName: venue?.name || '',
    venueEmail: venue?.email || '',
    venueWebsite: venue?.website || '',
    venueCapacity: venue?.capacity || 0,
    venuePriceRange: venue?.priceRange || '',
    // Common fields
    city: musician?.city || venue?.city || '',
    state: musician?.state || venue?.state || '',
  });

  // Update account settings when venue/musician data loads
  useEffect(() => {
    if (venue) {
      setAccountSettings(prev => ({
        ...prev,
        venueName: venue.name || '',
        venueEmail: venue.email || '',
        venueWebsite: venue.website || '',
        venueCapacity: venue.capacity || 0,
        venuePriceRange: venue.priceRange || '',
        phone: venue.phone || prev.phone,
        city: venue.city || prev.city,
        state: venue.state || prev.state,
      }));
    }
  }, [venue]);

  useEffect(() => {
    if (musician) {
      setAccountSettings(prev => ({
        ...prev,
        stageName: musician.stageName || '',
        hourlyRate: musician.hourlyRate || 0,
        phone: musician.phone || prev.phone,
        city: musician.city || prev.city,
        state: musician.state || prev.state,
      }));
    }
  }, [musician]);

  // Notification Settings - different for each role
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    // Musician-specific
    bookingRequests: true,
    bookingConfirmations: true,
    newReviews: true,
    // Venue-specific
    eventRequests: true,
    eventConfirmations: true,
    venueReviews: true,
    // Common
    marketingEmails: false,
  });

  const handleAccountUpdate = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Update user data
      await updateUser({
        id: user.id,
        firstName: accountSettings.firstName,
        lastName: accountSettings.lastName,
        email: accountSettings.email,
      });

      // Update musician data if exists
      if (musician?.id) {
        await updateMusician({
          id: musician.id,
          stageName: accountSettings.stageName,
          phone: accountSettings.phone,
          city: accountSettings.city,
          state: accountSettings.state,
          hourlyRate: accountSettings.hourlyRate,
        });
      }

      // Update venue data if exists
      if (venue?.id) {
        await updateVenue({
          id: venue.id,
          name: accountSettings.venueName,
          phone: accountSettings.phone,
          email: accountSettings.venueEmail,
          website: accountSettings.venueWebsite,
          city: accountSettings.city,
          state: accountSettings.state,
          capacity: accountSettings.venueCapacity,
          priceRange: accountSettings.venuePriceRange,
        });
      }

      setMessage({ type: 'success', text: 'Account settings updated successfully!' });
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage({ type: 'error', text: 'Failed to update account settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to={isMusician ? "/musician-dashboard" : isVenueOwner ? "/venue-dashboard" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your {userRole === 'musician' ? 'musician' : userRole === 'venue' ? 'venue' : 'account'} settings, notifications, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={accountSettings.firstName}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={accountSettings.lastName}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={accountSettings.phone}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={accountSettings.city}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={accountSettings.state}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>

                {/* Musician-specific fields */}
                {isMusician && (
                  <>
                    <div>
                      <Label htmlFor="stageName">Stage Name</Label>
                      <Input
                        id="stageName"
                        value={accountSettings.stageName}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, stageName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={accountSettings.hourlyRate}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </>
                )}

                {/* Venue-specific fields */}
                {isVenueOwner && (
                  <>
                    <div>
                      <Label htmlFor="venueName">Venue Name</Label>
                      <Input
                        id="venueName"
                        value={accountSettings.venueName}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, venueName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venueEmail">Venue Email</Label>
                      <Input
                        id="venueEmail"
                        type="email"
                        value={accountSettings.venueEmail}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, venueEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venueWebsite">Website</Label>
                      <Input
                        id="venueWebsite"
                        type="url"
                        value={accountSettings.venueWebsite}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, venueWebsite: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venueCapacity">Capacity</Label>
                      <Input
                        id="venueCapacity"
                        type="number"
                        value={accountSettings.venueCapacity}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, venueCapacity: parseInt(e.target.value) || 0 }))}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venuePriceRange">Price Range</Label>
                      <Select value={accountSettings.venuePriceRange} onValueChange={(value) => setAccountSettings(prev => ({ ...prev, venuePriceRange: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$">$ (Under $25)</SelectItem>
                          <SelectItem value="$$">$$ ($25-$50)</SelectItem>
                          <SelectItem value="$$$">$$$ ($50-$100)</SelectItem>
                          <SelectItem value="$$$$">$$$$ (Over $100)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <Button onClick={handleAccountUpdate} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" onClick={() => setMessage({ type: 'success', text: 'Password change feature coming soon!' })}>
                  Change Password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <Separator />

                {/* Musician-specific notifications */}
                {isMusician && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Requests</h4>
                        <p className="text-sm text-muted-foreground">When venues request your services</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.bookingRequests}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, bookingRequests: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Confirmations</h4>
                        <p className="text-sm text-muted-foreground">When bookings are confirmed</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.bookingConfirmations}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, bookingConfirmations: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Reviews</h4>
                        <p className="text-sm text-muted-foreground">When you receive new reviews</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.newReviews}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, newReviews: checked }))}
                      />
                    </div>
                  </>
                )}

                {/* Venue-specific notifications */}
                {isVenueOwner && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Event Requests</h4>
                        <p className="text-sm text-muted-foreground">When musicians request to play at your venue</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.eventRequests}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, eventRequests: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Event Confirmations</h4>
                        <p className="text-sm text-muted-foreground">When events are confirmed</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.eventConfirmations}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, eventConfirmations: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Venue Reviews</h4>
                        <p className="text-sm text-muted-foreground">When you receive new venue reviews</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.venueReviews}
                        onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, venueReviews: checked }))}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Promotional content and updates</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>
              </div>
              <Button onClick={() => setMessage({ type: 'success', text: 'Notification settings saved!' })}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Visibility
              </CardTitle>
              <CardDescription>
                Control who can see your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Contact Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {isMusician ? 'Display your email and phone to venues' : isVenueOwner ? 'Display your email and phone to musicians' : 'Display your contact information'}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Musician-specific privacy settings */}
                {isMusician && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Availability</h4>
                        <p className="text-sm text-muted-foreground">Display your availability calendar</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Pricing</h4>
                        <p className="text-sm text-muted-foreground">Display your hourly rate</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow Direct Messages</h4>
                        <p className="text-sm text-muted-foreground">Let venues message you directly</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show in Search Results</h4>
                        <p className="text-sm text-muted-foreground">Appear in venue searches</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}

                {/* Venue-specific privacy settings */}
                {isVenueOwner && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Venue Details</h4>
                        <p className="text-sm text-muted-foreground">Display venue capacity and amenities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Pricing</h4>
                        <p className="text-sm text-muted-foreground">Display your price range</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow Event Requests</h4>
                        <p className="text-sm text-muted-foreground">Let musicians request to play at your venue</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show in Search Results</h4>
                        <p className="text-sm text-muted-foreground">Appear in musician searches</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </>
                )}
              </div>
              <Button onClick={() => setMessage({ type: 'success', text: 'Privacy settings saved!' })}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 