import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gray)', padding: '2rem 0', marginTop: 'auto' }}>
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} BFitIT. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <a href="#" style={{ color: 'var(--color-gray)' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--color-gray)' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--color-gray)' }}>Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
