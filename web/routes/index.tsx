import { Link } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import HeroSection from "../components/shared/HeroSection";
import EventCard from "../components/public/EventCard";
import MusicianCard from "../components/public/MusicianCard";
import VenueCard from "../components/public/VenueCard";
import SeedDataButton from "../components/shared/SeedDataButton";
import DatabaseTest from "../components/shared/DatabaseTest";

export default function HomePage() {
  // Mock data for demonstration
  const upcomingEvents = [
    {
      id: 1,
      title: "Jazz Night at Blue Note",
      date: "June 25, 2025",
      startTime: "8:00 PM",
      endTime: "11:00 PM",
      venue: "Blue Note Lounge",
      venueId: 1,
      musician: "Sarah Johnson Trio",
      musicianId: 1,
      image: "🎵",
      category: "Jazz",
      description: "An evening of smooth jazz featuring the Sarah Johnson Trio."
    },
    {
      id: 2, 
      title: "Rock Revolution",
      date: "June 28, 2025",
      startTime: "9:30 PM",
      endTime: "12:30 AM",
      venue: "The Basement",
      venueId: 2,
      musician: "Thunder Road",
      musicianId: 2,
      image: "🎸",
      category: "Rock",
      description: "High-energy rock performance by Thunder Road."
    },
    {
      id: 3,
      title: "Classical Evening",
      date: "July 2, 2025", 
      startTime: "7:30 PM",
      endTime: "10:30 PM",
      venue: "The Grand Hall",
      venueId: 3,
      musician: "The Classical Quartet",
      musicianId: 3,
      image: "🎻",
      category: "Classical",
      description: "Professional string quartet performing classical masterpieces."
    }
  ];

  const featuredMusicians = [
    {
      id: 1,
      name: "Sarah Johnson",
      genre: "Jazz",
      image: "🎵",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      location: "New York, NY",
      gigs: 127
    },
    {
      id: 2,
      name: "Thunder Road",
      genre: "Rock",
      image: "🎸",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      location: "Los Angeles, CA",
      gigs: 89
    },
    {
      id: 3,
      name: "The Classical Quartet",
      genre: "Classical",
      image: "🎻",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      location: "Chicago, IL",
      gigs: 45
    }
  ];

  const featuredVenues = [
    {
      id: 1,
      name: "Blue Note Lounge",
      type: "Jazz Club",
      image: "🎵",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      location: "New York, NY",
      capacity: 150
    },
    {
      id: 2,
      name: "The Basement",
      type: "Rock Venue",
      image: "🎸",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      location: "Los Angeles, CA",
      capacity: 300
    },
    {
      id: 3,
      name: "The Grand Hall",
      type: "Concert Hall",
      image: "🎻",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      location: "Chicago, IL",
      capacity: 500
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection />
      
      {/* Database Test Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Database Connection Test
          </h2>
          <DatabaseTest />
        </div>
      </section>
      
      {/* Quick Seed Button - Remove this after seeding */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">Quick Setup</h3>
            <p className="text-yellow-700 mb-4">Click the button below to quickly seed your database with sample data:</p>
            <SeedDataButton />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => window.location.href = `/events/${event.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Musicians Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Musicians
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMusicians.map((musician) => (
              <MusicianCard 
                key={musician.id} 
                musician={musician} 
                onClick={() => window.location.href = `/musicians/${musician.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Venues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVenues.map((venue) => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onClick={() => window.location.href = `/venues/${venue.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 