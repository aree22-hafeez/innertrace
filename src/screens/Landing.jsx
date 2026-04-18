import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Shield, Heart, Dumbbell, TrendingUp, Brain, Check } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1D2D', overflowX: 'hidden' }}>
      
      {/* 1. TOP NAVIGATION */}
      <nav style={{ backgroundColor: '#F0995F', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1A1D2D', fontWeight: 'bold', fontSize: '18px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#347562', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <span style={{ fontSize: '10px' }}>⚡</span>
          </div>
          Innertrace
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => navigate('/signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1D2D', fontWeight: '500', fontSize: '15px' }}>
            Log In
          </button>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{ 
        background: 'linear-gradient(135deg, #DFECEE 0%, #F5F7F6 40%, #F6E9E0 100%)',
        padding: '80px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        
        <div style={{ backgroundColor: '#D9F0E1', color: '#347562', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <Sparkles size={14} /> AI-Powered Wellness Platform
        </div>

        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
          Your Complete <br/>
          <span style={{ color: '#347562' }}>Wellness</span> <span style={{ color: '#F0995F' }}>Companion</span>
        </h1>

        <p style={{ color: '#5C5F68', fontSize: '18px', maxWidth: '600px', lineHeight: '1.6', margin: '0 0 40px 0' }}>
          Integrate mood journaling, fitness tracking, diet planning, and productivity features into one powerful AI-driven platform.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Start Your Journey <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/signin')} style={{ backgroundColor: '#FFFFFF', color: '#1A1D2D', border: '1px solid #E5E7EB', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Sign In
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px', color: '#808291', fontSize: '14px', fontWeight: '500' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> Trusted by thousands</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> Privacy-first</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={16} /> AI-powered insights</span>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section style={{ backgroundColor: '#F0FBB4', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 8px 0', color: '#1A1D2D' }}>Everything You Need</h2>
        <p style={{ color: '#5C5F68', fontSize: '18px', margin: '0 0 48px 0' }}>A comprehensive wellness platform</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '900px', width: '100%' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#FFF0F0', color: '#FF7A7A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Mood Journaling</h3>
            <p style={{ color: '#808291', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>Track your emotions with AI-powered insights and emoji-based mood tracking.</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#E8FAF4', color: '#347562', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Dumbbell size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Fitness Tracking</h3>
            <p style={{ color: '#808291', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>Personalized workout plans tailored to your fitness goals and schedule.</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#F0F4FF', color: '#4A6CF7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Nutrition Planning</h3>
            <p style={{ color: '#808291', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>Custom meal plans that fit your dietary preferences and calorie targets.</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#FFF4E5', color: '#F0995F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>AI Wellness Companion</h3>
            <p style={{ color: '#808291', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>Get intelligent recommendations and support powered by advanced AI.</p>
          </div>

        </div>
      </section>

      {/* 4. BUILT FOR EVERYONE SECTION */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', maxWidth: '1000px', width: '100%', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 20px 0', color: '#1A1D2D' }}>
              Built for <span style={{ color: '#347562' }}>Every</span><span style={{ color: '#F0995F' }}>one</span>
            </h2>
            <p style={{ color: '#5C5F68', fontSize: '16px', lineHeight: '1.6', margin: '0 0 32px 0' }}>
              Whether you're a stressed student, busy professional, or looking for a free wellness solution, InnerTrace adapts to your needs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#1A1D2D' }}>
                <Check size={16} color="#1A1D2D" style={{ marginTop: '2px' }} /> AI-powered wellness insights
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#1A1D2D' }}>
                <Check size={16} color="#1A1D2D" style={{ marginTop: '2px' }} /> Customizable fitness plans
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#1A1D2D' }}>
                <Check size={16} color="#1A1D2D" style={{ marginTop: '2px' }} /> Voice input support
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#1A1D2D' }}>
                <Check size={16} color="#1A1D2D" style={{ marginTop: '2px' }} /> Comprehensive mood tracking
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1A1D2D', marginBottom: '32px', justifyContent: 'center' }}>
              <Check size={16} color="#1A1D2D" /> No ads, ever
            </div>

            <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '30px', padding: '14px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>

          {/* Wireframe Mockup UI */}
          <div style={{ flex: '1 1 400px', backgroundColor: '#F3EFEB', padding: '24px', borderRadius: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(to bottom right, #347562, #F0995F)' }}></div>
                <div>
                  <div style={{ width: 100, height: 8, backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div style={{ width: 140, height: 8, backgroundColor: '#F3F4F6', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div style={{ width: '100%', height: 60, backgroundColor: '#E2E8F0', borderRadius: '12px', marginBottom: '16px', opacity: 0.7 }}></div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: 40, backgroundColor: '#FCE7DF', borderRadius: '8px' }}></div>
                <div style={{ flex: 1, height: 40, backgroundColor: '#D5E6E1', borderRadius: '8px' }}></div>
              </div>

              <div style={{ width: '100%', height: 30, backgroundColor: '#E2E8F0', borderRadius: '8px', opacity: 0.7 }}></div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section style={{ 
        background: 'linear-gradient(135deg, #F9F9FB 0%, #F6E9E0 100%)',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0', color: '#1A1D2D' }}>Ready to Transform Your<br/>Wellness?</h2>
        <p style={{ color: '#5C5F68', fontSize: '16px', marginBottom: '40px' }}>Join thousands of users who are already on their wellness journey with InnerTrace.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Get Started Now <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/signin')} style={{ backgroundColor: '#FFFFFF', color: '#1A1D2D', border: '1px solid #E5E7EB', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Already a Member?
          </button>
        </div>
      </section>

      {/* 6. FOOTER */}
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

    </div>
  );
};

export default Landing;