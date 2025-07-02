import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ showBackButton = false, onBackClick }: HeaderProps) {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {showBackButton && (
              <button 
                onClick={onBackClick}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#4a5568',
                  marginRight: '0.5rem'
                }}
              >
                ←
              </button>
            )}
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              🎵
            </div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>
                Live Local Beats
              </h1>
            </Link>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
            <a href="#events" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Events</a>
            <a href="#musicians" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Musicians</a>
            <a href="#venues" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Venues</a>
            
            {/* Temporarily simplified navigation without authentication */}
            <Link 
              to="/sign-in"
              style={{
                padding: '0.5rem 1.5rem',
                background: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#667eea';
              }}
            >
              Login
            </Link>
            <Link 
              to="/sign-up"
              style={{
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 
