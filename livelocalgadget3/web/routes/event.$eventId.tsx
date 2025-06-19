import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export default function EventDetails() {
  const params = useParams();
  const eventId = params?.eventId;
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    // Add a small delay to ensure router context is ready
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state if eventId is not available yet
  if (isLoading || !eventId) {
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
          <h2 style={{ color: '#1a202c', marginBottom: '1rem' }}>Loading Event...</h2>
          <p style={{ color: '#4a5568' }}>Please wait while we load the event information.</p>
        </div>
      </div>
    );
  }

  // Mock event data
  const eventData = {
    id: eventId,
    title: "Jazz Night at Blue Note",
    venue: "Blue Note Lounge",
    venueId: 1,
    musician: "Sarah Johnson Trio",
    musicianId: 1,
    date: "June 25, 2025",
    startTime: "8:00 PM",
    endTime: "11:00 PM",
    category: "Jazz",
    description: "An evening of smooth jazz featuring the Sarah Johnson Trio. Experience the magic of live jazz in an intimate setting with exceptional acoustics.",
    longDescription: "Join us for an unforgettable evening of jazz at the legendary Blue Note Lounge. Sarah Johnson, a celebrated jazz saxophonist with over 10 years of experience, will be performing with her trio featuring piano and bass.",
    image: "🎷",
    ticketPrice: "$25",
    ticketType: "General Admission",
    availableTickets: 45,
    totalCapacity: 150,
    status: "Confirmed",
    venueInfo: {
      name: "Blue Note Lounge",
      address: "131 W 3rd St, New York, NY 10012",
      phone: "(212) 475-8592",
      website: "www.bluenotelounge.com",
      amenities: ["Full Bar", "Food Service", "VIP Seating", "Sound System", "Parking"]
    },
    musicianInfo: {
      name: "Sarah Johnson",
      genre: "Jazz",
      bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country.",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      gigs: 127
    },
    setlist: [
      "Take Five (Dave Brubeck)",
      "So What (Miles Davis)",
      "Midnight Dreams (Original)",
      "Autumn Leaves (Jazz Standard)",
      "Blue in Green (Miles Davis)",
      "Smooth Operator (Original)"
    ],
    reviews: [
      {
        id: 1,
        user: "JazzLover42",
        rating: 5,
        comment: "Amazing performance! Sarah's saxophone playing was absolutely mesmerizing.",
        date: "June 15, 2025"
      },
      {
        id: 2,
        user: "MusicFan88",
        rating: 4,
        comment: "Great evening of jazz. The trio was tight and the atmosphere was perfect.",
        date: "June 10, 2025"
      }
    ],
    similarEvents: [
      {
        id: 2,
        title: "Blues Evening",
        venue: "Blue Note Lounge",
        date: "July 2, 2025",
        time: "8:30 PM - 11:30 PM",
        ticketPrice: "$30"
      },
      {
        id: 3,
        title: "Acoustic Night",
        venue: "Coffee House",
        date: "July 2, 2025",
        time: "7:00 PM - 9:30 PM",
        ticketPrice: "$20"
      }
    ]
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleBuyTickets = () => {
    window.location.href = `/tickets/${eventId}`;
  };

  const handleVenueClick = () => {
    window.location.href = `/venue/${eventData.venueId}`;
  };

  const handleMusicianClick = () => {
    window.location.href = `/musician/${eventData.musicianId}`;
  };

  const handleSimilarEventClick = (similarEventId: number) => {
    window.location.href = `/event/${similarEventId}`;
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
            gridTemplateColumns: '2fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
            alignItems: 'start'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  fontSize: '3rem',
                  marginRight: '1rem'
                }}>
                  {eventData.image}
                </div>
                <div>
                  <span style={{
                    background: '#e2e8f0',
                    color: '#4a5568',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {eventData.category}
                  </span>
                </div>
              </div>
              
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: '#1a202c',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                {eventData.title}
              </h1>
              
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#4a5568',
                marginBottom: '1rem'
              }}>
                <strong>{eventData.musician}</strong> at {eventData.venue}
              </p>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📅</span>
                  <span style={{ fontSize: '1.1rem', color: '#4a5568' }}>{eventData.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🕐</span>
                  <span style={{ fontSize: '1.1rem', color: '#4a5568' }}>{eventData.startTime} - {eventData.endTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎫</span>
                  <span style={{ fontSize: '1.1rem', color: '#4a5568' }}>{eventData.ticketType}</span>
                </div>
              </div>
              
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {eventData.description}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleVenueClick}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Venue
                </button>
                <button 
                  onClick={handleMusicianClick}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Musician
                </button>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              height: 'fit-content',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1a202c',
                marginBottom: '1rem'
              }}>
                Get Tickets
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#4a5568' }}>Price:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffdf00' }}>
                    {eventData.ticketPrice}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#4a5568' }}>Available:</span>
                  <span style={{ color: '#4a5568' }}>{eventData.availableTickets} of {eventData.totalCapacity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4a5568' }}>Status:</span>
                  <span style={{
                    background: eventData.status === 'Confirmed' ? '#c6f6d5' : '#fed7d7',
                    color: eventData.status === 'Confirmed' ? '#22543d' : '#742a2a',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {eventData.status}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleBuyTickets}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#ffdf00',
                  color: '#1a202c',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 223, 0, 0.3)',
                  marginBottom: '1rem'
                }}
              >
                Buy Tickets
              </button>
              
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#718096',
                textAlign: 'center'
              }}>
                Secure checkout • Instant confirmation • Mobile tickets
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  About This Event
                </h2>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#4a5568',
                  lineHeight: '1.6'
                }}>
                  {eventData.longDescription}
                </p>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  Setlist
                </h2>
                <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                  {eventData.setlist.map((song, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.75rem 0',
                      borderBottom: index < eventData.setlist.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <span style={{ 
                        background: '#ffdf00', 
                        color: '#1a202c',
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginRight: '1rem'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ fontSize: '1rem', color: '#4a5568' }}>{song}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  Reviews
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eventData.reviews.map(review => (
                    <div key={review.id} style={{
                      background: 'white',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#1a202c' }}>{review.user}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} style={{ color: '#ffdf00' }}>⭐</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>{review.comment}</p>
                      <span style={{ fontSize: '0.875rem', color: '#718096' }}>{review.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  Performing Artist
                </h2>
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={handleMusicianClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginRight: '1rem',
                      border: '2px solid #ffdf00'
                    }}>
                      <img 
                        src={eventData.musicianInfo.profilePic} 
                        alt={eventData.musicianInfo.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.25rem' }}>
                        {eventData.musicianInfo.name}
                      </h3>
                      <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>
                        {eventData.musicianInfo.genre}
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4a5568',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    {eventData.musicianInfo.bio}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#718096' }}>
                    <span>⭐ {eventData.musicianInfo.rating}</span>
                    <span>🎵 {eventData.musicianInfo.gigs} gigs</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  Venue
                </h2>
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={handleVenueClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                    {eventData.venueInfo.name}
                  </h3>
                  <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    📍 {eventData.venueInfo.address}
                  </p>
                  <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    📞 {eventData.venueInfo.phone}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {eventData.venueInfo.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} style={{
                        background: '#e2e8f0',
                        color: '#4a5568',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem'
                      }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '600', 
                  color: '#1a202c',
                  marginBottom: '1rem'
                }}>
                  Similar Events
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eventData.similarEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={() => handleSimilarEventClick(event.id)}
                      style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c', marginBottom: '0.25rem' }}>
                        {event.title}
                      </h4>
                      <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {event.venue}
                      </p>
                      <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        📅 {event.date} • 🕐 {event.time}
                      </p>
                      <span style={{ color: '#ffdf00', fontWeight: '600' }}>
                        {event.ticketPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 