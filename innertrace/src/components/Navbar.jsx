import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Dumbbell, Utensils, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const navStyle = {
    backgroundColor: 'var(--bg-secondary)',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
    boxShadow: 'var(--shadow-sm)',
    borderBottom: '1px solid var(--border-primary)',
    transition: 'var(--transition)'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '32px',
    height: '100%',
    alignItems: 'center'
  };

  const navLinkStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
    fontWeight: isActive ? '700' : '500',
    fontSize: '12px',
    position: 'relative',
    height: '100%',
    padding: '0 8px',
    transition: 'var(--transition)'
  });

  const toggleButtonStyle = {
    background: 'none',
    border: '1px solid var(--border-primary)',
    borderRadius: '12px',
    padding: '8px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '16px',
    transition: 'var(--transition)'
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '800', fontSize: '20px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '10px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
        </div>
        InnerTrace
      </div>

      <div style={linkContainerStyle}>
        <NavLink to="/home" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Home size={22} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} fill={isActive ? 'var(--color-primary)' : 'none'} fillOpacity={0.1} />
              <span>Home</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>
        
        <NavLink to="/journal" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <BookOpen size={22} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
              <span>Journal</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/workouts" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Dumbbell size={22} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
              <span>Workouts</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/nutrition" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <Utensils size={22} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
              <span>Nutrition</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/profile" style={({ isActive }) => navLinkStyle(isActive)}>
          {({ isActive }) => (
            <>
              <User size={22} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
              <span>Profile</span>
              {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}></div>}
            </>
          )}
        </NavLink>

        <button onClick={toggleTheme} style={toggleButtonStyle} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;