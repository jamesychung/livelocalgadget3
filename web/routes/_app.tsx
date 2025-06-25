// --------------------------------------------------------------------------------------
// App Layout (Logged In Pages)
// --------------------------------------------------------------------------------------
// This file defines the layout for all application routes that require the user to be authenticated (logged in).
// Typical pages using this layout include dashboards, user profile, app content, and any protected resources.
// Structure:
//   - Persistent navigation sidebar (with responsive drawer for mobile)
//   - Header with user avatar and secondary navigation
//   - Main content area for app routes (via <Outlet />)
//   - Handles redirecting logged out users to the sign-in page
// To extend: update the navigation, header, or main content area as needed for your app's logged-in experience.

import { UserIcon } from "@/components/shared/UserIcon";
import { Toaster } from "@/components/ui/sonner";
import { DesktopNav, MobileNav, SecondaryNavigation } from "@/components/app/nav";
import { Outlet, useOutletContext, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useUser } from "@gadgetinc/react";
import type { RootOutletContext } from "../root";

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

export default function () {
  const rootOutletContext = useOutletContext<RootOutletContext>();
  const user = useUser();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication check client-side
  useEffect(() => {
    if (isClient && !user) {
      // Redirect to sign-in if not authenticated
      navigate('/sign-in');
    }
  }, [isClient, user, navigate]);

  // Show loading state during SSR or while checking authentication
  if (!isClient || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <DesktopNav user={user} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background z-10 w-full">
          <MobileNav user={user} />
          <div className="ml-auto">
            <SecondaryNavigation
              user={user}
              icon={
                <>
                  <UserIcon user={user as any} />
                  <span className="text-sm font-medium">{(user as any).firstName ?? (user as any).email}</span>
                </>
              }
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-auto">
          <div className="container mx-auto px-6 py-8 min-w-max">
            <Outlet context={{ ...rootOutletContext, user } as AuthOutletContext} />
            <Toaster richColors />
          </div>
        </main>
      </div>
    </div>
  );
}