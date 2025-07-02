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

import { UserIcon } from "../components/shared/UserIcon";
import { Toaster } from "../components/ui/sonner";
import { DesktopNav, MobileNav, SecondaryNavigation } from "../components/app/nav";
import { Outlet, redirect, useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import type { RootOutletContext } from "../root";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

interface LoaderParams {
  request: Request;
}

export const loader = async ({ request }: LoaderParams) => {
  // Get the current session from Supabase
  const { data: { session }, error } = await supabase.auth.getSession();

  if (!session || error) {
    return redirect("/sign-in");
  }

  // Get user data from Supabase
  const { data: user, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user.user) {
    return redirect("/sign-in");
  }

  // Fetch user profile from the users table
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
  }

  // Check if user needs to complete profile setup
  if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.user_type) {
    // Don't redirect if already on profile setup page
    const url = new URL(request.url);
    if (url.pathname !== '/profile-setup') {
      return redirect("/profile-setup");
    }
  }

  // Fetch musician profile if it exists
  let musician = undefined;
  try {
    console.log("🔍 Looking for musician profile for user ID:", user.user.id);
    
    const { data: musicianData, error: musicianError } = await supabase
      .from('musicians')
      .select('*')
      .eq('user_id', user.user.id)
      .single();
    
    if (!musicianError && musicianData) {
      musician = musicianData;
      console.log("🎵 Musician profile found:", musician.id);
      console.log("🎵 Musician stage name:", musician.stage_name);
    } else {
      console.log("🎵 No musician profile found");
    }
  } catch (error) {
    console.log("❌ Error finding musician profile:", error);
  }

  // Fetch venue profile if it exists
  let venue = undefined;
  try {
    console.log("🏢 Looking for venue profile for user ID:", user.user.id);
    
    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('user_id', user.user.id)
      .single();
    
    if (!venueError && venueData) {
      venue = venueData;
      console.log("🏢 Venue profile found:", venue.id);
      console.log("🏢 Venue name:", venue.name);
    } else {
      console.log("🏢 No venue profile found");
    }
  } catch (error) {
    console.log("❌ Error finding venue profile:", error);
  }

  return {
    user: {
      ...userProfile,
      email: user.user.email,
      musician,
      venue
    },
  };
};

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

export default function AppLayout() {
  const rootOutletContext = useOutletContext<RootOutletContext>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch user data directly
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/sign-in');
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/sign-in');
          return;
        }
        
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Create a new user record if it doesn't exist
          if (profileError.code === 'PGRST116') {
            await supabase.from('users').insert([
              { id: user.id, email: user.email }
            ]);
          }
        }
        
        // Check if profile needs to be completed
        if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.user_type) {
          if (location.pathname !== '/profile-setup') {
            navigate('/profile-setup');
            return;
          }
        }
        
        // Fetch musician profile if it exists
        let musician = undefined;
        try {
          const { data: musicianData } = await supabase
            .from('musicians')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (musicianData) {
            musician = musicianData;
          }
        } catch (error) {
          console.error('Error finding musician profile:', error);
        }
        
        // Fetch venue profile if it exists
        let venue = undefined;
        try {
          const { data: venueData } = await supabase
            .from('venues')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (venueData) {
            venue = venueData;
          }
        } catch (error) {
          console.error('Error finding venue profile:', error);
        }
        
        setUserData({
          ...userProfile,
          id: user.id,
          email: user.email,
          musician,
          venue
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/sign-in');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If still no user data after loading, redirect to sign in
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <p className="text-lg font-medium mb-4">Session expired. Please sign in again.</p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/sign-in')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  // For profile setup page, use a simpler layout
  if (location.pathname === '/profile-setup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Outlet context={{ ...rootOutletContext, user: userData } as AuthOutletContext} />
        <Toaster richColors />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <DesktopNav user={userData} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-white shadow-sm z-10 w-full">
          <MobileNav user={userData} />
          <div className="ml-auto">
            <SecondaryNavigation
              icon={
                <>
                  <UserIcon user={userData} />
                  <span className="text-sm font-medium ml-2">{userData.first_name ?? userData.email}</span>
                </>
              }
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-auto">
          <Outlet context={{ ...rootOutletContext, user: userData } as AuthOutletContext} />
          <Toaster richColors />
        </main>
      </div>
    </div>
  );
}
