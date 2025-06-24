import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useFindMany, useFindOne } from "@gadgetinc/react";
import { api } from "../api";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, MapPin, Calendar, Clock, Music, DollarSign, ArrowLeft, ExternalLink, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import { ImageLightbox } from "../components/shared/ImageLightbox";

interface MusicianData {
  id: string;
  name?: string;
  stageName?: string;
  bio?: string;
  genre?: string;
  genres?: string[];
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
  rating?: number;
  totalGigs?: number;
  hourlyRate?: number;
  instruments?: string[];
  availability?: any;
  website?: string;
  experience?: string;
  yearsExperience?: number;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  additionalPictures?: string[];
  socialLinks?: any[];
  audioFiles?: string[];
  isActive?: boolean;
}

interface BookingData {
  id: string;
  status?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  totalAmount?: number;
  notes?: string;
  venue?: {
    id: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

export default function MusicianProfile() {
  const { musicianId } = useParams();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, [musicianId]);

  // Fetch real musician data from database
  const [{ data: musicianData, fetching: musicianFetching, error: musicianError }] = useFindOne(api.musician, musicianId || "", {
    pause: !musicianId,
    select: {
      id: true,
      name: true,
      stageName: true,
      bio: true,
      genre: true,
      genres: true,
      city: true,
      state: true,
      country: true,
      profilePicture: true,
      rating: true,
      totalGigs: true,
      hourlyRate: true,
      instruments: true,
      availability: true,
      website: true,
      experience: true,
      yearsExperience: true,
      phone: true,
      email: true,
      isVerified: true,
      additionalPictures: true,
      socialLinks: true,
      audioFiles: true,
      isActive: true,
    }
  });

  // Fetch bookings for this musician
  const [{ data: bookingsData, fetching: bookingsFetching }] = useFindMany(api.booking, {
    filter: { musician: { id: { equals: musicianId } } },
    select: {
      id: true,
      status: true,
      date: true,
      startTime: true,
      endTime: true,
      totalAmount: true,
      notes: true,
      venue: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
      }
    },
    pause: !musicianId,
  });

  // Prepare all images for lightbox - moved after data fetching
  useEffect(() => {
    if (musicianData) {
      const images: string[] = [];
      const data = musicianData as MusicianData;
      
      // Add profile picture if it exists
      if (data.profilePicture) {
        images.push(data.profilePicture);
      }
      
      // Add additional pictures if they exist
      if (data.additionalPictures && data.additionalPictures.length > 0) {
        images.push(...data.additionalPictures);
      }
      
      setAllImages(images);
    } else {
      // Reset images when no data
      setAllImages([]);
    }
  }, [musicianData]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleBookNow = () => {
    // Navigate to booking page
    window.location.href = `/booking/musician/${musicianId}`;
  };

  const handleContact = () => {
    // Navigate to contact page
    window.location.href = `/contact/musician/${musicianId}`;
  };

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Show loading state
  if (musicianFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header showBackButton={true} onBackClick={handleBackClick} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading musician profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (musicianError || !musicianData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header showBackButton={true} onBackClick={handleBackClick} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Musician Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The musician profile you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const musician: MusicianData = musicianData;
  const bookings: BookingData[] = bookingsData || [];
  
  // Separate upcoming and past bookings
  const upcomingBookings = bookings.filter(booking => 
    booking.date && new Date(booking.date) > new Date()
  );
  const pastBookings = bookings.filter(booking => 
    booking.date && new Date(booking.date) <= new Date()
  );

  // Format location
  const location = [musician.city, musician.state, musician.country]
    .filter(Boolean)
    .join(", ");

  // Format hourly rate
  const hourlyRate = musician.hourlyRate ? `$${musician.hourlyRate}/hour` : "Rate not set";

  // Get display name
  const displayName = musician.stageName || musician.name || "Musician";

  // Helper function to get social media icon
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      case 'linkedin': return Linkedin;
      default: return ExternalLink;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header showBackButton={true} onBackClick={handleBackClick} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div 
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => musician.profilePicture && handleImageClick(0)}
                >
                  <img 
                    src={musician.profilePicture || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {musician.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <Star className="h-4 w-4 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{displayName}</h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                  {musician.genre && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Music className="mr-1 h-3 w-3" />
                      {musician.genre}
                    </Badge>
                  )}
                  {location && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <MapPin className="mr-1 h-3 w-3" />
                      {location}
                    </Badge>
                  )}
                  {musician.isActive !== false && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/30">
                      Available
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  {musician.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                      <span>{musician.rating}</span>
                    </div>
                  )}
                  {musician.totalGigs && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{musician.totalGigs} gigs</span>
                    </div>
                  )}
                  {musician.yearsExperience && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{musician.yearsExperience} years</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleBookNow}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                >
                  Book Now
                </Button>
                <Button 
                  onClick={handleContact}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <CardContent className="p-8">
            {musician.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{musician.bio}</p>
              </div>
            )}

            {/* Experience Section */}
            {musician.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Experience</h2>
                <p className="text-gray-600 leading-relaxed">{musician.experience}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{hourlyRate}</div>
                <div className="text-sm text-gray-600">Hourly Rate</div>
              </div>
              {musician.rating && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{musician.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              )}
              {musician.totalGigs && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{musician.totalGigs}</div>
                  <div className="text-sm text-gray-600">Total Gigs</div>
                </div>
              )}
            </div>

            {/* Instruments and Genres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {musician.instruments && musician.instruments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Instruments</h3>
                  <div className="flex flex-wrap gap-2">
                    {musician.instruments.map((instrument: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {musician.genres && musician.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {musician.genres.map((genre: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {musician.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{musician.phone}</span>
                    </div>
                  )}
                  {musician.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{musician.email}</span>
                    </div>
                  )}
                  {musician.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <ExternalLink className="h-4 w-4" />
                      <a href={musician.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {musician.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {musician.socialLinks && musician.socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                  <div className="flex flex-wrap gap-3">
                    {musician.socialLinks.map((link: any, index: number) => {
                      const IconComponent = getSocialIcon(link.platform || 'external');
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="capitalize">{link.platform || 'External'}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Pictures */}
        {musician.additionalPictures && musician.additionalPictures.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musician.additionalPictures.map((picture: string, index: number) => {
                  // Calculate the correct index for the lightbox (profile picture + current index)
                  const lightboxIndex = (musician.profilePicture ? 1 : 0) + index;
                  return (
                    <div 
                      key={index} 
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => handleImageClick(lightboxIndex)}
                    >
                      <img
                        src={picture}
                        alt={`${displayName} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audio Section */}
        {musician.audioFiles && musician.audioFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Audio Samples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {musician.audioFiles.map((audioFile: string, index: number) => (
                  <div key={index}>
                    <p className="text-sm text-gray-600 mb-1">Sample {index + 1}</p>
                    <audio controls className="w-full">
                      <source src={audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{booking.venue?.name || 'Venue TBD'}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {booking.date && new Date(booking.date).toLocaleDateString()}
                    </p>
                    {booking.startTime && (
                      <p className="text-sm text-gray-600 mb-2">
                        {booking.startTime}{booking.endTime ? ` - ${booking.endTime}` : ''}
                      </p>
                    )}
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                      className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastBookings.slice(0, 6).map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{booking.venue?.name || 'Venue TBD'}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {booking.date && new Date(booking.date).toLocaleDateString()}
                    </p>
                    {booking.startTime && (
                      <p className="text-sm text-gray-600 mb-2">
                        {booking.startTime}{booking.endTime ? ` - ${booking.endTime}` : ''}
                      </p>
                    )}
                    {booking.totalAmount && (
                      <p className="text-sm font-medium text-green-600">
                        ${booking.totalAmount}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={allImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <Footer />
    </div>
  );
} 