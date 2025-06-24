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

  const loadMusicianProfile = async () => {
    try {
      setLoadingMusician(true);
      
      console.log("=== LOADING MUSICIAN PROFILE ===");
      console.log("Profile - User ID:", user.id);
      console.log("Profile - User email:", user.email);
      
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
          audioFiles: true,
          socialLinks: true,
          additionalPictures: true,
          isActive: true,
          isVerified: true,
          rating: true,
          totalGigs: true,
        },
        first: 1
      });
      
      console.log("Profile - Profile result:", profileResult);
      console.log("Profile - Profile count:", profileResult.length);
      
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
      
      const profileResult = await api.venue.findMany({
        filter: { owner: { id: { equals: user.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
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
          profilePicture: true,
          additionalPictures: true,
          socialLinks: true,
        },
        sort: { updatedAt: "Descending" },
        first: 1
      });
      
      console.log("Loaded venue profile:", profileResult);
      if (profileResult.length > 0) {
        console.log("Venue profilePicture:", profileResult[0].profilePicture);
        console.log("Venue profile ID:", profileResult[0].id);
        console.log("Venue profile updatedAt:", profileResult[0].updatedAt);
      }
      setVenueProfile(profileResult.length > 0 ? profileResult[0] : null);
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
    } else if (venueProfile?.profilePicture) {
      setCurrentImageIndex(0); // Profile picture will be first
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    const allImages = [
      ...(musicianProfile ? [
        musicianProfile.profilePicture,
        ...(musicianProfile.additionalPictures || [])
      ] : []),
      ...(venueProfile ? [
        venueProfile.profilePicture,
        ...(venueProfile.additionalPictures || [])
      ] : [])
    ].filter(Boolean);
    
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    const allImages = [
      ...(musicianProfile ? [
        musicianProfile.profilePicture,
        ...(musicianProfile.additionalPictures || [])
      ] : []),
      ...(venueProfile ? [
        venueProfile.profilePicture,
        ...(venueProfile.additionalPictures || [])
      ] : [])
    ].filter(Boolean);
    
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account settings and profile information</p>
        </div>
        
        {/* Basic Profile Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex gap-8">
                <div className="relative">
                  {(() => {
                    console.log("Profile picture display logic:");
                    console.log("- primaryRole:", primaryRole);
                    console.log("- venueProfile?.profilePicture:", venueProfile?.profilePicture);
                    
                    if (primaryRole === 'musician' && musicianProfile?.profilePicture && !musicianProfile.profilePicture.startsWith('blob:')) {
                      return (
                        <img 
                          src={musicianProfile.profilePicture} 
                          alt="Profile" 
                          className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
                          onClick={openProfilePictureLightbox}
                        />
                      );
                    } else if (primaryRole === 'venue' && venueProfile?.profilePicture && !venueProfile.profilePicture.startsWith('blob:')) {
                      return (
                        <img 
                          src={venueProfile.profilePicture} 
                          alt="Profile" 
                          className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
                          onClick={openProfilePictureLightbox}
                        />
                      );
                    } else {
                      return <UserIcon user={user} className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg" />;
                    }
                  })()}
                  {primaryRole === 'musician' && musicianProfile?.profilePicture?.startsWith('blob:') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                      <span className="text-xs text-gray-500">Image expired</span>
                    </div>
                  )}
                  {primaryRole === 'venue' && venueProfile?.profilePicture?.startsWith('blob:') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                      <span className="text-xs text-gray-500">Image expired</span>
                    </div>
                  )}
                  {primaryRole === 'musician' && musicianProfile?.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {primaryRole === 'venue' && venueProfile?.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                  {hasName && <p className="text-gray-600 mb-4 text-lg">{user.email}</p>}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                      {primaryRole === 'musician' ? 'Musician' : primaryRole === 'venue' ? 'Venue Owner' : 'User'}
                    </Badge>
                    {primaryRole === 'musician' && musicianProfile?.isVerified && (
                      <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {primaryRole === 'venue' && venueProfile?.isVerified && (
                      <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {primaryRole === 'user' && (
                    <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                      Welcome to Live Local Gadget! As a user, you can browse events, follow musicians and venues, and discover great live music in your area.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {!user.googleProfileId && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
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
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    Musician Profile
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Your professional musician information and performance details
                  </CardDescription>
                </div>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/musician-profile/edit">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {loadingMusician ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : musicianProfile ? (
                <div className="space-y-8">
                  {/* Profile Stats - Redesigned */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {musicianProfile.rating && (
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Star className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{musicianProfile.rating}</div>
                        <div className="text-sm text-gray-600 font-medium">Rating</div>
                      </div>
                    )}
                    {musicianProfile.totalGigs && (
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{musicianProfile.totalGigs}</div>
                        <div className="text-sm text-gray-600 font-medium">Total Gigs</div>
                      </div>
                    )}
                    {musicianProfile.hourlyRate && (
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">${musicianProfile.hourlyRate}</div>
                        <div className="text-sm text-gray-600 font-medium">Per Hour</div>
                      </div>
                    )}
                  </div>

                  {/* Profile Details - Redesigned */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        {musicianProfile.stageName && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Stage Name</span>
                            <p className="font-semibold text-gray-900 mt-1">{musicianProfile.stageName}</p>
                          </div>
                        )}
                        {musicianProfile.genre && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Primary Genre</span>
                            <p className="font-semibold text-gray-900 mt-1">{musicianProfile.genre}</p>
                          </div>
                        )}
                        {musicianProfile.genres && musicianProfile.genres.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Genres</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {musicianProfile.genres.map((g: string, i: number) => (
                                <Badge key={i} variant="secondary">{g}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {musicianProfile.yearsExperience && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Experience</span>
                            <p className="font-semibold text-gray-900 mt-1">{musicianProfile.yearsExperience} years</p>
                          </div>
                        )}
                        {musicianProfile.city && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Location</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {[musicianProfile.city, musicianProfile.state, musicianProfile.country].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Contact & Links
                      </h3>
                      <div className="space-y-4">
                        {musicianProfile.phone && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Phone</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-blue-500" />
                              {musicianProfile.phone}
                            </p>
                          </div>
                        )}
                        {musicianProfile.website && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Website</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <Globe className="h-4 w-4 text-blue-500" />
                              <a href={musicianProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {musicianProfile.website}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Audio Samples */}
                  {musicianProfile.audioFiles && musicianProfile.audioFiles.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Audio Samples
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {musicianProfile.audioFiles.map((audio: string, idx: number) => (
                          <div key={idx} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 flex flex-col items-center">
                            <audio controls className="w-full">
                              <source src={audio} type="audio/mpeg" />
                              <source src={audio} type="audio/mp3" />
                              <source src={audio} type="audio/wav" />
                              <source src={audio} type="audio/ogg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Pictures - Redesigned */}
                  {musicianProfile.additionalPictures && musicianProfile.additionalPictures.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Additional Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {musicianProfile.additionalPictures.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Additional photo ${index + 1}`}
                              className="w-full h-40 object-cover rounded-2xl border-2 border-gray-200 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                              onClick={() => openLightbox(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media Links - Redesigned */}
                  {musicianProfile.socialLinks && musicianProfile.socialLinks.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Social Media
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {(() => {
                          return musicianProfile.socialLinks.map((link: any, index: number) => {
                            return (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                {link.platform === 'spotify' && <Music className="h-5 w-5 text-green-600" />}
                                {link.platform === 'youtube' && <Youtube className="h-5 w-5 text-red-600" />}
                                {link.platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                                {link.platform === 'twitter' && <Twitter className="h-5 w-5 text-blue-600" />}
                                {link.platform}
                              </a>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions - Redesigned */}
                  <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                    <Button asChild variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                      <Link to="/availability">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Availability
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                      <Link to="/musician-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        View Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Music className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">No Musician Profile Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create your musician profile to start booking gigs and connecting with venues.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    Venue Profile
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Your venue information and booking details
                  </CardDescription>
                </div>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/venue-profile/edit">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {loadingVenue ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : venueProfile ? (
                <div className="space-y-8">
                  {/* Venue Profile Picture */}
                  {venueProfile.profilePicture && (
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <img 
                          src={venueProfile.profilePicture} 
                          alt="Venue Profile" 
                          className="w-32 h-32 object-cover rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            if (venueProfile.profilePicture) {
                              openLightbox(0);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Venue Stats - Redesigned */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {venueProfile.capacity && (
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{venueProfile.capacity}</div>
                        <div className="text-sm text-gray-600 font-medium">Capacity</div>
                      </div>
                    )}
                    {venueProfile.rating && (
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Star className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{venueProfile.rating}</div>
                        <div className="text-sm text-gray-600 font-medium">Rating</div>
                      </div>
                    )}
                  </div>

                  {/* Venue Details - Redesigned */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Venue Information
                      </h3>
                      <div className="space-y-4">
                        {venueProfile.name && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Venue Name</span>
                            <p className="font-semibold text-gray-900 mt-1">{venueProfile.name}</p>
                          </div>
                        )}
                        {venueProfile.description && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Description</span>
                            <p className="text-gray-900 mt-1 leading-relaxed">{venueProfile.description}</p>
                          </div>
                        )}
                        {venueProfile.type && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Venue Type</span>
                            <p className="font-semibold text-gray-900 mt-1">{venueProfile.type}</p>
                          </div>
                        )}
                        {venueProfile.priceRange && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Price Range</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              {venueProfile.priceRange}
                            </p>
                          </div>
                        )}
                        {venueProfile.address && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Address</span>
                            <p className="text-gray-900 mt-1 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {venueProfile.address}
                            </p>
                          </div>
                        )}
                        {venueProfile.city && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Location</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {[venueProfile.city, venueProfile.state, venueProfile.country].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        )}
                        {venueProfile.amenities && venueProfile.amenities.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Amenities</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {venueProfile.amenities.map((amenity: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Contact & Links
                      </h3>
                      <div className="space-y-4">
                        {venueProfile.phone && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Phone</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-blue-500" />
                              {venueProfile.phone}
                            </p>
                          </div>
                        )}
                        {venueProfile.website && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600 font-medium">Website</span>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                              <Globe className="h-4 w-4 text-blue-500" />
                              <a href={venueProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {venueProfile.website}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Pictures - Redesigned */}
                  {venueProfile.additionalPictures && venueProfile.additionalPictures.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Venue Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {venueProfile.additionalPictures.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Venue photo ${index + 1}`}
                              className="w-full h-40 object-cover rounded-2xl border-2 border-gray-200 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                              onClick={() => openLightbox(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media Links - Redesigned */}
                  {venueProfile.socialLinks && venueProfile.socialLinks.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        Social Media
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {venueProfile.socialLinks.map((link: any, index: number) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            {link.platform === 'spotify' && <Music className="h-5 w-5 text-green-600" />}
                            {link.platform === 'youtube' && <Youtube className="h-5 w-5 text-red-600" />}
                            {link.platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                            {link.platform === 'twitter' && <Twitter className="h-5 w-5 text-blue-600" />}
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions - Redesigned */}
                  <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                    <Button asChild variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                      <Link to="/venue-events">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Events
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                      <Link to="/venue-dashboard">
                        <Building className="mr-2 h-4 w-4" />
                        View Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Building className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">No Venue Profile Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Create your venue profile to start hosting events and booking musicians.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
        {(musicianProfile || venueProfile) && (
          <ImageLightbox
            images={[
              ...(musicianProfile ? [
                musicianProfile.profilePicture,
                ...(musicianProfile.additionalPictures || [])
              ] : []),
              ...(venueProfile ? [
                venueProfile.profilePicture,
                ...(venueProfile.additionalPictures || [])
              ] : [])
            ].filter(Boolean)}
            currentIndex={currentImageIndex}
            isOpen={lightboxOpen}
            onClose={closeLightbox}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        )}
      </div>
    </div>
  );
}