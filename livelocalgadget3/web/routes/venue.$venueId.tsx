import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useFindMany, useFindOne } from "@gadgetinc/react";
import { api } from "../api";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, MapPin, Calendar, Clock, Music, DollarSign, ArrowLeft, ExternalLink, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Linkedin, Users, Building } from "lucide-react";
import { ImageLightbox } from "../components/shared/ImageLightbox";

interface VenueData {
  id: string;
  name?: string;
  type?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  profilePicture?: string;
  rating?: number;
  capacity?: number;
  priceRange?: string;
  genres?: string[];
  amenities?: string[];
  additionalPictures?: string[];
  socialLinks?: any[];
  phone?: string;
  email?: string;
  website?: string;
  hours?: any;
  isActive?: boolean;
  isVerified?: boolean;
}

interface EventData {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  ticketPrice?: number;
  status?: string;
  musician?: {
    id: string;
    name?: string;
    stageName?: string;
  };
}

export default function VenueProfile() {
  const { venueId } = useParams();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    console.log("VenueProfile - venueId:", venueId);
  }, [venueId]);

  // Fetch real venue data from database
  const [{ data: venueData, fetching: venueFetching, error: venueError }] = useFindOne(api.venue, venueId || "", {
    pause: !venueId,
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
      profilePicture: true,
      rating: true,
      capacity: true,
      priceRange: true,
      genres: true,
      amenities: true,
      additionalPictures: true,
      socialLinks: true,
      phone: true,
      email: true,
      website: true,
      hours: true,
      isActive: true,
      isVerified: true,
    }
  });

  // Debug logging
  useEffect(() => {
    if (venueError) {
      console.error("Venue fetch error:", venueError);
    }
    if (venueData) {
      console.log("Venue data received:", venueData);
    }
  }, [venueError, venueData]);

  // Fetch events for this venue
  const [{ data: eventsData, fetching: eventsFetching }] = useFindMany(api.event, {
    filter: { venue: { id: { equals: venueId } } },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      startTime: true,
      endTime: true,
      ticketPrice: true,
      status: true,
      musician: {
        id: true,
        name: true,
        stageName: true,
      }
    },
    pause: !venueId,
  });

  const handleBackClick = () => {
    window.history.back();
  };

  const handleBookMusician = () => {
    // Navigate to booking page
    window.location.href = `/booking/venue/${venueId}`;
  };

  const handleContact = () => {
    // Navigate to contact page
    window.location.href = `/contact/venue/${venueId}`;
  };

  const handleViewEvent = (eventId: string) => {
    window.location.href = `/event/${eventId}`;
  };

  // Show loading state
  if (venueFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header showBackButton={true} onBackClick={handleBackClick} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading venue profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (venueError || !venueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header showBackButton={true} onBackClick={handleBackClick} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Venue Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The venue profile you're looking for doesn't exist or has been removed.
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

  const venue: VenueData = venueData;
  const events: EventData[] = eventsData || [];
  
  // Separate upcoming and past events
  const upcomingEvents = events.filter(event => 
    event.date && new Date(event.date) > new Date()
  );
  const pastEvents = events.filter(event => 
    event.date && new Date(event.date) <= new Date()
  );

  // Format location
  const location = [venue.city, venue.state, venue.country]
    .filter(Boolean)
    .join(", ");

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

  // Prepare all images for lightbox
  useEffect(() => {
    if (venue) {
      const images: string[] = [];
      
      // Add profile picture if it exists
      if (venue.profilePicture) {
        images.push(venue.profilePicture);
      }
      
      // Add additional pictures if they exist
      if (venue.additionalPictures && venue.additionalPictures.length > 0) {
        images.push(...venue.additionalPictures);
      }
      
      setAllImages(images);
    }
  }, [venue]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header showBackButton={true} onBackClick={handleBackClick} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div 
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => venue.profilePicture && handleImageClick(0)}
                >
                  <img 
                    src={venue.profilePicture || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                    alt={venue.name || "Venue"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {venue.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <Star className="h-4 w-4 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{venue.name || "Venue"}</h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                  {venue.type && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Building className="mr-1 h-3 w-3" />
                      {venue.type}
                    </Badge>
                  )}
                  {location && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <MapPin className="mr-1 h-3 w-3" />
                      {location}
                    </Badge>
                  )}
                  {venue.isActive !== false && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/30">
                      Open
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  {venue.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                      <span>{venue.rating}</span>
                    </div>
                  )}
                  {venue.capacity && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{venue.capacity} capacity</span>
                    </div>
                  )}
                  {venue.priceRange && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{venue.priceRange}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleBookMusician}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                >
                  Book Musician
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

          {/* Description Section */}
          <CardContent className="p-8">
            {venue.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {venue.capacity && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{venue.capacity}</div>
                  <div className="text-sm text-gray-600">Capacity</div>
                </div>
              )}
              {venue.rating && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{venue.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              )}
              {venue.priceRange && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{venue.priceRange}</div>
                  <div className="text-sm text-gray-600">Price Range</div>
                </div>
              )}
            </div>

            {/* Genres and Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {venue.genres && venue.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Music Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.genres.map((genre: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        <Music className="mr-1 h-3 w-3" />
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {venue.amenities && venue.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {amenity}
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
                  {venue.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{venue.phone}</span>
                    </div>
                  )}
                  {venue.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{venue.email}</span>
                    </div>
                  )}
                  {venue.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <ExternalLink className="h-4 w-4" />
                      <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {venue.website}
                      </a>
                    </div>
                  )}
                  {venue.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{venue.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {venue.socialLinks && venue.socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                  <div className="flex flex-wrap gap-3">
                    {venue.socialLinks.map((link: any, index: number) => {
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
        {venue.additionalPictures && venue.additionalPictures.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venue.additionalPictures.map((picture: string, index: number) => {
                  // Calculate the correct index for the lightbox (profile picture + current index)
                  const lightboxIndex = (venue.profilePicture ? 1 : 0) + index;
                  return (
                    <div 
                      key={index} 
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => handleImageClick(lightboxIndex)}
                    >
                      <img
                        src={picture}
                        alt={`${venue.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hours of Operation */}
        {venue.hours && Object.keys(venue.hours).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hours of Operation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(venue.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center p-2 border-b border-gray-100">
                    <span className="font-medium capitalize">{day}:</span>
                    <span className="text-gray-600">{hours as string}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewEvent(event.id)}
                  >
                    <h4 className="font-semibold mb-2">{event.title || 'Untitled Event'}</h4>
                    {event.musician && (
                      <p className="text-sm text-gray-600 mb-1">
                        {event.musician.stageName || event.musician.name || 'Musician TBD'}
                      </p>
                    )}
                    {event.date && (
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}
                    {event.startTime && (
                      <p className="text-sm text-gray-600 mb-2">
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                        className={event.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {event.status || 'pending'}
                      </Badge>
                      {event.ticketPrice && (
                        <span className="text-sm font-medium text-green-600">
                          ${event.ticketPrice}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.slice(0, 6).map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewEvent(event.id)}
                  >
                    <h4 className="font-semibold mb-2">{event.title || 'Untitled Event'}</h4>
                    {event.musician && (
                      <p className="text-sm text-gray-600 mb-1">
                        {event.musician.stageName || event.musician.name || 'Musician TBD'}
                      </p>
                    )}
                    {event.date && (
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}
                    {event.startTime && (
                      <p className="text-sm text-gray-600 mb-2">
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                      </p>
                    )}
                    {event.ticketPrice && (
                      <p className="text-sm font-medium text-green-600">
                        ${event.ticketPrice}
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