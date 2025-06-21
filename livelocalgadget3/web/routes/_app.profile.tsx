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
import { useOutletContext, useRevalidator, useNavigate } from "react-router";
import { api } from "../api";
import type { AuthOutletContext } from "./_app";
import { Music, MapPin, Phone, Globe, Star, Calendar, DollarSign, Building } from "lucide-react";

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

export default function () {
  const { user } = useOutletContext<AuthOutletContext>();
  const navigate = useNavigate();

  const revalidator = useRevalidator();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [musicianProfile, setMusicianProfile] = useState<any>(null);
  const [loadingMusician, setLoadingMusician] = useState(false);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [loadingVenue, setLoadingVenue] = useState(false);

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
      
      // Use the correct filter syntax for the user relationship
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
          isActive: true,
          isVerified: true,
          rating: true,
          totalGigs: true,
        },
        first: 1
      });
      
      // Take the first result if any exist
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      {/* Debug Information */}
      <Card className="mb-6 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>User Roles:</strong> {JSON.stringify(user.roles)}</p>
            <p><strong>User Primary Role Field:</strong> {user.primaryRole}</p>
            <p><strong>Primary Role (calculated):</strong> {primaryRole}</p>
            <p><strong>Loading Musician:</strong> {loadingMusician ? 'Yes' : 'No'}</p>
            <p><strong>Musician Profile:</strong> {musicianProfile ? 'Found' : 'Not found'}</p>
            <p><strong>Musician Profile Data:</strong> {musicianProfile ? JSON.stringify(musicianProfile, null, 2) : 'None'}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Basic Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <UserIcon user={user} className="h-16 w-16" />
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {hasName && <p className="text-gray-600">{user.email}</p>}
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{primaryRole === 'musician' ? 'Musician' : primaryRole === 'venue' ? 'Venue Owner' : 'User'}</Badge>
                </div>
                {primaryRole === 'user' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Welcome to Live Local Gadget! As a user, you can browse events, follow musicians and venues, and discover great live music in your area.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!user.googleProfileId && (
                <Button variant="ghost" onClick={() => setIsChangingPassword(true)}>
                  Change password
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Musician Profile Section */}
      {primaryRole === 'musician' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Musician Profile
            </CardTitle>
            <CardDescription>
              Your professional musician information and performance details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMusician ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : musicianProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Musician Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {safeString(musicianProfile.stageName) || `${safeString(user.firstName)} ${safeString(user.lastName)}`}
                    </h3>
                    {musicianProfile.bio && (
                      <p className="text-sm text-muted-foreground">{safeString(musicianProfile.bio)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Music className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <strong className="text-sm">Genres:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {musicianProfile.genres && musicianProfile.genres.length > 0 ? (
                            musicianProfile.genres.map((genre: string, index: number) => (
                              <Badge key={index} variant="secondary">{genre}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Not specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Music className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <strong className="text-sm">Instruments:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {musicianProfile.instruments && musicianProfile.instruments.length > 0 ? (
                            musicianProfile.instruments.flat().map((instrument: string, index: number) => (
                              instrument && <Badge key={index} variant="outline">{instrument}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Not specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Location:</strong> {[
                          safeString(musicianProfile.city),
                          safeString(musicianProfile.state),
                          safeString(musicianProfile.country)
                        ].filter(Boolean).join(", ") || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Rate:</strong> ${safeString(musicianProfile.hourlyRate) || 0}/hour
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats and Contact */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="font-bold text-xl">{safeString(musicianProfile.totalGigs) || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Gigs</p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <p className="font-bold text-xl">{safeString(musicianProfile.rating) || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    {musicianProfile.email && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${musicianProfile.email}`} className="text-sm hover:underline">
                          {musicianProfile.email}
                        </a>
                      </div>
                    )}
                    {musicianProfile.phone && (
                       <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{safeString(musicianProfile.phone)}</span>
                      </div>
                    )}
                    {musicianProfile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={safeString(musicianProfile.website)} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                 {/* Action Buttons */}
                 <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => navigate('/musician-profile/edit')}>Edit Profile</Button>
                  <Button onClick={() => navigate('/musician-dashboard')}>Go to Dashboard</Button>
                </div>
              </div>
            ) : (
              <p>No musician profile found. <a href="/musician-profile-create" className="text-blue-500 hover:underline">Create one now</a>.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Venue Profile Section */}
      {primaryRole === 'venue' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Venue Profile
            </CardTitle>
            <CardDescription>
              Your venue information and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVenue ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : venueProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Venue Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {safeString(venueProfile.name) || "Venue Name"}
                    </h3>
                    {venueProfile.description && (
                      <p className="text-sm text-muted-foreground">{safeString(venueProfile.description)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Location:</strong> {[
                          safeString(venueProfile.city),
                          safeString(venueProfile.state),
                          safeString(venueProfile.country)
                        ].filter(Boolean).join(", ") || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Price Range:</strong> {safeString(venueProfile.priceRange) || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats and Contact */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {safeString(venueProfile.totalEvents) || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {safeString(venueProfile.rating) || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {venueProfile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{safeString(venueProfile.phone)}</span>
                      </div>
                    )}
                    {venueProfile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={safeString(venueProfile.website)} 
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {safeString(venueProfile.website)}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={venueProfile.isActive ? "default" : "secondary"}>
                      {venueProfile.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={venueProfile.isVerified ? "default" : "secondary"}>
                      {venueProfile.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/venue-profile/edit")}
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => navigate("/venue-dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No venue profile found. Create one to showcase your venue.
                </p>
                <Button onClick={() => navigate("/venue-profile/edit")}>
                  Create Venue Profile
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