import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  // Auto-navigate to sign-in after 3 seconds for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // Matches the soft diagonal gradient from light blue/green to light peach/pink
    background: 'linear-gradient(135deg, #DFECEE 0%, #F5F7F6 40%, #F6E9E0 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'fadeInUp 0.8s ease forwards'
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: '800',
    color: '#347562', // Dark teal matching the box
    margin: '16px 0 8px 0',
    letterSpacing: '-1px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#5C5F68',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <div style={logoContainerStyle}>
        
        {/* Exact SVG Re-creation of the BFitIT Logo from the image */}
        <svg width="180" height="180" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {/* Outer dark teal box */}
          <rect x="0" y="0" width="120" height="120" rx="24" fill="#347562" />
          
          {/* Inner white box */}
          <rect x="12" y="12" width="96" height="96" rx="16" fill="#FFFFFF" />
          
          {/* Cyan/Green Head (Dot) */}
          <circle cx="72" cy="36" r="8" fill="#1FF29F" />
          
          {/* Black Upper Body / Arms */}
          <path 
            d="M 38 58 L 62 42 L 86 52" 
            stroke="#1B1E28" 
            strokeWidth="11" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
          
          {/* Cyan/Green Lower Body / Legs */}
          <path 
            d="M 36 84 L 60 64 L 74 78" 
            stroke="#1FF29F" 
            strokeWidth="11" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
        </svg>

        <h1 style={titleStyle}>BFitIT</h1>
        <p style={subtitleStyle}>Your AI Wellness & Fitness Companion</p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Splash;