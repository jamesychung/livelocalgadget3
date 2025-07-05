import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Music, 
  DollarSign,
  Star,
  Edit3,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MusicianProfile {
  id: string;
  stage_name: string;
  email: string;
  phone?: string;
  bio?: string;
  genres?: string[];
  city?: string;
  state?: string;
  website?: string;
  profile_picture?: string;
  base_rate?: number;
  travel_radius?: number;
}

interface ProfileTabProps {
  musician: MusicianProfile;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ musician }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock data for images and reviews - in real app, this would come from props
  const images = [
    musician.profile_picture || '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ].filter(Boolean);

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: "Amazing performance! The crowd loved every minute.",
      venue_name: "Blue Note Café",
      date: "2024-01-15"
    },
    {
      id: 2,
      rating: 4,
      comment: "Great energy and professional setup. Would book again.",
      venue_name: "The Underground",
      date: "2024-01-08"
    }
  ];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    } else {
      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  };

  const renderStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Images and Quick Stats */}
      <div className="lg:col-span-1 space-y-6">
        {/* Image Gallery */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Photos</CardTitle>
              <Link to="/musician-profile/edit">
                <Button variant="ghost" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`${musician.stage_name} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => navigateImage('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => navigateImage('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${musician.stage_name} - Thumbnail ${index + 1}`}
                      className={`w-full h-16 object-cover rounded cursor-pointer transition-opacity ${
                        index === currentImageIndex ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating</span>
              <div className="flex items-center gap-1">
                {renderStarRating(Math.round(averageRating))}
                <span className="text-sm text-gray-600 ml-1">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
            
            {musician.base_rate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Rate</span>
                <span className="font-medium">${musician.base_rate}</span>
              </div>
            )}
            
            {musician.travel_radius && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Travel Radius</span>
                <span className="font-medium">{musician.travel_radius} miles</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Performances</span>
              <span className="font-medium">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Detailed Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <Link to="/musician-profile/edit">
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Stage Name</label>
                <p className="text-gray-900">{musician.stage_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">
                  {musician.city && musician.state 
                    ? `${musician.city}, ${musician.state}`
                    : musician.city || musician.state || 'Not specified'
                  }
                </p>
              </div>
            </div>
            
            {musician.bio && (
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-gray-900 mt-1">{musician.bio}</p>
              </div>
            )}
            
            {musician.genres && musician.genres.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600">Genres</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {musician.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{musician.email}</p>
                </div>
              </div>
              
              {musician.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{musician.phone}</p>
                  </div>
                </div>
              )}
              
              {musician.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Website</label>
                    <a 
                      href={musician.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {musician.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStarRating(review.rating)}
                        </div>
                        <span className="font-medium">{review.venue_name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 