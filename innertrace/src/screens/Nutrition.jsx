import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Check, Mic, MicOff, Send, Loader2, Utensils, Calendar, Target, MessageSquare } from 'lucide-react';
import { nutritionApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Nutrition = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [dietType, setDietType] = useState('Vegan');
  const [calorieTarget, setCalorieTarget] = useState('2500');
  const [loading, setLoading] = useState(false);
  const [mealId, setMealId] = useState(null);
  const [aiNote, setAiNote] = useState('');
  const [meals, setMeals] = useState([]);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', content: "Hello! I'm your InnerTrace Dietitian. Want to log a meal or ask for nutritional advice?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await nutritionApi.getMeals(user.id);
        if (data && data.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const todaysMeal = data.find(m => m.date === today);
          if (todaysMeal) {
            setHasPlan(true);
            setMeals(JSON.parse(todaysMeal.meals_json));
            setMealId(todaysMeal.id);
            setCalorieTarget(todaysMeal.calorie_target || '2500');
            setDietType(todaysMeal.diet_type || 'Vegan');
            setAiNote(todaysMeal.ai_note || '');
          }
        }
      } catch (err) {
        console.error('Error fetching meals:', err);
      }
    };
    fetchMeals();
  }, [user.id]);

  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendChatMessage(null, transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSendChatMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const text = customText || chatInput;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nutrition/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: text })
      });
      const data = await response.json();
      const botMsg = { id: Date.now() + 1, type: 'bot', content: data.response };
      setChatMessages(prev => [...prev, botMsg]);
      speak(data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const targetMacros = { kcal: Number(calorieTarget), p: Math.round(Number(calorieTarget)*0.3/4), c: Math.round(Number(calorieTarget)*0.4/4), f: Math.round(Number(calorieTarget)*0.3/9) };
  const currentMacros = meals.reduce((acc, meal) => {
    if (meal.completed) {
      acc.kcal += meal.kcal; acc.p += meal.p; acc.c += meal.c; acc.f += meal.f;
    }
    return acc;
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const toggleMeal = async (id) => {
    const updatedMeals = meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setMeals(updatedMeals);
    if (mealId) {
      try { await nutritionApi.updateMeals(mealId, JSON.stringify(updatedMeals)); } catch (err) { console.error(err); }
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const data = await nutritionApi.generate({ userId: user.id, dietType, calorieTarget: Number(calorieTarget) });
      setHasPlan(true); setMeals(data.meals); setMealId(data.id); setAiNote(data.aiNote || ''); setIsModalOpen(false);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

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
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Nutrition</h1>
          <button onClick={() => setIsModalOpen(true)} style={{ width: 44, height: 44, borderRadius: '12px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}>
            <Sparkles size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', borderRadius: '20px', padding: '6px', marginBottom: '32px' }}>
          <button style={tabButtonStyle(activeTab === 'Today')} onClick={() => setActiveTab('Today')}>
            <Utensils size={16} /> Today
          </button>
          <button style={tabButtonStyle(activeTab === 'History')} onClick={() => setActiveTab('History')}>
            <Calendar size={16} /> History
          </button>
          <button style={tabButtonStyle(activeTab === 'Chat')} onClick={() => setActiveTab('Chat')}>
            <MessageSquare size={16} /> Talk to AI
          </button>
        </div>

        {activeTab === 'Chat' ? (
          <div style={{ ...cardStyle, height: '500px', display: 'flex', flexDirection: 'column', padding: '0' }}>
             <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {chatMessages.map(msg => (
                 <div key={msg.id} style={{ 
                   alignSelf: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                   backgroundColor: msg.type === 'bot' ? 'var(--bg-tertiary)' : 'var(--color-primary)',
                   color: msg.type === 'bot' ? 'var(--text-primary)' : 'white',
                   padding: '12px 18px',
                   borderRadius: msg.type === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                   maxWidth: '85%',
                   fontSize: '14px'
                 }}>
                   {msg.content}
                 </div>
               ))}
               {isTyping && <Loader2 size={20} className="animate-spin" color="var(--color-primary)" />}
               <div ref={messagesEndRef} />
             </div>
             <div style={{ padding: '20px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
               <button onClick={toggleListening} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', backgroundColor: isListening ? '#EF4444' : 'var(--color-primary)', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 {isListening ? <MicOff size={20} /> : <Mic size={20} />}
               </button>
               <form onSubmit={handleSendChatMessage} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                 <input 
                   value={chatInput} onChange={e => setChatInput(e.target.value)}
                   placeholder="Ask about diet or log a meal..."
                   style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '12px', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}
                 />
                 <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
                   <Send size={24} />
                 </button>
               </form>
             </div>
          </div>
        ) : activeTab === 'Today' && (
          !hasPlan ? (
            <div style={{ ...cardStyle, textAlign: 'center', alignItems: 'center', padding: '60px 40px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '24px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                <Sparkles size={40} color="var(--color-primary)" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Ready to eat better?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.6' }}>Generate a personalized meal plan based on your preferences and goals.</p>
              <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', padding: '16px 40px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
                Create My Plan
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
                {[
                  { label: 'Calories', current: currentMacros.kcal, total: targetMacros.kcal, unit: 'kcal' },
                  { label: 'Protein', current: currentMacros.p, total: targetMacros.p, unit: 'g' },
                  { label: 'Carbs', current: currentMacros.c, total: targetMacros.c, unit: 'g' },
                  { label: 'Fat', current: currentMacros.f, total: targetMacros.f, unit: 'g' }
                ].map((macro, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-primary)', padding: '16px 12px', transition: 'var(--transition)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>{macro.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {macro.current} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {macro.total}{macro.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {aiNote && (
                <div style={{ ...cardStyle, padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} color="var(--color-primary)" />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>AI Nutritionist Advice</div>
                    {aiNote}
                  </div>
                </div>
              )}

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Today's Menu</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meals.map(meal => (
                  <div key={meal.id} onClick={() => toggleMeal(meal.id)} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${meal.completed ? 'var(--color-primary)' : 'var(--border-primary)'}`, borderRadius: '20px', padding: '20px', display: 'flex', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '6px', border: `2px solid ${meal.completed ? 'var(--color-primary)' : 'var(--text-muted)'}`, backgroundColor: meal.completed ? 'var(--color-primary)' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2px' }}>
                      {meal.completed && <Check size={16} color="white" strokeWidth={4} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', opacity: meal.completed ? 0.5 : 1 }}>{meal.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', opacity: meal.completed ? 0.5 : 1 }}>{meal.description}</div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        <span>{meal.kcal} kcal</span> • <span>P {meal.p}g</span> • <span>C {meal.c}g</span> • <span>F {meal.f}g</span>
                      </div>
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
             <p>Nutrition history and trends will appear here as you log meals.</p>
           </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '28px', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Customize Diet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Tailor your meal plan to your specific needs.</p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Dietary Preference</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['High Protein', 'Vegan', 'Balanced', 'Keto'].map(opt => (
                  <button key={opt} onClick={() => setDietType(opt)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${dietType === opt ? 'var(--color-primary)' : 'var(--border-primary)'}`, backgroundColor: dietType === opt ? 'var(--color-primary-light)' : 'transparent', color: dietType === opt ? 'var(--color-primary)' : 'var(--text-secondary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'var(--transition)' }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Daily Calories</label>
              <input type="number" value={calorieTarget} onChange={e => setCalorieTarget(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', outline: 'none' }} />
            </div>

            <button onClick={generatePlan} disabled={loading} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', height: '56px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'var(--transition)' }}>
              {loading ? 'Analyzing...' : 'Generate Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
