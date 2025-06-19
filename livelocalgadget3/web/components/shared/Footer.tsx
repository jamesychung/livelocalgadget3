import React from "react";

export default function Footer() {
  return (
    <footer style={{ 
      background: '#1a202c',
      color: 'white',
      padding: '3rem 1rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            🎵
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            Live Local Beats
          </h3>
        </div>
        <p style={{ color: '#a0aec0', marginBottom: '2rem' }}>
          Connecting musicians, venues, and music lovers since 2025
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <a href="/" style={{ color: '#a0aec0', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>About</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>Contact</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: '#a0aec0', textDecoration: 'none' }}>Terms</a>
        </div>
        <p style={{ color: '#718096', fontSize: '0.875rem' }}>
          © 2025 Live Local Beats. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 