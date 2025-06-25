import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function () {
  const { gadgetConfig, user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [isCheckingProfiles, setIsCheckingProfiles] = useState(true);

  // Check if user has musician or venue profiles
  const [{ data: musicianData }] = useFindMany(api.musician, {
    filter: { user: { id: { equals: user?.id } } },
    first: 1,
    pause: !user?.id,
  });

  const [{ data: venueData }] = useFindMany(api.venue, {
    filter: { owner: { id: { equals: user?.id } } },
    first: 1,
    pause: !user?.id,
  });

  useEffect(() => {
    if (user && musicianData !== undefined && venueData !== undefined) {
      setIsCheckingProfiles(false);
      
      // Simple profile-based routing
      if (musicianData && musicianData.length > 0) {
        navigate('/musician-dashboard');
      } else if (venueData && venueData.length > 0) {
        navigate('/venue-dashboard');
      }
      // If no profiles, stay on this page for profile setup
    }
  }, [user, musicianData, venueData, navigate]);

  // Show loading while checking profiles
  if (isCheckingProfiles) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Setting up your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <div>
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between p-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Welcome to LiveLocal!</h2>
                <div className="space-y-2">
                  <p className="text-base">Choose your profile type to get started.</p>
                </div>
                <div className="flex gap-4">
                  <Button asChild>
                    <a href="/musician-profile/edit">
                      <Pencil className="mr-2 h-4 w-4" />
                      Create Musician Profile
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/venue-profile/edit">
                      <Pencil className="mr-2 h-4 w-4" />
                      Create Venue Profile
                    </a>
                  </Button>
                </div>
              </div>
              <img
                src="https://assets.gadget.dev/assets/default-app-assets/react-logo.svg"
                className="app-logo h-24 w-24 animate-spin"
                style={{ animationDuration: "10s" }}
                alt="logo"
              />
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Current user</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                <dd className="text-base">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-base">{`${user.firstName} ${user.lastName}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-base">
                  <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                    {user.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-base">{user.createdAt.toLocaleString("en-US", { timeZone: "UTC" })} (in UTC)</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Roles</dt>
                <dd className="text-base">
                  {Array.isArray(user.roles) 
                    ? user.roles.map((role: unknown) => typeof role === 'string' ? role : 
                        (role as any)?.name || (role as any)?.key || String(role)).join(', ')
                    : 'No roles'}
                </dd>
              </div>
            </dl>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a profile to access your dashboard and start using the platform.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}