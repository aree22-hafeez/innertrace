import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Dumbbell, Flame, Plus } from 'lucide-react';

const Home = () => {
  const [moodLevel, setMoodLevel] = useState(50);

  const containerStyle = {
    backgroundColor: '#FAFAFA',
    minHeight: 'calc(100vh - 80px)', // Minus navbar
    fontFamily: 'Inter, sans-serif',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  };

  const contentMaxWidth = '800px';

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #E5E7EB',
    padding: '24px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '24px'
  };

  const sliderRowStyle = {
    marginBottom: '20px'
  };

  const sliderLabelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#1A1D2D',
    marginBottom: '8px',
    fontWeight: '500'
  };

  // Custom slider base style function
  const renderSlider = (value, leftLabel, rightLabel, hideLabels = false) => (
    <div style={sliderRowStyle}>
      {!hideLabels && (
        <div style={sliderLabelStyle}>
          <span>{leftLabel}</span>
          <span style={{ color: '#808291' }}>{rightLabel}</span>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${value}%`, backgroundColor: '#347562', borderRadius: '6px' }}></div>
        <div style={{ position: 'absolute', top: '-4px', left: `calc(${value}% - 10px)`, width: '20px', height: '20px', backgroundColor: '#FFFFFF', border: '3px solid #347562', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: contentMaxWidth }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1D2D', margin: '0 0 4px 0' }}>Good evening, Areej</h1>
          <p style={{ fontSize: '16px', color: '#808291', margin: 0, fontWeight: '500' }}>Wednesday, April 15</p>
        </div>

        {/* Weekly Summary Card */}
        <div style={{ ...cardStyle, borderColor: '#D1E5DE', backgroundColor: '#F9FCFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#347562', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            <Sparkles size={16} /> Weekly Summary
          </div>
          <p style={{ margin: 0, fontSize: '16px', color: '#1A1D2D' }}>
            You've been feeling <span style={{ color: '#347562', fontWeight: '500' }}>calm</span> this week 😌
          </p>
        </div>

        {/* Today's Mood Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1D2D', margin: '0 0 24px 0' }}>Today's Mood</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>😐</div>
            <p style={{ fontSize: '14px', color: '#808291', margin: '0 0 16px 0' }}>How are you feeling?</p>
            
            <div style={{ width: '100%', padding: '0 8px' }}>
              <div style={{ position: 'relative', width: '100%', height: '16px', backgroundColor: '#E5E7EB', borderRadius: '8px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${moodLevel}%`, backgroundColor: '#347562', borderRadius: '8px' }}></div>
                <input 
                  type="range" min="0" max="100" value={moodLevel} onChange={(e) => setMoodLevel(e.target.value)}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <div style={{ pointerEvents: 'none', position: 'absolute', top: '-4px', left: `calc(${moodLevel}% - 12px)`, width: '24px', height: '24px', backgroundColor: '#FFFFFF', border: '4px solid #347562', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1A1D2D', marginTop: '12px' }}>
                <span>Very Low</span>
                <span>Amazing</span>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 -24px 24px -24px' }}></div>

          {/* Sub Sliders */}
          <div style={sliderLabelStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#347562' }}>☾</span> Sleep</span>
            <span style={{ color: '#808291' }}>7h</span>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `70%`, backgroundColor: '#347562', borderRadius: '6px' }}></div>
            <div style={{ position: 'absolute', top: '-4px', left: `calc(70% - 10px)`, width: '20px', height: '20px', backgroundColor: '#FFFFFF', border: '3px solid #347562', borderRadius: '50%' }}></div>
          </div>

          <div style={sliderLabelStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#347562' }}>⚡</span> Stress</span>
            <span style={{ color: '#808291' }}>5/10</span>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `50%`, backgroundColor: '#347562', borderRadius: '6px' }}></div>
            <div style={{ position: 'absolute', top: '-4px', left: `calc(50% - 10px)`, width: '20px', height: '20px', backgroundColor: '#FFFFFF', border: '3px solid #347562', borderRadius: '50%' }}></div>
          </div>

          <div style={sliderLabelStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#F0995F' }}>🔥</span> Energy</span>
            <span style={{ color: '#808291' }}>6/10</span>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', marginBottom: '32px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `60%`, backgroundColor: '#347562', borderRadius: '6px' }}></div>
            <div style={{ position: 'absolute', top: '-4px', left: `calc(60% - 10px)`, width: '20px', height: '20px', backgroundColor: '#FFFFFF', border: '3px solid #347562', borderRadius: '50%' }}></div>
          </div>

          <button style={{ width: '100%', backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '16px', height: '52px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Log Today's Mood
          </button>
        </div>

        {/* Today's Progress Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '32px 0 16px 0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1D2D', margin: 0 }}>Today's Progress</h2>
          <ArrowUpRight size={20} color="#1A1D2D" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Workout Progress */}
          <div style={{ ...cardStyle, marginBottom: 0, border: '2px solid #347562', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#808291', margin: '0 0 4px 0', fontWeight: '500' }}>Workout</p>
                <h3 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#1A1D2D' }}>67%</h3>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#E8FAF4', color: '#347562', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Dumbbell size={20} />
              </div>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }}>
              <div style={{ width: '67%', height: '100%', backgroundColor: '#347562', borderRadius: '4px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#5C5F68', fontWeight: '500' }}>
              <span>2 of 3 exercises</span>
              <span>→</span>
            </div>
          </div>

          {/* Nutrition Progress */}
          <div style={{ ...cardStyle, marginBottom: 0, border: '2px solid #F0995F', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#808291', margin: '0 0 4px 0', fontWeight: '500' }}>Nutrition</p>
                <h3 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#1A1D2D' }}>74%</h3>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#FFF4E5', color: '#F0995F', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Flame size={20} />
              </div>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }}>
              <div style={{ width: '74%', height: '100%', backgroundColor: '#347562', borderRadius: '4px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#5C5F68', fontWeight: '500' }}>
              <span>1,620 / 2,200 kcal</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* AI Suggestion Card */}
        <div style={{ ...cardStyle, backgroundColor: '#F9FCFB' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Sparkles size={20} color="#347562" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '15px', color: '#1A1D2D', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                Based on your journal, you seem stressed. How about a 10-min stretch? 🌿
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ backgroundColor: '#347562', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Start Workout →
                </button>
                <button style={{ backgroundColor: '#FFFFFF', color: '#1A1D2D', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Tell me more
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button style={{
        position: 'fixed',
        bottom: '100px', // Above footer if visible, but fixed to screen
        right: '40px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#347562',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 24px rgba(52, 117, 98, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 100
      }}>
        <Plus size={32} />
      </button>

    </div>
  );
};

export default Home;