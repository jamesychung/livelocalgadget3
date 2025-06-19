import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export default function MusicianProfile() {
  const { musicianId } = useParams();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, []);

  // Mock musician data - in a real app, this would come from your API
  const musicianData = {
    id: musicianId,
    name: "Sarah Johnson",
    genre: "Jazz",
    location: "New York, NY",
    bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country. Specializing in smooth jazz and contemporary jazz fusion.",
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    gigs: 127,
    hourlyRate: "$150-200",
    instruments: ["Saxophone", "Piano", "Vocals"],
    availability: ["Weekends", "Evenings"],
    upcomingGigs: [
      {
        id: 1,
        venue: "Blue Note Lounge",
        date: "June 25, 2025",
        time: "8:00 PM - 11:00 PM",
        status: "Confirmed"
      },
      {
        id: 2,
        venue: "Jazz Corner",
        date: "July 2, 2025",
        time: "7:30 PM - 10:30 PM",
        status: "Pending"
      }
    ],
    pastGigs: [
      {
        id: 3,
        venue: "The Basement",
        date: "June 15, 2025",
        time: "9:00 PM - 12:00 AM",
        rating: 5.0
      },
      {
        id: 4,
        venue: "Soul Kitchen",
        date: "June 8, 2025",
        time: "8:30 PM - 11:30 PM",
        rating: 4.8
      }
    ],
    socialLinks: {
      instagram: "@sarahjazz",
      facebook: "Sarah Johnson Music",
      youtube: "Sarah Johnson Jazz"
    }
  };

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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Header showBackButton={true} onBackClick={handleBackClick} />

      {/* Musician Profile Section */}
      <section style={{ 
        padding: '2rem 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Profile Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'start'
          }}>
            {/* Profile Image and Basic Info */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                overflow: 'hidden',
                border: '4px solid #ffdf00',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }}>
                <img 
                  src={musicianData.profilePic} 
                  alt={musicianData.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1a202c',
                marginBottom: '0.5rem'
              }}>
                {musicianData.name}
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#4a5568',
                marginBottom: '0.5rem'
              }}>
                {musicianData.genre} • {musicianData.location}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.1rem', color: '#718096' }}>⭐ {musicianData.rating}</span>
                <span style={{ fontSize: '1.1rem', color: '#718096' }}>🎵 {musicianData.gigs} gigs</span>
              </div>
              <div style={{ 
                background: '#ffdf00', 
                color: '#1a202c',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {musicianData.hourlyRate}/hour
              </div>
            </div>

            {/* Bio and Action Buttons */}
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1a202c',
                marginBottom: '1rem'
              }}>
                About
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {musicianData.bio}
              </p>

              {/* Instruments and Availability */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    Instruments
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {musicianData.instruments.map((instrument, index) => (
                      <span key={index} style={{
                        background: '#e2e8f0',
                        color: '#4a5568',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    Availability
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {musicianData.availability.map((time, index) => (
                      <span key={index} style={{
                        background: '#e2e8f0',
                        color: '#4a5568',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleBookNow}
                  style={{
                    padding: '1rem 2rem',
                    background: '#ffdf00',
                    color: '#1a202c',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 223, 0, 0.3)'
                  }}
                >
                  Book Now
                </button>
                <button 
                  onClick={handleContact}
                  style={{
                    padding: '1rem 2rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Gigs */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Upcoming Gigs
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {musicianData.upcomingGigs.map(gig => (
                <div key={gig.id} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    {gig.venue}
                  </h3>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    📅 {gig.date}
                  </p>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    🕐 {gig.time}
                  </p>
                  <span style={{
                    background: gig.status === 'Confirmed' ? '#c6f6d5' : '#fed7d7',
                    color: gig.status === 'Confirmed' ? '#22543d' : '#742a2a',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {gig.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Past Gigs */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Recent Performances
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {musicianData.pastGigs.map(gig => (
                <div key={gig.id} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    {gig.venue}
                  </h3>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    📅 {gig.date}
                  </p>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    🕐 {gig.time}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#718096' }}>Rating:</span>
                    <span style={{ color: '#ffdf00', fontWeight: '600' }}>⭐ {gig.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Follow {musicianData.name}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(musicianData.socialLinks).map(([platform, handle]) => (
                <a 
                  key={platform}
                  href={`https://${platform}.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#667eea',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{platform}</span>
                  <span>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 