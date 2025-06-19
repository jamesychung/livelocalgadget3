import React, { useState, useEffect } from "react";

interface HeroImage {
  id: number;
  url: string;
  alt: string;
  title: string;
}

const heroImages: HeroImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Live band performing on stage",
    title: "Live Music Experience"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Jazz musician playing saxophone",
    title: "Discover Amazing Talent"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Crowd enjoying live music at venue",
    title: "Connect Through Music"
  }
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ 
      position: 'relative',
      height: '60vh',
      minHeight: '400px',
      overflow: 'hidden'
    }}>
      {heroImages.map((image, index) => (
        <div
          key={image.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            backgroundImage: `url(${image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ maxWidth: '800px', padding: '0 2rem' }}>
              <h1 style={{ 
                fontSize: '3.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {image.title}
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '2rem',
                opacity: 0.9,
                lineHeight: '1.6',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                The ultimate platform connecting musicians, venues, and music lovers
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '1rem 2rem',
                  background: '#ffdf00',
                  color: '#1a202c',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 223, 0, 0.3)'
                }}>
                  Find Events
                </button>
                <button style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}>
                  Join as Musician
                </button>
                <button style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}>
                  List Your Venue
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Image indicators */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentImageIndex ? '#ffdf00' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          />
        ))}
      </div>
    </section>
  );
} 