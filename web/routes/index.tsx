import React from "react";
import { Link } from "react-router";
import Header from "../components/shared/Header";
import HeroSection from "../components/shared/HeroSection";
import EventCard from "../components/public/EventCard";
import MusicianCard from "../components/public/MusicianCard";
import VenueCard from "../components/public/VenueCard";

// Mock data for the frontend
const mockEvents = [
  {
    id: 1,
    title: "Jazz Night at The Blue Note",
    description: "An evening of smooth jazz featuring local talent",
    date: "June 15, 2024",
    startTime: "8:00 PM",
    endTime: "11:00 PM",
    venue: "The Blue Note",
    venueId: 1,
    musician: "Sarah Johnson Trio",
    musicianId: 1,
    image: "🎵",
    category: "Jazz"
  },
  {
    id: 2, 
    title: "Rock Revolution",
    description: "High-energy rock bands from the local scene",
    date: "June 20, 2024",
    startTime: "7:30 PM",
    endTime: "11:30 PM",
    venue: "The Rock House",
    venueId: 2,
    musician: "Thunder Road",
    musicianId: 2,
    image: "🎸",
    category: "Rock"
  },
  {
    id: 3,
    title: "Acoustic Evening",
    description: "Intimate acoustic performances in a cozy setting",
    date: "June 25, 2024", 
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "The Listening Room",
    venueId: 3,
    musician: "Emma Rodriguez",
    musicianId: 3,
    image: "🎻",
    category: "Acoustic"
  }
];

const mockMusicians = [
  {
    id: 1,
    name: "Sarah Johnson",
    genre: "Folk/Indie",
    location: "Downtown",
    image: "🎵",
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    rating: 4.8,
    gigs: 127
  },
  {
    id: 2,
    name: "Mike Chen",
    genre: "Blues/Rock",
    location: "Westside",
    image: "🎸",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    gigs: 89
  },
  {
    id: 3, 
    name: "Emma Rodriguez",
    genre: "Jazz/Classical",
    location: "Eastside",
    image: "🎻",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    rating: 4.7,
    gigs: 45
  }
];

const mockVenues = [
  {
    id: 1,
    name: "The Blue Note",
    type: "Jazz Club",
    location: "Downtown",
    image: "🎵",
    profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    capacity: 120,
    rating: 4.6
  },
  {
    id: 2,
    name: "The Rock House", 
    type: "Rock Venue",
    location: "Westside",
    image: "🎸",
    profilePic: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    capacity: 300,
    rating: 4.4
  },
  {
    id: 3,
    name: "The Listening Room",
    type: "Acoustic Venue",
    location: "Eastside",
    image: "🎻",
    profilePic: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop", 
    capacity: 80,
    rating: 4.8
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Events Section */}
        <section id="events" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-gray-600">Discover amazing live music in your area</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/events"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>

        {/* Musicians Section */}
        <section id="musicians" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Musicians</h2>
              <p className="text-lg text-gray-600">Connect with talented local artists</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockMusicians.map((musician) => (
                <MusicianCard key={musician.id} {...musician} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/musicians"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Browse All Musicians
              </Link>
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section id="venues" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Venues</h2>
              <p className="text-lg text-gray-600">Find the perfect place for your next event</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockVenues.map((venue) => (
                <VenueCard key={venue.id} {...venue} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/venues"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Explore All Venues
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join Live Local Beats and connect with your local music community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/sign-up"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Create Account
              </Link>
              <Link 
                to="/sign-in"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 