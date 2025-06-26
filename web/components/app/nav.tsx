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
import { Link, useLocation, useOutletContext } from "react-router";
import { useSignOut } from "@gadgetinc/react";
import { NavDrawer } from "@/components/shared/NavDrawer";
import { Home, User, LogOut, Calendar, Music, Settings, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    title: "Home",
    path: "/signed-in",
    icon: Home,
  },
  {
    title: "Dashboard",
    path: "/musician-dashboard",
    icon: Music,
    roles: ["musician"],
  },
  {
    title: "Profile",
    path: "/musician-profile/edit",
    icon: User,
    roles: ["musician"],
  },
  {
    title: "Bookings",
    path: "/musician-bookings",
    icon: Calendar,
    roles: ["musician"],
  },
  {
    title: "Availability",
    path: "/availability",
    icon: Clock,
    roles: ["musician"],
  },
  {
    title: "Events",
    path: "/musician-events",
    icon: Star,
    roles: ["musician"],
  },
  // Venue Owner Navigation
  {
    title: "Venue Dashboard",
    path: "/venue-dashboard",
    icon: Music,
    roles: ["venue"],
  },
  {
    title: "Venue Profile",
    path: "/venue-profile/edit",
    icon: User,
    roles: ["venue"],
  },
  {
    title: "Venue Bookings",
    path: "/venue-bookings",
    icon: Calendar,
    roles: ["venue"],
  },
  {
    title: "Venue Events",
    path: "/venue-events",
    icon: Star,
    roles: ["venue"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
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

  // Debug logging
  console.log("Navigation - User:", user);
  console.log("Navigation - User type:", user?.userType);

  // Filter navigation items based on user type
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles) {
      console.log(`Item "${item.title}" - No role restriction, showing`);
      return true; // Show items without role restrictions
    }
    
    const hasRole = item.roles.includes(user?.userType || "");
    console.log(`Item "${item.title}" - Roles: ${item.roles.join(', ')}, User type: ${user?.userType}, Has role: ${hasRole}`);
    return hasRole;
  });

  console.log("Filtered navigation items:", filteredNavigationItems.map(item => item.title));

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
            className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors
              ${
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            onClick={onLinkClick}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
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
  const signOut = useSignOut({ redirectToPath: "/" });

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
            onClick={signOut}
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