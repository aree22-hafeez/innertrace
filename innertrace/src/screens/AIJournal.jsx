import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Sparkles, Flame, Brain, Dumbbell, Utensils, Loader2 } from 'lucide-react';
import { journalApi } from '../api';
import { useAuth } from '../context/AuthContext';

const AIJournal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState(null);

  const journalPayload = useMemo(() => {
    const state = location.state || {};
    return {
      content: (state.journalText || '').trim(),
      sleep: Number(state.sleep ?? 7),
      stress: Number(state.stress ?? 5),
      energy: Number(state.energy ?? 6),
      type: state.type || 'reflective'
    };
  }, [location.state]);

  useEffect(() => {
    let isMounted = true;
    const loadInsight = async () => {
      if (!journalPayload.content) {
        setError('No journal entry found. Please write in Journal first.');
        setLoading(false);
        return;
      }

      try {
        const saveData = await journalApi.saveEntry({
          userId: user.id,
          type: journalPayload.type,
          sleep: journalPayload.sleep,
          stress: journalPayload.stress,
          energy: journalPayload.energy,
          content: journalPayload.content
        });
        
        const journalId = saveData?.id;
        const data = await journalApi.getInsight({
          userId: user.id,
          journalId,
          content: journalPayload.content,
          sleep: journalPayload.sleep,
          stress: journalPayload.stress,
          energy: journalPayload.energy
        });

        if (isMounted) {
          setInsight(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInsight();
    return () => { isMounted = false; };
  }, [journalPayload, user.id]);

  const containerStyle = {
    backgroundColor: 'var(--bg-primary)',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'var(--transition)'
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    border: '1px solid var(--border-primary)',
    padding: '24px',
    marginBottom: '20px',
    width: '100%',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '650px' }}>
        
        <button 
          onClick={() => navigate('/journal')}
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '12px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', transition: 'var(--transition)' }}
        >
          <ArrowLeft size={18} /> Back to Journal
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '20px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <Sparkles size={32} color="var(--color-primary)" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>AI Insights</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '8px' }}>Personalized feedback based on your reflection</p>
        </div>

        {/* Mood Analysis Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Brain size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Mood Analysis</h2>
          </div>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
              <Loader2 size={20} className="animate-spin" color="var(--color-primary)" />
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>Deeply analyzing your thoughts...</span>
            </div>
          ) : (
            <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-primary)' }}>
              <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                Based on your entry, your current state feels <span style={{ color: 'var(--color-primary)', fontWeight: '800' }}>{(insight?.moodLabel || 'Balanced').toUpperCase()}</span>. 
              </p>
            </div>
          )}
        </div>

        {/* AI Message Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>
              <Sparkles size={22} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 20px 0', fontSize: '15px', lineHeight: '1.7', color: 'var(--text-primary)', fontWeight: '500' }}>
                {error || insight?.aiMessage || 'Fetching your personalized wellness advice...'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700' }}>
                  <Share2 size={16} /> Share Reflection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Suggestions Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Suggested Workout */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Dumbbell size={20} color="var(--color-primary)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>Workout</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0', minHeight: '44px' }}>
              {insight?.suggestionWorkout || 'Gentle Stretching'}
            </h3>
            <button 
              onClick={() => navigate('/workouts')}
              style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', width: '100%', transition: 'var(--transition)', marginTop: '12px' }}
            >
              Start →
            </button>
          </div>

          {/* Nutrition Tip */}
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Utensils size={20} color="#F59E0B" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>Nutrition</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', fontWeight: '500', minHeight: '64px' }}>
              {insight?.suggestionNutrition || 'Stay hydrated with herbal tea for better relaxation.'}
            </p>
            <button 
              onClick={() => navigate('/nutrition')}
              style={{ backgroundColor: 'transparent', color: '#F59E0B', border: '1px solid #F59E0B', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', width: '100%', transition: 'var(--transition)', marginTop: '12px' }}
            >
              Track Meals
            </button>
          </div>
        </div>

        <button style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '20px', padding: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)' }}>
          Update My Wellness Profile
        </button>

      </div>
    </div>
  );
};

export default AIJournal;
