import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, User, Sparkles, Search, ChevronRight, ChevronLeft, Brain, Star } from 'lucide-react';
import { userApi } from '../api';
import { useAuth } from '../context/AuthContext';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [fitnessLevel, setFitnessLevel] = useState(50);

  const isNextActive = () => {
    if (step === 1) return selectedOption !== null;
    if (step === 2) return selectedGoals.length > 0;
    if (step === 3) return selectedDiet !== null;
    if (step === 4) return true;
    return false;
  };

  const handleNext = async () => {
    if (isNextActive()) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        setLoading(true);
        try {
          const settings = {
            goals: selectedGoals,
            diet: selectedDiet,
            fitnessLevel,
            onboarded: true
          };
          const persona = selectedOption;
          
          await userApi.updateProfile(user.id, {
            name: user.name,
            persona,
            settings_json: JSON.stringify(settings)
          });
          
          updateUser({ persona, settings_json: JSON.stringify(settings) });
          navigate('/home');
        } catch (err) {
          console.error('Error saving profile:', err);
          alert('Failed to save profile. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    fontFamily: 'Inter, sans-serif',
    padding: '40px 20px',
    boxSizing: 'border-box',
    transition: 'var(--transition)'
  };

  const contentMaxWidth = '550px';

  const cardStyle = (isSelected) => ({
    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-primary)'}`,
    borderRadius: '24px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
    boxShadow: isSelected ? '0 8px 20px rgba(16, 185, 129, 0.1)' : 'var(--shadow-sm)'
  });

  const nextBtnStyle = {
    width: '100%',
    height: '60px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '800',
    cursor: isNextActive() ? 'pointer' : 'not-allowed',
    backgroundColor: isNextActive() ? 'var(--color-primary)' : 'var(--bg-tertiary)',
    color: isNextActive() ? 'white' : 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'var(--transition)',
    boxShadow: isNextActive() ? '0 8px 20px rgba(16, 185, 129, 0.2)' : 'none'
  };

  const options = [
    { id: 'student', label: 'Student', icon: <GraduationCap size={28} /> },
    { id: 'professional', label: 'Professional', icon: <Briefcase size={28} /> },
    { id: 'older-adult', label: 'Older Adult', icon: <User size={28} /> },
    { id: 'wellness', label: 'Enthusiast', icon: <Star size={28} /> }
  ];

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: contentMaxWidth, marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>
          <span>STEP {step} OF 4</span>
          <span style={{ color: 'var(--color-primary)' }}>{step * 25}% COMPLETE</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${step * 25}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: contentMaxWidth, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Tailor Your Journey</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>Select your persona to refine AI insights.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {options.map(opt => (
                <div key={opt.id} onClick={() => setSelectedOption(opt.id)} style={cardStyle(selectedOption === opt.id)}>
                  <div style={{ width: 60, height: 60, borderRadius: '18px', backgroundColor: selectedOption === opt.id ? 'white' : 'var(--bg-tertiary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: selectedOption === opt.id ? 'var(--color-primary)' : 'var(--text-muted)', transition: 'var(--transition)' }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: selectedOption === opt.id ? 'var(--color-primary)' : 'var(--text-primary)' }}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Core Ambitions</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>What drives your wellness evolution?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {['Weight Loss', 'Muscle Gain', 'Stress Relief', 'Better Sleep', 'Clean Eating', 'Yoga', 'Mental Clarity', 'Productivity'].map(goal => (
                <button key={goal} onClick={() => toggleGoal(goal)} style={{ padding: '14px 28px', borderRadius: '30px', border: `2px solid ${selectedGoals.includes(goal) ? 'var(--color-primary)' : 'var(--border-primary)'}`, backgroundColor: selectedGoals.includes(goal) ? 'var(--color-primary-light)' : 'var(--bg-secondary)', color: selectedGoals.includes(goal) ? 'var(--color-primary)' : 'var(--text-primary)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'var(--transition)' }}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Nutritional Bio</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>Your fuel is your foundation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Balanced', 'Vegan', 'Keto', 'Low Carb', 'High Protein', 'Paleo'].map(opt => (
                <div key={opt} onClick={() => setSelectedDiet(opt)} style={{ ...cardStyle(selectedDiet === opt), flexDirection: 'row', padding: '20px 24px', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: selectedDiet === opt ? 'var(--color-primary)' : 'var(--text-primary)' }}>{opt}</span>
                  {selectedDiet === opt && <Sparkles size={20} color="var(--color-primary)" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Active Baseline</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '60px', fontWeight: '500' }}>Quantify your current physical output.</p>
            <div style={{ width: 120, height: 120, borderRadius: '40px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 32px auto', fontSize: '48px' }}>
              {fitnessLevel < 33 ? '🧘' : fitnessLevel < 66 ? '🏃' : '💪'}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-primary)', marginBottom: '48px' }}>
              {fitnessLevel < 33 ? 'Foundational' : fitnessLevel < 66 ? 'Functional' : 'Elite'}
            </h2>
            <div style={{ width: '100%', padding: '0 20px', position: 'relative' }}>
              <input type="range" min="0" max="100" value={fitnessLevel} onChange={(e) => setFitnessLevel(parseInt(e.target.value))} style={{ width: '100%', appearance: 'none', height: '10px', borderRadius: '5px', background: 'var(--bg-tertiary)', outline: 'none' }} className="setup-slider" />
              <div style={{ position: 'absolute', top: 0, left: 20, height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '5px', width: `calc(${fitnessLevel}% - 20px)`, pointerEvents: 'none' }}></div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', paddingTop: '40px' }}>
          <button onClick={handleNext} disabled={!isNextActive() || loading} style={nextBtnStyle}>
            {loading ? 'Finalizing...' : step === 4 ? 'Complete Initialization' : 'Synchronize'} <ChevronRight size={20} />
          </button>
          {step > 1 && (
            <button onClick={handleBack} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-muted)', borderRadius: '20px', height: '60px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ChevronLeft size={18} /> Back
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .setup-slider::-webkit-slider-thumb {
          appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 12px;
          background: white;
          border: 4px solid var(--color-primary);
          cursor: pointer;
          position: relative;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ProfileSetup;
