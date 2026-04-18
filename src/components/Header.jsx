import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Activity color="var(--color-orange)" size={32} />
          BFitIT
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-gray)' }}>Your AI-Powered Wellness Companion</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
