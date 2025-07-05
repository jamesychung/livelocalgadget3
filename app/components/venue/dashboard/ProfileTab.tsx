import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  DollarSign, 
  Star, 
  Edit,
  Camera,
  Music,
  Wifi,
  Car,
  Mic,
  Volume2,
  Lightbulb,
  Coffee,
  Utensils,
  Shield,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { VenueProfile, Review } from "./types";

interface ProfileTabProps {
  venue: VenueProfile;
  reviews: Review[];
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ venue, reviews }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : venue.rating || 0;

  // Get social media icon
  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('stage')) return <Music className="h-4 w-4" />;
    if (amenityLower.includes('pa') || amenityLower.includes('sound')) return <Volume2 className="h-4 w-4" />;
    if (amenityLower.includes('mic')) return <Mic className="h-4 w-4" />;
    if (amenityLower.includes('light')) return <Lightbulb className="h-4 w-4" />;
    if (amenityLower.includes('parking')) return <Car className="h-4 w-4" />;
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('bar') || amenityLower.includes('drink')) return <Coffee className="h-4 w-4" />;
    if (amenityLower.includes('food') || amenityLower.includes('kitchen')) return <Utensils className="h-4 w-4" />;
    if (amenityLower.includes('security')) return <Shield className="h-4 w-4" />;
    return <Building className="h-4 w-4" />;
  };

  // Format contact name
  const getContactName = () => {
    const firstName = (venue as any).contact_first_name || '';
    const lastName = (venue as any).contact_last_name || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return null;
  };

  // Get all images for gallery
  const allImages = [
    venue.profile_picture,
    ...(venue.additional_pictures || [])
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header Section with Edit Button */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">{venue.name}</h2>
          <p className="text-gray-600 mt-1">Venue Profile</p>
        </div>
        <Button asChild>
          <Link to="/venue-profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Image Gallery */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                  <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                    {allImages.length > 0 ? (
                      <img
                        src={allImages[selectedImageIndex]}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No images uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {allImages.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index 
                            ? 'border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${venue.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Capacity</span>
                <span className="font-medium">{venue.capacity || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-medium">{venue.total_events || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="font-medium">{reviews.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Venue Type</label>
                  <p className="font-medium">{(venue as any).venue_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Range</label>
                  <p className="font-medium">{venue.price_range || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Capacity</label>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {venue.capacity || 'Not specified'}
                  </p>
                </div>
              </div>

              {venue.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-700 leading-relaxed">{venue.description}</p>
                </div>
              )}

              {/* Genres */}
              {(venue as any).genres && (venue as any).genres.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Genres</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(venue as any).genres.map((genre: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(venue as any).amenities && (venue as any).amenities.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Amenities</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {(venue as any).amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getContactName() && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="font-medium">{getContactName()}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${venue.email}`} className="text-blue-600 hover:underline">
                      {venue.email}
                    </a>
                  </p>
                </div>
                {venue.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${venue.phone}`} className="text-blue-600 hover:underline">
                        {venue.phone}
                      </a>
                    </p>
                  </div>
                )}
                {venue.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={venue.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {venue.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="font-medium">{venue.address}</p>
                  </div>
                )}
                {venue.city && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="font-medium">{venue.city}</p>
                  </div>
                )}
                {venue.state && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">State/Province</label>
                    <p className="font-medium">{venue.state}</p>
                  </div>
                )}
                {venue.zip && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">ZIP/Postal Code</label>
                    <p className="font-medium">{venue.zip}</p>
                  </div>
                )}
                {venue.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="font-medium">{venue.country}</p>
                  </div>
                )}
              </div>
              
              {/* Full Address */}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  {[venue.address, venue.city, venue.state, venue.zip, venue.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          {(venue as any).social_links && (venue as any).social_links.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(venue as any).social_links.map((link: {platform: string, url: string}, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="font-medium capitalize">{link.platform}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-gray-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reviews */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.reviewer?.first_name} {review.reviewer?.last_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 