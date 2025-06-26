import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOutletContext, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";

export default function () {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        // Check if user has completed profile setup
        if (!user.firstName || !user.lastName || !user.userType) {
          navigate("/profile-setup");
          return;
        }

        // Check user type and redirect accordingly
        if (user.userType === "musician") {
          // Check if user has a musician profile, create if not
          const musicianProfile = await api.musician.findFirst({
            filter: {
              user: { equals: user.id }
            }
          });
          
          if (!musicianProfile) {
            // Create musician profile
            await api.musician.create({
              user: { _link: user.id },
              name: `${user.firstName} ${user.lastName}`,
              stageName: user.firstName,
              email: user.email,
            });
          }
          
          navigate("/musician-dashboard");
          return;
        }

        if (user.userType === "venue") {
          // Check if user has a venue profile, create if not
          const venueProfile = await api.venue.findFirst({
            filter: {
              owner: { equals: user.id }
            }
          });
          
          if (!venueProfile) {
            // Create venue profile
            await api.venue.create({
              owner: { _link: user.id },
              name: `${user.firstName}'s Venue`,
              email: user.email,
            });
          }
          
          navigate("/venue-dashboard");
          return;
        }

        // User is a fan, stay on this page
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user profile:", error);
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [user, navigate]);

  // Show loading while checking profile
  if (isLoading) {
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

  // Welcome page for fans (users without musician/venue roles)
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Welcome to Live Local!</h1>
            <p className="text-xl text-muted-foreground">
              Hi {user.firstName || user.email.split('@')[0]}, welcome to your music discovery dashboard.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2">Discover Musicians</h3>
                <p className="text-sm text-muted-foreground">
                  Find talented local musicians and bands
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/musicians")}
                >
                  Browse Musicians
                </Button>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2">Find Venues</h3>
                <p className="text-sm text-muted-foreground">
                  Discover great places to see live music
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/venues")}
                >
                  Browse Venues
                </Button>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground">
                  See what's happening in your area
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/events")}
                >
                  View Events
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}