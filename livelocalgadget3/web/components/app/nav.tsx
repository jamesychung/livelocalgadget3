// --------------------------------------------------------------------------------------
// App Navigation System (Primary Left Nav + Secondary Header Dropdown)
// --------------------------------------------------------------------------------------
// This file defines the navigation system for the logged-in section of the app.
// There are two main navigation components:
//
//   - Navigation: The primary navigation, rendered as a vertical sidebar on the left.
//     - Role-specific navigation items based on user type (musician, venue, user)
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
import { Link, useLocation } from "react-router";
import { useSignOut } from "@gadgetinc/react";
import { NavDrawer } from "@/components/shared/NavDrawer";
import { NotificationBadge } from "@/components/shared/NotificationBadge";
import { 
  Home, 
  User, 
  LogOut, 
  Music, 
  Calendar, 
  Building, 
  MapPin, 
  Users, 
  Star, 
  Settings,
  FileText,
  MessageSquare,
  Bell,
  Search,
  Heart,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { forceResetApiClient } from "../../api";

interface NavItem {
  title: string;
  path: string;
  icon: ExoticComponent<{ className: string }>;
}

interface NavigationProps {
  onLinkClick?: () => void;
  user?: any; // Using any for now since Gadget user type is complex
}

interface MobileNavProps {
  user?: any;
}

interface DesktopNavProps {
  user?: any;
}

interface SecondaryNavigationProps {
  icon: ReactNode;
  user?: any; // Using any for now since Gadget user type is complex
}

/**
 * Get role-specific navigation items based on user's primary role
 */
const getNavigationItems = (user: any): NavItem[] => {
  if (!user) return [];

  // Get user's primary role (excluding signed-in role)
  const userRoles = Array.isArray(user.roles) 
    ? user.roles.map((role: unknown) => typeof role === 'string' ? role : 
        (role as any)?.name || (role as any)?.key || String(role))
    : [];
  
  // Check both roles array and primaryRole field
  let primaryRole = userRoles.find((role: string) => role !== 'signed-in') || 'user';
  
  // If primaryRole field is set and not 'user', use that instead
  if (user.primaryRole && user.primaryRole !== 'user') {
    primaryRole = user.primaryRole;
  }

  console.log("Navigation - User roles:", userRoles);
  console.log("Navigation - User primaryRole field:", user.primaryRole);
  console.log("Navigation - Determined primaryRole:", primaryRole);

  switch (primaryRole) {
    case 'musician':
      return [
        {
          title: "Dashboard",
          path: "/musician-dashboard",
          icon: Home,
        },
        {
          title: "My Profile",
          path: "/profile",
          icon: User,
        },
        {
          title: "Bookings",
          path: "/musician-dashboard?tab=bookings",
          icon: Calendar,
        },
        {
          title: "Events",
          path: "/musician-events",
          icon: Music,
        },
        {
          title: "Availability",
          path: "/availability",
          icon: Calendar,
        },
        {
          title: "Reviews",
          path: "/musician-reviews",
          icon: Star,
        },
        {
          title: "Messages",
          path: "/messages",
          icon: MessageSquare,
        },
        {
          title: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
        {
          title: "Settings",
          path: "/settings",
          icon: Settings,
        },
      ];

    case 'venue':
      return [
        {
          title: "Dashboard",
          path: "/venue-dashboard",
          icon: Home,
        },
        {
          title: "Venue Profile",
          path: "/profile",
          icon: Building,
        },
        {
          title: "Events",
          path: "/venue-events",
          icon: Calendar,
        },
        {
          title: "Bookings",
          path: "/venue-dashboard?tab=bookings",
          icon: Calendar,
        },
        {
          title: "Find Musicians",
          path: "/search/musicians",
          icon: Search,
        },
        {
          title: "Reviews",
          path: "/venue-dashboard?tab=reviews",
          icon: Star,
        },
        {
          title: "Messages",
          path: "/messages",
          icon: MessageSquare,
        },
        {
          title: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
        {
          title: "Settings",
          path: "/settings",
          icon: Settings,
        },
      ];

    default: // Regular user
      return [
        {
          title: "Home",
          path: "/signed-in",
          icon: Home,
        },
        {
          title: "Browse Events",
          path: "/events",
          icon: Calendar,
        },
        {
          title: "Find Musicians",
          path: "/musicians",
          icon: Music,
        },
        {
          title: "Find Venues",
          path: "/venues",
          icon: Building,
        },
        {
          title: "My Profile",
          path: "/profile",
          icon: User,
        },
        {
          title: "Favorites",
          path: "/favorites",
          icon: Heart,
        },
        {
          title: "Messages",
          path: "/messages",
          icon: MessageSquare,
        },
        {
          title: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
        {
          title: "Settings",
          path: "/settings",
          icon: Settings,
        },
      ];
  }
};

// Mobile hamburger menu, uses Sheet for slide-out drawer
export const MobileNav = ({ user }: MobileNavProps) => {
  return (
    <div className="flex md:hidden">
      <NavDrawer>{({ close }) => <Navigation onLinkClick={close} user={user} />}</NavDrawer>
    </div>
  );
};

// Desktop left nav bar
export const DesktopNav = ({ user }: DesktopNavProps) => {
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

const getSecondaryNavigationItems = (user: any): NavItem[] => {
  if (!user) return [
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  // Get user's primary role
  const userRoles = Array.isArray(user.roles) 
    ? user.roles.map((role: unknown) => typeof role === 'string' ? role : 
        (role as any)?.name || (role as any)?.key || String(role))
    : [];
  
  let primaryRole = userRoles.find((role: string) => role !== 'signed-in') || 'user';
  
  if (user.primaryRole && user.primaryRole !== 'user') {
    primaryRole = user.primaryRole;
  }

  const baseItems = [
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  // Add role-specific dashboard
  switch (primaryRole) {
    case 'musician':
      return [
        {
          title: "Dashboard",
          path: "/musician-dashboard",
          icon: Home,
        },
        ...baseItems,
      ];
    case 'venue':
      return [
        {
          title: "Dashboard",
          path: "/venue-dashboard",
          icon: Home,
        },
        ...baseItems,
      ];
    default:
      return baseItems;
  }
};

/**
 * Primary navigation sidebar for logged-in users.
 * Renders role-specific navigationItems as vertical links with icons.
 */

export const Navigation = ({ onLinkClick, user }: NavigationProps) => {
  const location = useLocation();
  const navigationItems = getNavigationItems(user);

  // Get user's primary role for display
  const userRoles = Array.isArray(user?.roles) 
    ? user.roles.map((role: unknown) => typeof role === 'string' ? role : 
        (role as any)?.name || (role as any)?.key || String(role))
    : [];
  
  const primaryRole = userRoles.find((role: string) => role !== 'signed-in') || 'user';
  const roleDisplayNames: Record<string, string> = {
    'musician': 'Musician',
    'venue': 'Venue Owner',
    'user': 'User'
  };
  const roleDisplayName = roleDisplayNames[primaryRole] || 'User';

  return (
    <>
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/signed-in" className="flex items-center" onClick={onLinkClick}>
          <img src="/api/assets/autologo?background=light" alt="App logo" className="h-8 w-auto" />
        </Link>
      </div>
      
      {/* Role Badge */}
      <div className="px-6 py-3 border-b">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {roleDisplayName}
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigationItems.map((item) => {
          // Check if current location matches the item path (including query params)
          const isActive = location.pathname === item.path || 
            (item.path.includes('?') && location.pathname + location.search === item.path) ||
            (location.pathname === item.path && item.path.includes('dashboard'));

          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={onLinkClick}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {/* Add notification badges for Messages and Notifications */}
              {(item.title === "Messages" || item.title === "Notifications") && user?.id && (
                <NotificationBadge userId={user.id} className="ml-2" />
              )}
            </Link>
          );
        })}
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
 * @param user - The current user object to determine role-specific navigation items.
 */

export const SecondaryNavigation = ({ icon, user }: SecondaryNavigationProps) => {
  const [userMenuActive, setUserMenuActive] = useState(false);
  const signOut = useSignOut({ redirectToPath: "/" });
  const secondaryNavigationItems = getSecondaryNavigationItems(user);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force reset the API client and clear all session data
      await forceResetApiClient();
      
      // Force reload to ensure clean state with cache busting
      window.location.href = "/?logout=" + Date.now();
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback: force reset and reload anyway
      await forceResetApiClient();
      window.location.href = "/?logout=" + Date.now();
    }
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