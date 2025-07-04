import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit, MapPin, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { ClickableImage } from "../../shared/ClickableImage";
import { MusicianProfile } from "./types";

interface ProfileViewProps {
  profile: MusicianProfile;
  user: any;
  navigate: (path: string) => void;
}

interface SocialLink {
  platform: string;
  url: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, user, navigate }) => {
  // Format social media links
  const socialLinks: SocialLink[] = profile.social_links || [];

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
          <CardTitle>{profile.stage_name || "My Profile"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Picture with Lightbox */}
            {profile.profile_picture && (
              <div className="flex justify-center mb-4">
                <ClickableImage
                  src={profile.profile_picture}
                  alt={profile.stage_name || "Musician"}
                  className="h-40 w-40 object-cover rounded-full"
                  images={[profile.profile_picture]}
                />
              </div>
            )}
            
            {/* About Section */}
            <div>
              <h3 className="font-medium text-lg">About</h3>
              <p className="mt-1">{profile.bio || "No bio provided."}</p>
            </div>
            
            {/* Genres Section */}
            <div>
              <h3 className="font-medium text-lg">Genres</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.genres && profile.genres.length > 0 ? (
                  profile.genres.map((genre: string, index: number) => (
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
                  {profile.experience 
                    ? profile.experience
                    : profile.years_experience 
                    ? `${profile.years_experience} years`
                    : "Experience not specified"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" /> Rate
                </h3>
                <p className="mt-1">
                  {profile.hourly_rate 
                    ? `$${profile.hourly_rate} per hour` 
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
                {[profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "Location not provided"}
              </p>
            </div>
            
            {/* Contact Section */}
            <div>
              <h3 className="font-medium text-lg">Contact</h3>
              <p className="mt-1">Email: {profile.email || user?.email || "Not available"}</p>
              {profile.phone && <p>Phone: {profile.phone}</p>}
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
            {profile.audio_files && profile.audio_files.length > 0 && (
              <div>
                <h3 className="font-medium text-lg">Audio Samples</h3>
                <div className="space-y-3 mt-2">
                  {profile.audio_files.map((audioUrl: string, index: number) => (
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
            {profile.additional_pictures && profile.additional_pictures.length > 0 && (
              <div>
                <h3 className="font-medium text-lg">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {profile.additional_pictures.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <ClickableImage
                        src={imageUrl}
                        alt={`${profile.stage_name || 'Musician'} photo ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                        images={profile.additional_pictures}
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
}; 