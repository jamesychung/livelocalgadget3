import React, { useState, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import { useVenueProfile, useMusicianProfile } from "../hooks/useSupabaseData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { ArrowLeft, Building, Music } from "lucide-react";
import { 
  AccountSettingsTab, 
  NotificationSettingsTab, 
  SecuritySettingsTab,
  StatusMessage as StatusMessageComponent,
  AccountSettings,
  NotificationSettings,
  initializeAccountSettings,
  getDefaultNotificationSettings,
  updateUserData,
  updateMusicianData,
  updateVenueData,
  StatusMessage,
  UserRole,
  MusicianProfile,
  VenueProfile
} from "../components/settings";
import type { AuthOutletContext } from "./_app";
import { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  // Fetch musician data
  const { data: musician, loading: musicianLoading } = useMusicianProfile(user?.id);

  // Fetch venue data
  const { data: venue, loading: venueLoading } = useVenueProfile(user?.id);

  // Account settings state
  const [accountSettings, setAccountSettings] = useState<AccountSettings>(
    initializeAccountSettings(user as User, musician as MusicianProfile | null, venue as VenueProfile | null)
  );

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    getDefaultNotificationSettings()
  );

  // Determine user role
  const isMusician = !!musician;
  const isVenueOwner = !!venue;
  const userRole: UserRole = isMusician ? 'musician' : isVenueOwner ? 'venue' : 'user';

  // Update account settings when venue/musician data loads
  useEffect(() => {
    if (user && (musician || venue)) {
      setAccountSettings(initializeAccountSettings(user as User, musician as MusicianProfile | null, venue as VenueProfile | null));
    }
  }, [user, musician, venue]);

  const handleAccountUpdate = async (settings: AccountSettings) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Update user data
      await updateUserData(user.id, {
        first_name: settings.firstName,
        last_name: settings.lastName,
        email: settings.email
      });

      // Update musician data if exists
      if (musician?.id) {
        await updateMusicianData(musician.id, {
          stage_name: settings.stageName,
          phone: settings.phone,
          city: settings.city,
          state: settings.state,
          hourly_rate: settings.hourlyRate
        });
      }

      // Update venue data if exists
      if (venue?.id) {
        await updateVenueData(venue.id, {
          name: settings.venueName,
          phone: settings.phone,
          email: settings.venueEmail,
          website: settings.venueWebsite,
          city: settings.city,
          state: settings.state,
          capacity: settings.venueCapacity,
          price_range: settings.venuePriceRange
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

  const handleNotificationSettingsChange = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    // In a real app, you would save these to the database
    setMessage({ type: 'success', text: 'Notification settings updated!' });
  };

  if (!user?.id) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
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
          <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium capitalize">
            {userRole}
          </div>
        </div>
      </div>

      {/* Message Display */}
      <StatusMessageComponent message={message} />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettingsTab 
            user={user as User}
            musician={musician as MusicianProfile | null}
            venue={venue as VenueProfile | null}
            isLoading={isLoading}
            onUpdate={handleAccountUpdate}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettingsTab 
            userRole={userRole}
            settings={notificationSettings}
            onSettingsChange={handleNotificationSettingsChange}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsTab user={user as User} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
