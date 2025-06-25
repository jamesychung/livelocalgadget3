import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export default function VenueProfile() {
  const params = useParams();
  const venueId = params?.venueId;
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    // Add a small delay to ensure router context is ready
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state if venueId is not available yet
  if (isLoading || !venueId) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1a202c', marginBottom: '1rem' }}>Loading Venue...</h2>
          <p style={{ color: '#4a5568' }}>Please wait while we load the venue information.</p>
        </div>
      </div>
    );
  }

  // Mock venue data
  const venueData = {
    id: venueId,
    name: "Blue Note Lounge",
    type: "Jazz Club",
    location: "New York, NY",
    address: "131 W 3rd St, New York, NY 10012",
    bio: "A legendary jazz venue in Greenwich Village, Blue Note Lounge has been hosting world-class musicians since 1981. Known for its intimate atmosphere and exceptional acoustics.",
    profilePic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    capacity: 150,
    priceRange: "$$",
    genres: ["Jazz", "Blues", "Soul", "Fusion"],
    amenities: ["Full Bar", "Food Service", "VIP Seating", "Sound System", "Parking"],
    upcomingEvents: [
      {
        id: 1,
        title: "Jazz Night with Sarah Johnson",
        musician: "Sarah Johnson Trio",
        date: "June 25, 2025",
        time: "8:00 PM - 11:00 PM",
        status: "Confirmed",
        ticketPrice: "$25"
      },
      {
        id: 2,
        title: "Blues Evening",
        musician: "The Blues Brothers",
        date: "July 2, 2025",
        time: "8:30 PM - 11:30 PM",
        status: "Confirmed",
        ticketPrice: "$30"
      }
    ],
    pastEvents: [
      {
        id: 4,
        title: "Jazz Fusion Night",
        musician: "Fusion Collective",
        date: "June 15, 2025",
        time: "9:00 PM - 12:00 AM",
        rating: 4.9,
        attendance: 120
      }
    ],
    contactInfo: {
      phone: "(212) 475-8592",
      email: "info@bluenotelounge.com",
      website: "www.bluenotelounge.com"
    },
    socialLinks: {
      instagram: "@bluenotelounge",
      facebook: "Blue Note Lounge NYC",
      twitter: "@BlueNoteNYC"
    },
    hours: {
      monday: "Closed",
      tuesday: "6:00 PM - 2:00 AM",
      wednesday: "6:00 PM - 2:00 AM",
      thursday: "6:00 PM - 2:00 AM",
      friday: "6:00 PM - 2:00 AM",
      saturday: "6:00 PM - 2:00 AM",
      sunday: "6:00 PM - 12:00 AM"
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleBookMusician = () => {
    window.location.href = `/booking/venue/${venueId}`;
  };

  const handleContact = () => {
    window.location.href = `/contact/venue/${venueId}`;
  };

  const handleViewEvent = (eventId: number) => {
    window.location.href = `/event/${eventId}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Header showBackButton={true} onBackClick={handleBackClick} />

      <section style={{ 
        padding: '2rem 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'start'
          }}>
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
                  src={venueData.profilePic} 
                  alt={venueData.name}
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
                {venueData.name}
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#4a5568',
                marginBottom: '0.5rem'
              }}>
                {venueData.type} • {venueData.location}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.1rem', color: '#718096' }}>⭐ {venueData.rating}</span>
                <span style={{ fontSize: '1.1rem', color: '#718096' }}>👥 {venueData.capacity} capacity</span>
              </div>
              <div style={{ 
                background: '#ffdf00', 
                color: '#1a202c',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {venueData.priceRange}
              </div>
            </div>

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
                {venueData.bio}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    Music Genres
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {venueData.genres.map((genre, index) => (
                      <span key={index} style={{
                        background: '#e2e8f0',
                        color: '#4a5568',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    Amenities
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {venueData.amenities.map((amenity, index) => (
                      <span key={index} style={{
                        background: '#e2e8f0',
                        color: '#4a5568',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleBookMusician}
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
                  Book Musician
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

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Upcoming Events
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {venueData.upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  onClick={() => handleViewEvent(event.id)}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    {event.title}
                  </h3>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {event.musician && typeof event.musician === 'object' ? (event.musician as any)?.name || 'Unknown Musician' : String(event.musician || 'Unknown Musician')}
                  </p>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    📅 {event.date}
                  </p>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    🕐 {event.time}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: event.status === 'Confirmed' ? '#c6f6d5' : '#fed7d7',
                      color: event.status === 'Confirmed' ? '#22543d' : '#742a2a',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {event.status}
                    </span>
                    <span style={{ color: '#ffdf00', fontWeight: '600', fontSize: '1.1rem' }}>
                      {event.ticketPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '600', 
                color: '#1a202c',
                marginBottom: '1.5rem'
              }}>
                Contact Information
              </h2>
              <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  📞 <strong>Phone:</strong> {venueData.contactInfo.phone}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  📧 <strong>Email:</strong> {venueData.contactInfo.email}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  🌐 <strong>Website:</strong> {venueData.contactInfo.website}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  📍 <strong>Address:</strong> {venueData.address}
                </p>
              </div>
            </div>

            <div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '600', 
                color: '#1a202c',
                marginBottom: '1.5rem'
              }}>
                Hours of Operation
              </h2>
              <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                {Object.entries(venueData.hours).map(([day, hours]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{day}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              color: '#1a202c',
              marginBottom: '1.5rem'
            }}>
              Follow {venueData.name}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(venueData.socialLinks).map(([platform, handle]) => (
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