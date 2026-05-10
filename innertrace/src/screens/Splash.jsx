import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    fontFamily: 'Inter, sans-serif',
    transition: 'var(--transition)'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'premiumFadeIn 1.2s ease-out forwards'
  };

  return (
    <div style={containerStyle}>
      <div style={logoContainerStyle}>
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', backgroundColor: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }}></div>
          <svg width="140" height="140" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
            <rect x="0" y="0" width="120" height="120" rx="32" fill="var(--color-primary)" />
            <rect x="12" y="12" width="96" height="96" rx="24" fill="white" />
            <circle cx="72" cy="36" r="8" fill="var(--color-primary)" />
            <path d="M 38 58 L 62 42 L 86 52" stroke="var(--color-primary-dark)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 36 84 L 60 64 L 74 78" stroke="var(--color-primary)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-1.5px' }}>InnerTrace</h1>
        <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-secondary)', margin: 0, opacity: 0.8 }}>Elevate your wellness with AI</p>
      </div>

      <style>{`
        @keyframes premiumFadeIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Splash;