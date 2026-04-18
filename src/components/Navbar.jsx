import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Dumbbell, Utensils, User } from 'lucide-react';

const Navbar = () => {
  const navStyle = {
    backgroundColor: '#F0995F',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '32px',
    height: '100%'
  };

  const navLinkStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    textDecoration: 'none',
    color: isActive ? '#347562' : '#1A1D2D',
    fontWeight: isActive ? '700' : '500',
    fontSize: '12px',
    position: 'relative',
    height: '100%',
    padding: '0 8px'
  });

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#347562', fontWeight: '800', fontSize: '20px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#347562', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
        </div>
        InnerTrace
      </div>

      <div style={linkContainerStyle}>
        <NavLink to="/home" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Home size={24} color={isActive ? '#347562' : '#1A1D2D'} fill={isActive ? '#347562' : 'none'} />
              <span>Home</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#347562', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>
        
        <NavLink to="/journal" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <BookOpen size={24} color={isActive ? '#347562' : '#1A1D2D'} />
              <span>Journal</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#347562', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/workouts" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Dumbbell size={24} color={isActive ? '#347562' : '#1A1D2D'} />
              <span>Workouts</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#347562', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/nutrition" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Utensils size={24} color={isActive ? '#347562' : '#1A1D2D'} />
              <span>Nutrition</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#347562', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/profile" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <User size={24} color={isActive ? '#347562' : '#1A1D2D'} />
              <span>Profile</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#347562', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;