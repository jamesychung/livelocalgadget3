// --------------------------------------------------------------------------------------
// App Navigation System (Primary Left Nav + Secondary Header Dropdown)
// --------------------------------------------------------------------------------------
// This file defines the navigation system for the logged-in section of the app.
// There are two main navigation components:
//
//   - Navigation: The primary navigation, rendered as a vertical sidebar on the left.
//     - To extend: add new items to the `navigationItems` array.
//     - Each item should have a title, path, and icon.
//
//   - SecondaryNavigation: The secondary navigation, rendered as a dropdown menu in the header.
//     - To extend: add new items to the `secondaryNavigationItems` array.
//     - Each item should have a title, path, and icon.
//     - The dropdown also includes a "Sign out" action.
//
// Icons are imported from lucide-react. Navigation uses react-router's <Link> for routing.
//
// --------------------------------------------------------------------------------------
// To extend: add to navigationItems or secondaryNavigationItems. For custom rendering,
// edit the Navigation or SecondaryNavigation components.
// --------------------------------------------------------------------------------------

import type { ExoticComponent, ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { supabase } from "../../lib/supabase";
import { NavDrawer } from "../shared/NavDrawer";
import { Home, User, LogOut, Calendar, Music, Settings, Clock, Star, Users, History, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotificationBadge } from "../shared/NotificationBadge";
import { useMessaging } from "../../hooks/useMessaging";
import type { AuthOutletContext } from "../../routes/_app";

interface NavItem {
  title: string;
  path: string;
  icon: ExoticComponent<{ className: string }>;
  roles?: string[];
}

/**
 * The main navigation items for the left sidebar.
 * To add a new link, add an object with title, path, and icon.
 */

const navigationItems: NavItem[] = [
  {
    title: "Musician Dashboard",
    path: "/musician-dashboard",
    icon: Music,
    roles: ["musician"],
  },
  {
    title: "Available Events",
    path: "/musician-availEvents",
    icon: Star,
    roles: ["musician"],
  },
  {
    title: "Availability",
    path: "/availability",
    icon: Clock,
    roles: ["musician"],
  },
  {
    title: "Messages",
    path: "/musician-messages",
    icon: MessageCircle,
    roles: ["musician"],
  },
  {
    title: "Profile",
    path: "/musician-profile",
    icon: User,
    roles: ["musician"],
  },
  {
    title: "History",
    path: "/musician-history",
    icon: History,
    roles: ["musician"],
  },
  {
    title: "How to for Musicians",
    path: "/musician-how-to",
    icon: Star,
    roles: ["musician"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["musician"],
  },
  // Venue Owner Navigation - Reorganized Order
  {
    title: "Venue Dashboard",
    path: "/venue-dashboard",
    icon: Music,
    roles: ["venue_owner"],
  },
  {
    title: "Invite Musicians",
    path: "/venue-musicians",
    icon: Users,
    roles: ["venue_owner"],
  },
  {
    title: "Messages",
    path: "/messages",
    icon: MessageCircle,
    roles: ["venue_owner"],
  },
  {
    title: "Venue Profile",
    path: "/venue-profile/edit",
    icon: User,
    roles: ["venue_owner"],
  },
  {
    title: "History",
    path: "/venue-history",
    icon: History,
    roles: ["venue_owner"],
  },
  {
    title: "How to for Venues",
    path: "/venue-how-to",
    icon: Star,
    roles: ["venue_owner"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["venue_owner"],
  },
];

// Mobile hamburger menu, uses Sheet for slide-out drawer
export const MobileNav = ({ user }: { user: any }) => {
  return (
    <div className="flex md:hidden">
      <NavDrawer>{({ close }) => <Navigation onLinkClick={close} user={user} />}</NavDrawer>
    </div>
  );
};

// Desktop left nav bar
export const DesktopNav = ({ user }: { user: any }) => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30">
      <div className="flex flex-col flex-grow bg-background border-r h-full">
        <Navigation user={user} />
      </div>
    </div>
  );
};

/**
 * The secondary navigation items for the header dropdown menu.
 * To add a new link, add an object with title, path, and icon.
 */

const secondaryNavigationItems: NavItem[] = [
  {
    title: "Profile",
    path: "/profile",
    icon: User,
  },
];

/**
 * Primary navigation sidebar for logged-in users.
 * Renders navigationItems as vertical links with icons.
 */

export const Navigation = ({ onLinkClick, user }: { onLinkClick?: () => void, user: any }) => {
  const location = useLocation();
  const { getTotalUnreadCount } = useMessaging(user);

  // Get real unread messages count
  const unreadMessagesCount = getTotalUnreadCount();

  // Filter navigation items based on user roles
  const filteredNavigationItems = navigationItems.filter(item => {
    // If no role restriction, show the item
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    const hasRole = item.roles.some(role => {
      if (role === "musician") return user?.user_type === "musician" || user?.userType === "musician" || !!user?.musician;
      if (role === "venue_owner") return user?.user_type === "venue" || user?.user_type === "venue_owner" || user?.userType === "venue" || user?.userType === "venue_owner" || !!user?.venue;
      if (role === "fan") return user?.user_type === "fan" || user?.userType === "fan";
      return false;
    });

    return hasRole;
  });

  // For debugging
  console.log("User data:", user);
  console.log("User type:", user?.user_type || user?.userType);
  console.log("Has musician profile:", !!user?.musician);
  console.log("Filtered navigation items:", filteredNavigationItems.map(i => i.title));

  return (
    <>
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/signed-in" className="flex items-center" onClick={onLinkClick}>
          <img src="/api/assets/autologo?background=light" alt="App logo" className="h-8 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavigationItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors relative
              ${
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            onClick={onLinkClick}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
            {/* Show notification badge for Messages */}
            {(item.path === "/messages" || item.path === "/musician-messages") && unreadMessagesCount > 0 && (
              <NotificationBadge count={unreadMessagesCount} />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
};

/**
 * Secondary navigation dropdown for user/account actions.
 * Renders secondaryNavigationItems as dropdown links with icons.
 * Includes a "Sign out" action at the bottom.
 *
 * @param icon - The icon to display as the dropdown trigger (usually a user avatar or icon).
 */

export const SecondaryNavigation = ({ icon }: { icon: ReactNode }) => {
  const [userMenuActive, setUserMenuActive] = useState(false);
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
    
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <DropdownMenu open={userMenuActive} onOpenChange={setUserMenuActive}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className={`p-2 rounded-full focus-visible:ring-0 ${userMenuActive ? "bg-muted hover:bg-muted" : ""}`}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <>
          {secondaryNavigationItems.map((item) => (
            <DropdownMenuItem key={item.path} asChild className="cursor-pointer">
              <Link to={item.path} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --------------------------------------------------------------------------------------
// To extend: add to navigationItems or secondaryNavigationItems. For custom rendering,
// edit the Navigation or SecondaryNavigation components.
// --------------------------------------------------------------------------------------


