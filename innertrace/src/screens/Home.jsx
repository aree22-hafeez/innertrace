import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, Dumbbell, Flame, Plus, Moon, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi, journalApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moodLevel, setMoodLevel] = useState(50);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(50);
  const [energy, setEnergy] = useState(60);
  const [loggingMood, setLoggingMood] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchSummary = async () => {
      try {
        const data = await userApi.getSummary(user.id);
        setSummary(data);
        if (data && data.latestMood !== null && data.latestMood !== undefined) {
          setMoodLevel(data.latestMood * 10);
        }
      } catch (err) {
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user?.id]);

  const handleLogMood = async () => {
    setLoggingMood(true);
    try {
      await journalApi.saveEntry({
        userId: user.id,
        mood: Math.round(moodLevel / 10),
        sleep: Number(sleep),
        stress: Math.round(Number(stress) / 10),
        energy: Math.round(Number(energy) / 10),
        content: `Quick log: Feeling ${moodLevel}/100`
      });
      const data = await userApi.getSummary(user.id);
      setSummary(data);
      alert('Mood logged successfully!');
    } catch (err) {
      console.error('Error logging mood:', err);
    } finally {
      setLoggingMood(false);
    }
  };

  const containerStyle = {
    backgroundColor: 'var(--bg-primary)',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
    paddingBottom: '40px',
    transition: 'var(--transition)'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
    padding: '40px 20px 100px 20px',
    color: 'white',
    position: 'relative'
  };

  const mainContentStyle = {
    padding: '0 20px',
    maxWidth: '850px',
    margin: '-60px auto 0 auto',
    position: 'relative',
    zIndex: 10
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-primary)',
    padding: '28px',
    marginBottom: '24px',
    transition: 'var(--transition)'
  };

  const statCardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid var(--border-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    transition: 'var(--transition)'
  };

  const quickActionButtonStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '20px',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flex: 1,
    transition: 'var(--transition)'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
              ⚡
            </div>
            InnerTrace
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>Hi, {user?.name || 'User'}!</h1>
          <p style={{ fontSize: '16px', opacity: 0.9, fontWeight: '500' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      <main style={mainContentStyle}>
        {/* Health Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={statCardStyle}>
            <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="5" strokeDasharray="176" strokeDashoffset={176 - (176 * (summary?.wellnessScore || 0) / 100)} strokeLinecap="round" transform="rotate(-90 32 32)" />
              </svg>
              <span style={{ position: 'absolute', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{summary?.wellnessScore || 0}</span>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>Wellness</span>
          </div>

          <div style={{ ...statCardStyle, backgroundColor: '#8B5CF6', border: 'none', color: 'white' }}>
             <Activity size={24} />
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '20px', fontWeight: '800' }}>{summary?.workout?.completed || 0}/{summary?.workout?.total || 0}</div>
               <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase' }}>Exercises</div>
             </div>
          </div>

          <div style={{ ...statCardStyle, backgroundColor: 'var(--color-primary)', border: 'none', color: 'white' }}>
             <Flame size={24} />
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '20px', fontWeight: '800' }}>{summary?.nutrition?.kcal || 0}</div>
               <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase' }}>Calories</div>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div onClick={() => navigate('/workouts')} style={quickActionButtonStyle}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>🏋️</div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Workout</span>
            </div>
            <div onClick={() => navigate('/nutrition')} style={quickActionButtonStyle}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>🥗</div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Log Meal</span>
            </div>
            <div onClick={() => navigate('/journal')} style={quickActionButtonStyle}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>✍️</div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Journal</span>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div style={{ ...cardStyle, background: 'var(--bg-tertiary)', border: '1px solid var(--color-primary)', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%' }}></div>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
             <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', flexShrink: 0 }}>
               <Sparkles size={20} />
             </div>
             <div>
               <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>AI Personal Coach</h3>
               <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                 "Great progress on your sleep! You've consistently hit 7+ hours this week. Your energy levels reflect this. Keep it up!"
               </p>
             </div>
           </div>
        </div>

        {/* Daily Check-in */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px' }}>Daily Check-in</h2>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
               <span>Mood Level</span>
               <span style={{ color: 'var(--color-primary)' }}>{moodLevel}%</span>
            </div>
            <div style={{ position: 'relative', height: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${moodLevel}%`, backgroundColor: 'var(--color-primary)', borderRadius: '6px' }}></div>
              <input type="range" min="0" max="100" value={moodLevel} onChange={e => setMoodLevel(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {[
               { label: 'Sleep', val: sleep, set: setSleep, max: 12, unit: 'h', icon: <Moon size={16} /> },
               { label: 'Stress', val: stress, set: setStress, max: 100, unit: '/10', icon: <Zap size={16} /> },
               { label: 'Energy', val: energy, set: setEnergy, max: 100, unit: '/10', icon: <Flame size={16} /> }
             ].map(s => (
               <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{s.icon} {s.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.label === 'Sleep' ? s.val : Math.round(s.val/10)}{s.unit}</span>
                  </div>
                  <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${s.label === 'Sleep' ? (s.val/12)*100 : s.val}%`, backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}></div>
                    <input type="range" min="0" max={s.max} step={s.label === 'Sleep' ? 0.5 : 1} value={s.val} onChange={e => s.set(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  </div>
               </div>
             ))}
          </div>

          <button onClick={handleLogMood} disabled={loggingMood} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', height: '56px', fontSize: '16px', fontWeight: '700', marginTop: '32px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)', transition: 'var(--transition)' }}>
            {loggingMood ? 'Saving...' : 'Save Daily Check-in'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default Home;