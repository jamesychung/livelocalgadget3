import { useState, useEffect } from "react";
import { Link } from "react-router";
import Footer from "../components/shared/Footer";
import HeroSection from "../components/shared/HeroSection";
import EventCard from "../components/public/EventCard";
import MusicianCard from "../components/public/MusicianCard";
import VenueCard from "../components/public/VenueCard";
import SeedDataButton from "../components/shared/SeedDataButton";
import DatabaseTest from "../components/shared/DatabaseTest";

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, []);

  // Navigation handlers
  const handleMusicianClick = (musicianId: number) => {
    // Navigate to musician dashboard/profile
    window.location.href = `/musician/${musicianId}`;
  };

  const handleVenueClick = (venueId: number) => {
    // Navigate to venue dashboard/profile
    window.location.href = `/venue/${venueId}`;
  };

  const handleEventClick = (eventId: number) => {
    // Navigate to event details
    window.location.href = `/event/${eventId}`;
  };

  // Mock data for demonstration
  const upcomingEvents = [
    {
      id: 1,
      title: "Jazz Night at Blue Note",
      venue: "Blue Note Lounge",
      venueId: 1,
      musician: "Sarah Johnson Trio",
      musicianId: 1,
      date: "June 25, 2025",
      startTime: "8:00 PM",
      endTime: "11:00 PM",
      image: "🎷",
      category: "Jazz",
      description: "An evening of smooth jazz featuring the Sarah Johnson Trio"
    },
    {
      id: 2,
      title: "Rock Revolution",
      venue: "The Basement",
      venueId: 2,
      musician: "Thunder Road",
      musicianId: 2,
      date: "June 28, 2025",
      startTime: "9:30 PM",
      endTime: "1:00 AM",
      image: "🎸",
      category: "Rock",
      description: "High-energy rock performance by Thunder Road"
    },
    {
      id: 3,
      title: "Acoustic Evening",
      venue: "Coffee House",
      venueId: 3,
      musician: "Emma Davis",
      musicianId: 3,
      date: "July 2, 2025",
      startTime: "7:00 PM",
      endTime: "9:30 PM",
      image: "🎤",
      category: "Acoustic",
      description: "Intimate acoustic performance by Emma Davis"
    },
    {
      id: 4,
      title: "Blues & Soul",
      venue: "Soul Kitchen",
      venueId: 4,
      musician: "The Blues Brothers",
      musicianId: 4,
      date: "July 5, 2025",
      startTime: "8:30 PM",
      endTime: "11:30 PM",
      image: "🎵",
      category: "Blues",
      description: "Authentic blues and soul music experience"
    }
  ];

  const featuredMusicians = [
    {
      id: 1,
      name: "Sarah Johnson",
      genre: "Jazz",
      location: "New York, NY",
      image: "🎷",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      gigs: 127
    },
    {
      id: 2,
      name: "Thunder Road",
      genre: "Rock",
      location: "Los Angeles, CA",
      image: "🎸",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      gigs: 89
    },
    {
      id: 3,
      name: "Emma Davis",
      genre: "Acoustic",
      location: "Nashville, TN",
      image: "🎤",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      gigs: 156
    },
    {
      id: 4,
      name: "The Blues Brothers",
      genre: "Blues",
      location: "Chicago, IL",
      image: "🎵",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      gigs: 203
    }
  ];

  const featuredVenues = [
    {
      id: 1,
      name: "Blue Note Lounge",
      type: "Jazz Club",
      location: "New York, NY",
      image: "🎷",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      capacity: 150,
      rating: 4.8
    },
    {
      id: 2,
      name: "The Basement",
      type: "Rock Venue",
      location: "Los Angeles, CA",
      image: "🎸",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      capacity: 300,
      rating: 4.7
    },
    {
      id: 3,
      name: "Coffee House",
      type: "Acoustic Venue",
      location: "Nashville, TN",
      image: "☕",
      profilePic: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      capacity: 80,
      rating: 4.9
    },
    {
      id: 4,
      name: "Soul Kitchen",
      type: "Blues Club",
      location: "Chicago, IL",
      image: "🎵",
      profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      capacity: 200,
      rating: 4.6
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <HeroSection />

      {/* Database Test Section */}
      <section style={{ 
        padding: '2rem 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1a202c',
              marginBottom: '0.5rem'
            }}>
              Database Test
            </h2>
            <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>
              Current time: {currentTime}
            </p>
          </div>
          <DatabaseTest />
          <SeedDataButton />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" style={{ 
        padding: '4rem 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1a202c',
              marginBottom: '1rem'
            }}>
              Upcoming Events
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover amazing live music happening near you
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {upcomingEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={handleEventClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Musicians Section */}
      <section id="musicians" style={{ 
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #ffdf00 0%, #fbbf24 100%)',
        color: '#1a202c'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Featured Musicians
            </h2>
            <p style={{ 
              fontSize: '1.1rem',
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover talented artists ready to perform at your venue
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {featuredMusicians.map(musician => (
              <MusicianCard 
                key={musician.id} 
                musician={musician} 
                onClick={handleMusicianClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section id="venues" style={{ 
        padding: '4rem 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1a202c',
              marginBottom: '1rem'
            }}>
              Featured Venues
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Amazing venues looking for talented musicians
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {featuredVenues.map(venue => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onClick={handleVenueClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Join thousands of musicians and venues already using Live Local Beats
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/sign-up"
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </Link>
            <button style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}