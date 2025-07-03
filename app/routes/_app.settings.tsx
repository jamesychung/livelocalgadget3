import React, { useState, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { useVenueProfile, useMusicianProfile, useSupabaseMutation } from "../hooks/useSupabaseData";
import { supabase } from "../lib/supabase";
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
import { Link } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";

export default function SettingsPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch musician data
  const { data: musician, loading: musicianLoading } = useMusicianProfile(user?.id);

  // Fetch venue data
  const { data: venue, loading: venueLoading } = useVenueProfile(user?.id);

  // Mutation hooks
  const { mutate: updateUser, loading: updateUserLoading } = useSupabaseMutation();
  const { mutate: updateMusician, loading: updateMusicianLoading } = useSupabaseMutation();
  const { mutate: updateVenue, loading: updateVenueLoading } = useSupabaseMutation();

  // Determine user role
  const isMusician = !!musician;
  const isVenueOwner = !!venue;
  const userRole = isMusician ? 'musician' : isVenueOwner ? 'venue' : 'user';

  // Account Settings - different for each role
  const [accountSettings, setAccountSettings] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: musician?.phone || venue?.phone || '',
    // Musician-specific fields
    stageName: musician?.stage_name || '',
    hourlyRate: musician?.hourly_rate || 0,
    // Venue-specific fields
    venueName: venue?.name || '',
    venueEmail: venue?.email || '',
    venueWebsite: venue?.website || '',
    venueCapacity: venue?.capacity || 0,
    venuePriceRange: venue?.price_range || '',
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
        venuePriceRange: venue.price_range || '',
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
        stageName: musician.stage_name || '',
        hourlyRate: musician.hourly_rate || 0,
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
      await updateUser(async () => {
        return await supabase
          .from('users')
          .update({
            first_name: accountSettings.firstName,
            last_name: accountSettings.lastName,
            email: accountSettings.email,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      });

      // Update musician data if exists
      if (musician?.id) {
        await updateMusician(async () => {
          return await supabase
            .from('musicians')
            .update({
              stage_name: accountSettings.stageName,
              phone: accountSettings.phone,
              city: accountSettings.city,
              state: accountSettings.state,
              hourly_rate: accountSettings.hourlyRate,
              updated_at: new Date().toISOString()
            })
            .eq('id', musician.id);
        });
      }

      // Update venue data if exists
      if (venue?.id) {
        await updateVenue(async () => {
          return await supabase
            .from('venues')
            .update({
              name: accountSettings.venueName,
              phone: accountSettings.phone,
              email: accountSettings.venueEmail,
              website: accountSettings.venueWebsite,
              city: accountSettings.city,
              state: accountSettings.state,
              capacity: accountSettings.venueCapacity,
              price_range: accountSettings.venuePriceRange,
              updated_at: new Date().toISOString()
            })
            .eq('id', venue.id);
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
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  if (musicianLoading || venueLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
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
            <Link to="/signed-in">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userRole === 'musician' && <Music className="h-5 w-5 text-blue-500" />}
          {userRole === 'venue' && <Building className="h-5 w-5 text-green-500" />}
          <Badge variant="secondary" className="capitalize">
            {userRole}
          </Badge>
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
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
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
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
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
                          value={accountSettings.venueWebsite}
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, venueWebsite: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="venueCapacity">Capacity</Label>
                        <Input
                          id="venueCapacity"
                          type="number"
                          value={accountSettings.venueCapacity}
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, venueCapacity: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="venuePriceRange">Price Range</Label>
                        <Select
                          value={accountSettings.venuePriceRange}
                          onValueChange={(value) => setAccountSettings(prev => ({ ...prev, venuePriceRange: value }))}
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
                  onClick={handleAccountUpdate}
                  disabled={isLoading || updateUserLoading || updateMusicianLoading || updateVenueLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
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
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
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
                          checked={notificationSettings.bookingRequests}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, bookingRequests: checked }))
                          }
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
                          checked={notificationSettings.bookingConfirmations}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, bookingConfirmations: checked }))
                          }
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
                          checked={notificationSettings.newReviews}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, newReviews: checked }))
                          }
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
                          checked={notificationSettings.eventRequests}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, eventRequests: checked }))
                          }
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
                          checked={notificationSettings.eventConfirmations}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, eventConfirmations: checked }))
                          }
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
                          checked={notificationSettings.venueReviews}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, venueReviews: checked }))
                          }
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
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="mr-2 h-4 w-4" />
                    Enable
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password">Change Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sessions">Active Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Manage your active login sessions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
