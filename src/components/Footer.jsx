import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#F0995F', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1A1D2D', fontWeight: 'bold', fontSize: '18px' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#347562', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <span style={{ fontSize: '10px' }}>⚡</span>
        </div>
        InnerTrace
      </div>
      
      <div style={{ color: '#1A1D2D', fontSize: '13px', fontWeight: '500' }}>
        © 2026 InnerTrace. Your AI-Powered Wellness Companion.
      </div>

      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: '600', color: '#1A1D2D' }}>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</a>
      </div>
    </footer>
  );
};

export default Footer;