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
import { Outlet, redirect, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";
import type { Route } from "./+types/_app";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { session, gadgetConfig } = context;

  const userId = session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  if (!user) {
    return redirect(gadgetConfig.authentication!.signInPath);
  }

  // Fetch musician profile if it exists
  let musician = undefined;
  try {
    console.log("🔍 Looking for musician profile for user ID:", userId);
    
    // Use findMany with filter and take the first result
    const musicianRecords = await context.api.musician.findMany({
      filter: { userId: { equals: userId } },
      first: 1
    });
    
    let musicianRecord = musicianRecords[0];
    
    if (!musicianRecord) {
      console.log("🎵 Trying alternative query...");
      // Try using the user relationship
      const musicianRecords2 = await context.api.musician.findMany({
        filter: { user: { id: { equals: userId } } },
        first: 1
      });
      musicianRecord = musicianRecords2[0];
    }
    
    if (!musicianRecord) {
      console.log("🎵 Trying to find by email...");
      // Try finding by email as a fallback
      const userEmail = user.email;
      const musicianRecords3 = await context.api.musician.findMany({
        filter: { email: { equals: userEmail } },
        first: 1
      });
      musicianRecord = musicianRecords3[0];
    }
    
    musician = musicianRecord || undefined;
    console.log("🎵 Musician profile found:", musician ? musician.id : "None");
    if (musician) {
      console.log("🎵 Musician stage name:", musician.stageName);
    }
  } catch (error) {
    console.log("❌ Error finding musician profile:", error);
  }

  return {
    user: {
      ...user,
      musician
    },
  };
};

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

export default function ({ loaderData }: Route.ComponentProps) {
  const rootOutletContext = useOutletContext<RootOutletContext>();

  const { user } = loaderData;

  return (
    <div className="h-screen flex overflow-hidden">
      <DesktopNav user={user} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background z-10 w-full">
          <MobileNav user={user} />
          <div className="ml-auto">
            <SecondaryNavigation
              icon={
                <>
                  <UserIcon user={user} />
                  <span className="text-sm font-medium">{user.firstName ?? user.email}</span>
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