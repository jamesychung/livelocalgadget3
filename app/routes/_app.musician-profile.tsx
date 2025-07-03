import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { AuthOutletContext } from "./_app";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, MapPin, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { ClickableImage } from "../components/shared/ClickableImage";

interface SocialLink {
  platform: string;
  url: string;
}

export default function MusicianProfile() {
  const context = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [musicianProfile, setMusicianProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ensure we have the user from context
  const user = context?.user;
  
  useEffect(() => {
    const fetchMusicianProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("musicians")
          .select("*")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error loading musician data:", error);
          setError("Failed to load profile. Please try again.");
        } else if (!data) {
          setError("No musician profile found. Redirecting to create page...");
          setTimeout(() => {
            navigate("/musician-profile/create");
          }, 2000);
        } else {
          console.log("Musician profile data:", data);
          setMusicianProfile(data);
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicianProfile();
  }, [user, navigate]);

  if (isLoading) return <div className="container mx-auto p-6"><div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div><p>Loading profile...</p></div></div>;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader><CardTitle>Something went wrong</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>Try Again</Button>
              <Button onClick={() => navigate("/musician-dashboard")}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!musicianProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader><CardTitle>No Profile Found</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">You do not have a musician profile yet.</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/musician-dashboard")}>Back to Dashboard</Button>
              <Button onClick={() => navigate("/musician-profile/create")}>Create Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format social media links
  const socialLinks: SocialLink[] = musicianProfile.social_links || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Musician Profile</h1>
        <Button asChild>
          <Link to="/musician-profile/edit">
            <Edit className="mr-2 h-4 w-4" />Edit Profile
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{musicianProfile.stage_name || "My Profile"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Picture with Lightbox */}
            {musicianProfile.profile_picture && (
              <div className="flex justify-center mb-4">
                <ClickableImage
                  src={musicianProfile.profile_picture}
                  alt={musicianProfile.stage_name || "Musician"}
                  className="h-40 w-40 object-cover rounded-full"
                  images={[musicianProfile.profile_picture]}
                />
              </div>
            )}
            
            {/* About Section */}
            <div>
              <h3 className="font-medium text-lg">About</h3>
              <p className="mt-1">{musicianProfile.bio || "No bio provided."}</p>
            </div>
            
            {/* Genres Section */}
            <div>
              <h3 className="font-medium text-lg">Genres</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {musicianProfile.genres && musicianProfile.genres.length > 0 ? (
                  musicianProfile.genres.map((genre: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <p>No genres specified</p>
                )}
              </div>
            </div>
            
            {/* Experience and Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Experience
                </h3>
                <p className="mt-1">
                  {musicianProfile.experience 
                    ? musicianProfile.experience
                    : musicianProfile.yearsExperience 
                    ? `${musicianProfile.yearsExperience} years`
                    : "Experience not specified"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" /> Rate
                </h3>
                <p className="mt-1">
                  {musicianProfile.hourly_rate 
                    ? `$${musicianProfile.hourly_rate} per hour` 
                    : "Rate not specified"}
                </p>
              </div>
            </div>
            
            {/* Location Section */}
            <div>
              <h3 className="font-medium text-lg flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> Location
              </h3>
              <p className="mt-1">
                {[musicianProfile.city, musicianProfile.state, musicianProfile.country].filter(Boolean).join(", ") || "Location not provided"}
              </p>
            </div>
            
            {/* Contact Section */}
            <div>
              <h3 className="font-medium text-lg">Contact</h3>
              <p className="mt-1">Email: {musicianProfile.email || user?.email || "Not available"}</p>
              {musicianProfile.phone && <p>Phone: {musicianProfile.phone}</p>}
            </div>
            
            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="font-medium text-lg">Social Media</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {socialLinks.map((link: SocialLink, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Audio Files Section */}
            {musicianProfile.audio_files && musicianProfile.audio_files.length > 0 && (
              <div>
                <h3 className="font-medium text-lg">Audio Samples</h3>
                <div className="space-y-3 mt-2">
                  {musicianProfile.audio_files.map((audioUrl: string, index: number) => (
                    <div key={index} className="border rounded-md p-3">
                      <audio controls className="w-full">
                        <source src={audioUrl} />
                        Your browser does not support the audio element.
                      </audio>
                      <p className="text-sm text-muted-foreground mt-1">Audio Sample {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Pictures Section with Lightbox */}
            {musicianProfile.additional_pictures && musicianProfile.additional_pictures.length > 0 && (
              <div>
                <h3 className="font-medium text-lg">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {musicianProfile.additional_pictures.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <ClickableImage
                        src={imageUrl}
                        alt={`${musicianProfile.stage_name || 'Musician'} photo ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                        images={musicianProfile.additional_pictures}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/musician-dashboard")}>
              Back to Dashboard
            </Button>
            <Button asChild>
              <Link to="/musician-profile/edit">
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
