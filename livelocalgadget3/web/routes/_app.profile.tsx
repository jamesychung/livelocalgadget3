import { UserIcon } from "@/components/shared/UserIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionForm } from "@gadgetinc/react";
import { useState, useEffect } from "react";
import { useOutletContext, useRevalidator, useNavigate, Link } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { Music, MapPin, Phone, Globe, Star, Calendar, DollarSign, Building, Edit, Settings, User, Shield, Youtube, Instagram, Twitter } from "lucide-react";
import { ImageLightbox } from "@/components/shared/ImageLightbox";

// Safe string conversion function
const safeString = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    if (value.name) return String(value.name);
    if (value.key) return String(value.key);
    return JSON.stringify(value);
  }
  return String(value);
};

export default function ProfilePage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();

  const revalidator = useRevalidator();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [musicianProfile, setMusicianProfile] = useState<any>(null);
  const [loadingMusician, setLoadingMusician] = useState(false);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get user's primary role from the primaryRole field
  const primaryRole = user.primaryRole || 'user';

  // Load profile data based on user role
  useEffect(() => {
    if (primaryRole === 'musician') {
      loadMusicianProfile();
    } else if (primaryRole === 'venue') {
      loadVenueProfile();
    }
  }, [primaryRole]);

  // Debug effect for musician profile
  useEffect(() => {
    if (musicianProfile) {
      console.log("Musician profile state:", musicianProfile);
      console.log("Profile picture URL:", musicianProfile.profilePicture);
      console.log("Profile picture URL type:", typeof musicianProfile.profilePicture);
      console.log("Profile picture starts with blob:", musicianProfile.profilePicture?.startsWith('blob:'));
      console.log("Audio URL:", musicianProfile.audio);
      console.log("Audio URL type:", typeof musicianProfile.audio);
      console.log("Audio starts with blob:", musicianProfile.audio?.startsWith('blob:'));
      console.log("Social links:", musicianProfile.socialLinks);
      console.log("Additional pictures:", musicianProfile.additionalPictures);
    }
  }, [musicianProfile]);

  const loadMusicianProfile = async () => {
    try {
      setLoadingMusician(true);
      
      const profileResult = await api.musician.findMany({
        filter: { user: { id: { equals: user.id } } },
        select: {
          id: true,
          stageName: true,
          bio: true,
          genre: true,
          genres: true,
          instruments: true,
          hourlyRate: true,
          city: true,
          state: true,
          country: true,
          experience: true,
          yearsExperience: true,
          phone: true,
          email: true,
          website: true,
          profilePicture: true,
          audio: true,
          socialLinks: true,
          additionalPictures: true,
          isActive: true,
          isVerified: true,
          rating: true,
          totalGigs: true,
        },
        first: 1
      });
      
      console.log("Loaded musician profile:", profileResult);
      setMusicianProfile(profileResult.length > 0 ? profileResult[0] : null);
      
    } catch (err) {
      console.error("Error loading musician profile:", err);
    } finally {
      setLoadingMusician(false);
    }
  };

  const loadVenueProfile = async () => {
    try {
      setLoadingVenue(true);
      
      const profileResult = await api.venue.findFirst({
        filter: { user: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
          location: true,
          city: true,
          state: true,
          country: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          priceRange: true,
          amenities: true,
          hours: true,
          isActive: true,
          isVerified: true,
          rating: true,
          totalEvents: true,
        },
      });
      setVenueProfile(profileResult);
    } catch (err) {
      console.error("Error loading venue profile:", err);
    } finally {
      setLoadingVenue(false);
    }
  };

  // For regular users, show a simple profile page
  const hasName = user.firstName || user.lastName;
  const title = hasName ? `${user.firstName} ${user.lastName}` : user.email;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const openProfilePictureLightbox = () => {
    if (musicianProfile?.profilePicture) {
      setCurrentImageIndex(0); // Profile picture will be first
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    const allImages = [
      musicianProfile?.profilePicture,
      ...(musicianProfile?.additionalPictures || [])
    ].filter(Boolean);
    
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    const allImages = [
      musicianProfile?.profilePicture,
      ...(musicianProfile?.additionalPictures || [])
    ].filter(Boolean);
    
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">Manage your account settings and profile information</p>
      </div>
      
      {/* Basic Profile Card */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="relative">
                {(() => {
                  console.log("Profile picture display logic:");
                  console.log("- primaryRole:", primaryRole);
                  console.log("- musicianProfile?.profilePicture:", musicianProfile?.profilePicture);
                  console.log("- starts with blob:", musicianProfile?.profilePicture?.startsWith('blob:'));
                  console.log("- condition result:", primaryRole === 'musician' && musicianProfile?.profilePicture && !musicianProfile.profilePicture.startsWith('blob:'));
                  
                  if (primaryRole === 'musician' && musicianProfile?.profilePicture && !musicianProfile.profilePicture.startsWith('blob:')) {
                    return (
                      <img 
                        src={musicianProfile.profilePicture} 
                        alt="Profile" 
                        className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                        onClick={openProfilePictureLightbox}
                      />
                    );
                  } else {
                    return <UserIcon user={user} className="h-20 w-20" />;
                  }
                })()}
                {primaryRole === 'musician' && musicianProfile?.profilePicture?.startsWith('blob:') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <span className="text-xs text-gray-500">Image expired</span>
                  </div>
                )}
                {primaryRole === 'musician' && musicianProfile?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
                {primaryRole === 'venue' && venueProfile?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h2>
                {hasName && <p className="text-gray-600 mb-3">{user.email}</p>}
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {primaryRole === 'musician' ? 'Musician' : primaryRole === 'venue' ? 'Venue Owner' : 'User'}
                  </Badge>
                  {primaryRole === 'musician' && musicianProfile?.isVerified && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {primaryRole === 'venue' && venueProfile?.isVerified && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {primaryRole === 'user' && (
                  <p className="text-sm text-gray-600 mt-3 max-w-md">
                    Welcome to Live Local Gadget! As a user, you can browse events, follow musicians and venues, and discover great live music in your area.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!user.googleProfileId && (
                <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Musician Profile Section */}
      {primaryRole === 'musician' && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Musician Profile
                </CardTitle>
                <CardDescription>
                  Your professional musician information and performance details
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/musician-profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingMusician ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : musicianProfile ? (
              <div className="space-y-6">
                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {musicianProfile.hourlyRate && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">${musicianProfile.hourlyRate}</div>
                      <div className="text-sm text-gray-600">Hourly Rate</div>
                    </div>
                  )}
                  {musicianProfile.rating && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{musicianProfile.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  )}
                  {musicianProfile.totalGigs && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{musicianProfile.totalGigs}</div>
                      <div className="text-sm text-gray-600">Total Gigs</div>
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      {musicianProfile.stageName && (
                        <div>
                          <span className="text-sm text-gray-600">Stage Name:</span>
                          <p className="font-medium">{musicianProfile.stageName}</p>
                        </div>
                      )}
                      {musicianProfile.genre && (
                        <div>
                          <span className="text-sm text-gray-600">Primary Genre:</span>
                          <p className="font-medium">{musicianProfile.genre}</p>
                        </div>
                      )}
                      {musicianProfile.yearsExperience && (
                        <div>
                          <span className="text-sm text-gray-600">Experience:</span>
                          <p className="font-medium">{musicianProfile.yearsExperience} years</p>
                        </div>
                      )}
                      {musicianProfile.city && (
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {[musicianProfile.city, musicianProfile.state, musicianProfile.country].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact & Links</h3>
                    <div className="space-y-3">
                      {musicianProfile.phone && (
                        <div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {musicianProfile.phone}
                          </p>
                        </div>
                      )}
                      {musicianProfile.website && (
                        <div>
                          <span className="text-sm text-gray-600">Website:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <a href={musicianProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {musicianProfile.website}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audio Sample */}
                {musicianProfile.audio && !musicianProfile.audio.startsWith('blob:') && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">Audio Sample</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <audio controls className="w-full">
                        <source src={musicianProfile.audio} type="audio/mpeg" />
                        <source src={musicianProfile.audio} type="audio/mp3" />
                        <source src={musicianProfile.audio} type="audio/wav" />
                        <source src={musicianProfile.audio} type="audio/ogg" />
                        Your browser does not support the audio element.
                      </audio>
                      <p className="text-xs text-gray-500 mt-2">
                        Audio URL: {musicianProfile.audio.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                )}
                {musicianProfile.audio && musicianProfile.audio.startsWith('blob:') && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">Audio Sample</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Audio file expired. Please re-upload.</p>
                    </div>
                  </div>
                )}

                {/* Additional Pictures */}
                {musicianProfile.additionalPictures && musicianProfile.additionalPictures.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">Additional Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {musicianProfile.additionalPictures.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Additional photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => openLightbox(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Media Links */}
                {musicianProfile.socialLinks && musicianProfile.socialLinks.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                      {musicianProfile.socialLinks.map((link: any, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          {link.platform === 'spotify' && <Music className="h-4 w-4 text-green-600" />}
                          {link.platform === 'youtube' && <Youtube className="h-4 w-4 text-red-600" />}
                          {link.platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                          {link.platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-600" />}
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button asChild variant="outline">
                    <Link to="/availability">
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Availability
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/musician-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Musician Profile Found</h3>
                <p className="text-gray-600 mb-4">
                  Create your musician profile to start booking gigs and connecting with venues.
                </p>
                <Button asChild>
                  <Link to="/musician-profile/edit">
                    Create Musician Profile
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Venue Profile Section */}
      {primaryRole === 'venue' && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Venue Profile
                </CardTitle>
                <CardDescription>
                  Your venue information and booking details
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/venue-profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingVenue ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : venueProfile ? (
              <div className="space-y-6">
                {/* Venue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {venueProfile.capacity && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{venueProfile.capacity}</div>
                      <div className="text-sm text-gray-600">Capacity</div>
                    </div>
                  )}
                  {venueProfile.rating && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{venueProfile.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  )}
                  {venueProfile.totalEvents && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{venueProfile.totalEvents}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                  )}
                </div>

                {/* Venue Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Venue Information</h3>
                    <div className="space-y-3">
                      {venueProfile.name && (
                        <div>
                          <span className="text-sm text-gray-600">Venue Name:</span>
                          <p className="font-medium">{venueProfile.name}</p>
                        </div>
                      )}
                      {venueProfile.type && (
                        <div>
                          <span className="text-sm text-gray-600">Type:</span>
                          <p className="font-medium">{venueProfile.type}</p>
                        </div>
                      )}
                      {venueProfile.city && (
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {[venueProfile.city, venueProfile.state, venueProfile.country].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact & Links</h3>
                    <div className="space-y-3">
                      {venueProfile.phone && (
                        <div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {venueProfile.phone}
                          </p>
                        </div>
                      )}
                      {venueProfile.website && (
                        <div>
                          <span className="text-sm text-gray-600">Website:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <a href={venueProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {venueProfile.website}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button asChild variant="outline">
                    <Link to="/venue-events">
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Events
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/venue-dashboard">
                      <Building className="mr-2 h-4 w-4" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Venue Profile Found</h3>
                <p className="text-gray-600 mb-4">
                  Create your venue profile to start hosting events and booking musicians.
                </p>
                <Button asChild>
                  <Link to="/venue-profile/edit">
                    Create Venue Profile
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ChangePasswordModal
        open={isChangingPassword}
        onClose={() => {
          setIsChangingPassword(false);
          revalidator.revalidate();
        }}
      />

      {/* Image Lightbox */}
      {musicianProfile && (
        <ImageLightbox
          images={[
            musicianProfile.profilePicture,
            ...(musicianProfile.additionalPictures || [])
          ].filter(Boolean)}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </div>
  );
}

const ChangePasswordModal = (props: { open: boolean; onClose: () => void }) => {
  const { user } = useOutletContext<AuthOutletContext>();

  const {
    register,
    submit,
    reset,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.changePassword, {
    defaultValues: user,
    onSuccess: props.onClose,
  });

  const onClose = () => {
    reset();
    props.onClose();
  };

  return (
    <Dialog open={props.open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" autoComplete="off" {...register("currentPassword")} />
              {errors?.root?.message && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" autoComplete="off" {...register("newPassword")} />
              {errors?.user?.password?.message && (
                <p className="text-red-500 text-sm mt-1">New password {errors.user.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};