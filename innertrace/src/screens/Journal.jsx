import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Sparkles, Loader2, BookOpen, Clock, BrainCircuit } from 'lucide-react';
import { journalApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Journal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Quick Track');
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(50);
  const [energy, setEnergy] = useState(60);
  const [journalText, setJournalText] = useState('');
  const [recentEntries, setRecentEntries] = useState([]);
  
  // Chat State
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', content: "Hi! I'm your AI Journal Guide. How was your day? Feel free to speak or type, I'm here to listen." }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await journalApi.getHistory(user.id);
        setRecentEntries(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/journal/chat`, {
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

  const handleGenerateInsight = () => {
    const generatedQuickTrackEntry = `Quick check-in: Sleep ${sleep}h, Stress ${Math.round(Number(stress) / 10)}/10, Energy ${Math.round(Number(energy) / 10)}/10.`;
    const payload = {
      type: activeTab === 'Quick Track' ? 'quick-track' : 'reflective',
      journalText: journalText.trim() ? journalText : generatedQuickTrackEntry,
      sleep: Number(sleep),
      stress: Math.round(Number(stress) / 10),
      energy: Math.round(Number(energy) / 10)
    };
    navigate('/ai-journal', { state: payload });
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
      <div style={{ width: '100%', maxWidth: '650px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: 'var(--text-primary)' }}>Journal</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>Document your journey, clear your mind.</p>

        <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', borderRadius: '20px', padding: '6px', marginBottom: '32px' }}>
          <button style={tabButtonStyle(activeTab === 'Quick Track')} onClick={() => setActiveTab('Quick Track')}>
            <Clock size={16} /> Quick
          </button>
          <button style={tabButtonStyle(activeTab === 'Reflective')} onClick={() => setActiveTab('Reflective')}>
            <BookOpen size={16} /> Reflective
          </button>
          <button style={tabButtonStyle(activeTab === 'AI Guide')} onClick={() => setActiveTab('AI Guide')}>
            <BrainCircuit size={16} /> AI Guide
          </button>
        </div>

        {activeTab === 'AI Guide' ? (
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
                   fontSize: '14px',
                   lineHeight: '1.5'
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
                   placeholder="Type a message..."
                   style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '12px', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}
                 />
                 <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
                   <Send size={24} />
                 </button>
               </form>
             </div>
          </div>
        ) : activeTab === 'Quick Track' ? (
          <>
            <div style={cardStyle}>
              {/* Sliders for Sleep, Stress, Energy */}
              {[
                { label: 'Sleep', val: sleep, set: setSleep, min: 0, max: 12, step: 0.5, unit: 'h', icon: '☾' },
                { label: 'Stress', val: stress, set: setStress, min: 0, max: 100, step: 1, unit: '/10', icon: '⚡' },
                { label: 'Energy', val: energy, set: setEnergy, min: 0, max: 100, step: 1, unit: '/10', icon: '🔥' }
              ].map(s => (
                <div key={s.label} style={{ marginBottom: '28px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>
                     <span>{s.icon} {s.label}</span>
                     <span style={{ color: 'var(--text-secondary)' }}>{s.label === 'Sleep' ? s.val : Math.round(s.val/10)}{s.unit}</span>
                   </div>
                   <div style={{ position: 'relative', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                     <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${s.label === 'Sleep' ? (s.val/12)*100 : s.val}%`, backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}></div>
                     <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                   </div>
                </div>
              ))}
            </div>
            <button onClick={handleGenerateInsight} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', height: '56px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', marginBottom: '32px' }}>
              Generate AI Insight
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {["Smile today?", "Gratitude?", "Struggles?"].map(p => (
                <button key={p} onClick={() => setJournalText(prev => prev ? `${prev} ${p}` : p)} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}>
                  {p}
                </button>
              ))}
            </div>
            <div style={cardStyle}>
              <textarea 
                value={journalText} onChange={e => setJournalText(e.target.value)}
                placeholder="What's on your mind?"
                style={{ width: '100%', minHeight: '200px', border: 'none', outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', resize: 'none' }}
              />
            </div>
            <button onClick={handleGenerateInsight} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', height: '56px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', marginBottom: '32px' }}>
              Analyze Journal
            </button>
          </>
        )}

        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Recent Entries</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentEntries.map(entry => (
            <div key={entry.id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '16px', transition: 'var(--transition)' }}>
              <div style={{ fontSize: '28px' }}>{entry.mood >= 7 ? '😊' : entry.mood >= 4 ? '😐' : '😫'}</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {entry.type}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>Sleep {entry.sleep}h • Stress {entry.stress}/10 • Energy {entry.energy}/10</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
