import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Check, Dumbbell, Timer, Target, Calendar, ChevronRight, Flame } from 'lucide-react';
import { workoutApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Workouts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseType, setExerciseType] = useState('HIIT');
  const [duration, setDuration] = useState(30);

  const [hasPlan, setHasPlan] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [workoutId, setWorkoutId] = useState(null);
  const [aiNote, setAiNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  const userId = user.id;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutApi.getWorkouts(userId);
        setAllWorkouts(data || []);
        if (data && data.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const todaysWorkout = data.find(w => w.date === today);
          if (todaysWorkout) {
            setHasPlan(true);
            setExercises(JSON.parse(todaysWorkout.exercises_json));
            setWorkoutId(todaysWorkout.id);
            setAiNote(todaysWorkout.ai_note || '');
          }
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };
    fetchWorkouts();
  }, [userId]);

  const toggleExercise = async (id) => {
    const updatedExercises = exercises.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex);
    setExercises(updatedExercises);
    
    if (workoutId) {
      try {
        await workoutApi.updateWorkout(workoutId, JSON.stringify(updatedExercises));
      } catch (err) {
        console.error("Error updating workout:", err);
      }
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const data = await workoutApi.generate({ userId, type: exerciseType, duration });
      setHasPlan(true);
      setExercises(data.exercises);
      setWorkoutId(data.id);
      setAiNote(data.aiNote || '');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error generating workout:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

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
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-primary)',
    padding: '28px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '24px',
    transition: 'var(--transition)'
  };

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: '12px 0',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  });

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '750px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Workouts</h1>
          <button 
            onClick={() => navigate('/fitness-ai')}
            style={{ 
              backgroundColor: '#7C3AED', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              padding: '12px 20px', 
              fontSize: '14px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Sparkles size={18} /> Talk to Coach
          </button>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', borderRadius: '20px', padding: '6px', marginBottom: '32px' }}>
          <button style={tabButtonStyle(activeTab === 'Today')} onClick={() => setActiveTab('Today')}>
            <Dumbbell size={16} /> Today
          </button>
          <button style={tabButtonStyle(activeTab === 'History')} onClick={() => setActiveTab('History')}>
            <Calendar size={16} /> History
          </button>
        </div>

        {activeTab === 'Today' && (
          !hasPlan ? (
            <div style={{ ...cardStyle, textAlign: 'center', alignItems: 'center', padding: '60px 40px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '24px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                <Dumbbell size={40} color="var(--color-primary)" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Ready for a sweat?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.6' }}>Create a personalized workout plan tailored to your preferences and available time.</p>
              <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', padding: '16px 40px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
                Start My Journey
              </button>
            </div>
          ) : (
            <div>
              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div style={{ ...cardStyle, marginBottom: 0, padding: '20px', textAlign: 'center' }}>
                  <Flame size={20} color="#F0995F" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{completedCount}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Done</div>
                </div>
                <div style={{ ...cardStyle, marginBottom: 0, padding: '20px', textAlign: 'center' }}>
                  <Target size={20} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{totalCount}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Goal</div>
                </div>
                <div style={{ ...cardStyle, marginBottom: 0, padding: '20px', textAlign: 'center' }}>
                  <Timer size={20} color="#3B82F6" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{progressPercent}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Progress</div>
                </div>
              </div>

              {/* Coach's Note */}
              {aiNote && (
                <div style={{ ...cardStyle, padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="var(--color-primary)" />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>AI Coach Advice</div>
                    {aiNote}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Exercises</h2>
                <button onClick={() => setIsModalOpen(true)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Change Plan</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exercises.map(ex => (
                  <div key={ex.id} onClick={() => toggleExercise(ex.id)} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${ex.completed ? 'var(--color-primary)' : 'var(--border-primary)'}`, borderRadius: '20px', padding: '20px', display: 'flex', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '6px', border: `2px solid ${ex.completed ? 'var(--color-primary)' : 'var(--text-muted)'}`, backgroundColor: ex.completed ? 'var(--color-primary)' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2px' }}>
                      {ex.completed && <Check size={16} color="white" strokeWidth={4} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', opacity: ex.completed ? 0.5 : 1 }}>{ex.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span>{ex.sets} sets</span> • <span>{ex.reps}</span>
                      </div>
                    </div>
                    <div style={{ alignSelf: 'center', padding: '4px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {ex.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {activeTab === 'History' && (
           <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
             <Calendar size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
             <p>Your workout history and monthly trends will appear here.</p>
           </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '28px', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Personalize Workout</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Choose your focus and available time.</p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Exercise Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Yoga', 'HIIT', 'Strength', 'Walking', 'Stretching'].map(opt => (
                  <button key={opt} onClick={() => setExerciseType(opt)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${exerciseType === opt ? 'var(--color-primary)' : 'var(--border-primary)'}`, backgroundColor: exerciseType === opt ? 'var(--color-primary-light)' : 'transparent', color: exerciseType === opt ? 'var(--color-primary)' : 'var(--text-secondary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'var(--transition)' }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Duration</label>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)' }}>{duration} min</span>
              </div>
              <div style={{ position: 'relative', height: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(duration/60)*100}%`, backgroundColor: 'var(--color-primary)', borderRadius: '6px' }}></div>
                <input type="range" min="15" max="60" step="5" value={duration} onChange={e => setDuration(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              </div>
            </div>

            <button onClick={generatePlan} disabled={loading} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', height: '56px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'var(--transition)' }}>
              {loading ? 'Optimizing...' : 'Generate Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
