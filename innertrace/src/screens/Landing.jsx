import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Shield, Heart, Dumbbell, TrendingUp, Brain, Check, Star } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const containerStyle = {
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-primary)',
    overflowX: 'hidden',
    transition: 'var(--transition)'
  };

  const navStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid var(--border-primary)'
  };

  const sectionStyle = {
    padding: '120px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  };

  const heroStyle = {
    ...sectionStyle,
    background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.05) 0%, transparent 40%)',
    paddingTop: '160px',
    paddingBottom: '160px'
  };

  const badgeStyle = {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    padding: '8px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    border: '1px solid var(--color-primary)'
  };

  const titleStyle = {
    fontSize: '72px',
    fontWeight: '900',
    lineHeight: '1',
    margin: '0 0 32px 0',
    letterSpacing: '-2px',
    color: 'var(--text-primary)'
  };

  const subtitleStyle = {
    color: 'var(--text-secondary)',
    fontSize: '20px',
    maxWidth: '700px',
    lineHeight: '1.6',
    margin: '0 0 48px 0',
    fontWeight: '500'
  };

  const primaryBtnStyle = {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    transition: 'var(--transition)'
  };

  const secondaryBtnStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '20px',
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'var(--transition)'
  };

  const featureCardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    padding: '48px',
    borderRadius: '32px',
    border: '1px solid var(--border-primary)',
    textAlign: 'left',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div style={containerStyle}>
      
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontWeight: '900', fontSize: '24px', letterSpacing: '-1px' }}>
          <Brain size={32} /> InnerTrace
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button onClick={() => navigate('/signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px' }}>Log In</button>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>Join Free</button>
        </div>
      </nav>

      <section style={heroStyle}>
        <div style={badgeStyle}>
          <Sparkles size={16} /> The Future of Personal Wellness
        </div>
        <h1 style={titleStyle}>
          Your Mind, Body & Soul <br/>
          <span style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Synchronized</span>
        </h1>
        <p style={subtitleStyle}>
          Experience the world's first AI-integrated wellness sanctuary. We blend advanced neural insights with holistic tracking to help you achieve peak vitality.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '64px' }}>
          <button onClick={() => navigate('/signup')} style={primaryBtnStyle}>
            Get Started <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/signin')} style={secondaryBtnStyle}>
            Explore Platform
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '700' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="var(--color-primary)" /> Top Rated 2024</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} color="var(--color-primary)" /> Military-Grade Privacy</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Brain size={18} color="var(--color-primary)" /> Neural AI Insights</span>
        </div>
      </section>

      <section style={{ ...sectionStyle, backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1.5px' }}>Unified Wellness</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', margin: '0 0 64px 0', fontWeight: '500' }}>One platform. Infinite possibilities for growth.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', maxWidth: '1200px', width: '100%' }}>
          
          <div style={featureCardStyle}>
            <div style={{ width: 64, height: 64, borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0' }}>Neural Journaling</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>Advanced sentiment analysis that tracks your emotional resonance and suggests cognitive shifts.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ width: 64, height: 64, borderRadius: '20px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Dumbbell size={32} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0' }}>Elite Coaching</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>Hyper-personalized workout architectures that adapt in real-time to your biometric feedback.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={{ width: 64, height: 64, borderRadius: '20px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <TrendingUp size={32} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0' }}>Smart Nutrition</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>Molecular-level nutrition tracking and meal generation optimized for your unique DNA and goals.</p>
          </div>

        </div>
      </section>

      <section style={{ ...sectionStyle, background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '56px', fontWeight: '900', margin: '0 0 24px 0', letterSpacing: '-2px' }}>Start Your <span style={{color: 'var(--color-primary)'}}>Metamorphosis</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '20px', marginBottom: '56px', lineHeight: '1.6' }}>Join a community dedicated to the pursuit of excellence through data and mindfulness.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <button onClick={() => navigate('/signup')} style={primaryBtnStyle}>
              Create Free Account <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/signin')} style={secondaryBtnStyle}>
              Member Login
            </button>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: 'var(--bg-secondary)', padding: '64px 40px', borderTop: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontWeight: '900', fontSize: '28px', letterSpacing: '-1px' }}>
          <Brain size={36} /> InnerTrace
        </div>
        <div style={{ display: 'flex', gap: '48px', fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Architecture</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Neural Protocols</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Core</a>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
          © 2026 InnerTrace Intelligence Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;