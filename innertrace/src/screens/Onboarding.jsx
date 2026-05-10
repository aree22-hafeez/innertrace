import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, User, Sparkles, Search, ChevronRight, ChevronLeft, Brain } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [whoAreYou, setWhoAreYou] = useState(null);
  const [goals, setGoals] = useState([]);
  const [diet, setDiet] = useState(null);
  const [fitnessLevel, setFitnessLevel] = useState(50);

  const isNextActive = () => {
    if (step === 1) return whoAreYou !== null;
    if (step === 2) return goals.length > 0;
    if (step === 3) return diet !== null;
    if (step === 4) return true;
    return false;
  };

  const handleNext = () => {
    if (isNextActive()) {
      if (step < 4) setStep(step + 1);
      else navigate('/home');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleGoal = (goal) => {
    if (goals.includes(goal)) setGoals(goals.filter(g => g !== goal));
    else setGoals([...goals, goal]);
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

  const whoAreYouOptions = [
    { id: 'student', label: 'Student', icon: <GraduationCap size={28} /> },
    { id: 'professional', label: 'Professional', icon: <Briefcase size={28} /> },
    { id: 'older', label: 'Older Adult', icon: <User size={28} /> },
    { id: 'enthusiast', label: 'Enthusiast', icon: <Sparkles size={28} /> }
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
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Who are you?</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>We'll tailor your neural wellness experience.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {whoAreYouOptions.map(opt => (
                <div key={opt.id} onClick={() => setWhoAreYou(opt.id)} style={cardStyle(whoAreYou === opt.id)}>
                  <div style={{ width: 60, height: 60, borderRadius: '18px', backgroundColor: whoAreYou === opt.id ? 'white' : 'var(--bg-tertiary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: whoAreYou === opt.id ? 'var(--color-primary)' : 'var(--text-muted)', transition: 'var(--transition)' }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: whoAreYou === opt.id ? 'var(--color-primary)' : 'var(--text-primary)' }}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Your Goals</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>Select the milestones you want to achieve.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {['Weight Loss', 'Muscle Gain', 'Stress Relief', 'Better Sleep', 'Clean Eating', 'Yoga', 'Mental Clarity', 'Productivity'].map(goal => (
                <button key={goal} onClick={() => toggleGoal(goal)} style={{ padding: '14px 28px', borderRadius: '30px', border: `2px solid ${goals.includes(goal) ? 'var(--color-primary)' : 'var(--border-primary)'}`, backgroundColor: goals.includes(goal) ? 'var(--color-primary-light)' : 'var(--bg-secondary)', color: goals.includes(goal) ? 'var(--color-primary)' : 'var(--text-primary)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'var(--transition)' }}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Dietary Path</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', fontWeight: '500' }}>Choose your nutritional foundation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Balanced', 'Vegan', 'Keto', 'Low Carb', 'High Protein', 'Paleo'].map(opt => (
                <div key={opt} onClick={() => setDiet(opt)} style={{ ...cardStyle(diet === opt), flexDirection: 'row', padding: '20px 24px', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: diet === opt ? 'var(--color-primary)' : 'var(--text-primary)' }}>{opt}</span>
                  {diet === opt && <Sparkles size={20} color="var(--color-primary)" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-1.5px' }}>Fitness Level</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '60px', fontWeight: '500' }}>How active are you currently?</p>
            <div style={{ width: 120, height: 120, borderRadius: '40px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 32px auto', fontSize: '48px' }}>
              {fitnessLevel < 33 ? '🧘' : fitnessLevel < 66 ? '🏃' : '💪'}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-primary)', marginBottom: '48px' }}>
              {fitnessLevel < 33 ? 'Beginner' : fitnessLevel < 66 ? 'Intermediate' : 'Expert'}
            </h2>
            <div style={{ width: '100%', padding: '0 20px', position: 'relative' }}>
              <input type="range" min="0" max="100" value={fitnessLevel} onChange={(e) => setFitnessLevel(parseInt(e.target.value))} style={{ width: '100%', appearance: 'none', height: '10px', borderRadius: '5px', background: 'var(--bg-tertiary)', outline: 'none' }} className="onboarding-slider" />
              <div style={{ position: 'absolute', top: 0, left: 20, height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '5px', width: `calc(${fitnessLevel}% - 20px)`, pointerEvents: 'none' }}></div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', paddingTop: '40px' }}>
          <button onClick={handleNext} disabled={!isNextActive()} style={nextBtnStyle}>
            {step === 4 ? 'Finish Setup' : 'Continue'} <ChevronRight size={20} />
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
        .onboarding-slider::-webkit-slider-thumb {
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

export default Onboarding;