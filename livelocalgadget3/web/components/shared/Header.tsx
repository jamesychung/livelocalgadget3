import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useUser, useSignOut, useFindMany } from "@gadgetinc/react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "../../api";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ showBackButton = false, onBackClick }: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const user = useUser();
  const signOut = useSignOut({ redirectToPath: "/" });
  const navigate = useNavigate();

  // Check if user is a musician
  const [{ data: musicianData }] = useFindMany(api.musician, {
    filter: { user: { id: { equals: user?.id } } },
    select: { id: true },
    first: 1,
    pause: !user?.id,
  });

  const isMusician = musicianData && musicianData.length > 0;

  // Ensure we're on the client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine the events link based on user role
  const getEventsLink = () => {
    if (isMusician) {
      return "/musician-events";
    }
    return "/events";
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {showBackButton && (
              <button 
                onClick={onBackClick}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#4a5568',
                  marginRight: '0.5rem'
                }}
              >
                ←
              </button>
            )}
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              🎵
            </div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>
                Live Local Beats
              </h1>
            </Link>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
            <Link to={getEventsLink()} style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Events</Link>
            <Link to="/musicians" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Musicians</Link>
            <button 
              onClick={() => {
                console.log("Venues button clicked - navigating to /venues");
                navigate('/venues');
              }}
              style={{ 
                color: '#4a5568', 
                textDecoration: 'none', 
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'inherit',
                fontFamily: 'inherit'
              }}
            >
              Venues
            </button>
            
            {isClient && user ? (
              // Signed-in user navigation
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <User style={{ width: '16px', height: '16px' }} />
                    {user.firstName || user.email?.split('@')[0] || 'Profile'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/signed-in" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link 
                  to="/sign-in"
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: 'transparent',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#667eea';
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/sign-up"
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 