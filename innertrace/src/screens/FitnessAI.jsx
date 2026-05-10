import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Sparkles, ArrowLeft, CheckCircle2, Loader2, Brain } from 'lucide-react';
import { fitnessApi, workoutApi } from '../api';
import { useAuth } from '../context/AuthContext';

const FitnessAI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: "Hi there! I'm your Fitness AI Coach. To create the perfect workout plan for you, I need to know a few details: your height, weight, age, and any medical history or injuries I should be aware of. Would you like to tell me now?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(null, transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
        return;
      }
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const text = customText || inputText;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/fitness/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: text })
      });
      const data = await response.json();
      
      const botMsg = { id: Date.now() + 1, type: 'bot', content: data.response };
      setMessages(prev => [...prev, botMsg]);
      speak(data.response);

      if (data.response.toLowerCase().includes('ready to generate') || data.response.toLowerCase().includes('recorded them')) {
        if (text.match(/(\d+)\s*(cm|kg|years)/i)) {
           handleOnboardingComplete({ height: '175cm', weight: '70kg', age: 25, medicalHistory: 'None' });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: "I'm having a bit of trouble connecting. Let's try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOnboardingComplete = async (data) => {
    setIsTyping(true);
    try {
      await fitnessApi.saveProfile({ userId: user.id, ...data });
      await workoutApi.generate({ userId: user.id, type: 'Strength', duration: 30 });
      const finalMsg = "Perfect! I've saved your profile and generated your first personalized workout plan. You can see it in the Workouts section now.";
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: finalMsg }]);
      speak(finalMsg);
      setOnboardingComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', transition: 'var(--transition)' }}>
      <header style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10, transition: 'var(--transition)' }}>
        <button onClick={() => navigate('/workouts')} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', cursor: 'pointer', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}><Brain size={20} color="var(--color-primary)" /> Fitness Coach</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{isListening ? 'Listening...' : isTyping ? 'Coach is thinking...' : 'Voice mode active'}</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '32px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ alignSelf: msg.type === 'bot' ? 'flex-start' : 'flex-end', maxWidth: '85%', padding: '18px 22px', borderRadius: msg.type === 'bot' ? '24px 24px 24px 4px' : '24px 24px 4px 24px', backgroundColor: msg.type === 'bot' ? 'var(--bg-secondary)' : 'var(--color-primary)', border: msg.type === 'bot' ? '1px solid var(--border-primary)' : 'none', color: msg.type === 'bot' ? 'var(--text-primary)' : 'white', lineHeight: '1.6', fontSize: '15px', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)' }}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '16px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', display: 'flex', gap: '4px', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite' }}></div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite 0.2s' }}></div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite 0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {onboardingComplete && (
        <div style={{ padding: '0 20px 24px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <CheckCircle2 size={40} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)' }}>All Set!</h3>
            <button onClick={() => navigate('/workouts')} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '16px', padding: '14px 32px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>View Your Plan</button>
          </div>
        </div>
      )}

      <footer style={{ padding: '24px 20px 40px 20px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', transition: 'var(--transition)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '16px', width: '100%', alignItems: 'center' }}>
          <button onClick={toggleListening} style={{ width: '60px', height: '60px', borderRadius: '20px', border: 'none', background: isListening ? '#EF4444' : 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'var(--transition)', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <form onSubmit={(e) => handleSendMessage(e)} style={{ flex: 1, display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type details..." style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '20px', padding: '18px 24px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', fontWeight: '500', transition: 'var(--transition)' }} />
            </div>
            <button type="submit" style={{ width: '60px', height: '60px', borderRadius: '20px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'var(--transition)', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
              <Send size={24} />
            </button>
          </form>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default FitnessAI;
