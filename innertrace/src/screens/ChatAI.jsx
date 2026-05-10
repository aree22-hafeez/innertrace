import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Mic, Brain } from 'lucide-react';
import { aiApi } from '../api';
import { useAuth } from '../context/AuthContext';

const ChatAI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: "Hello! I'm your InnerTrace wellness assistant. How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await aiApi.getChatHistory(user.id);
        if (history && history.length > 0) {
          const formatted = history.map(h => ([
            { id: `u-${h.id}`, type: 'user', content: h.message },
            { id: `b-${h.id}`, type: 'bot', content: h.response }
          ])).flat();
          setMessages(prev => [...prev, ...formatted]);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    if (user?.id) fetchHistory();
  }, [user?.id]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const data = await aiApi.chat(user.id, inputText);
      const botMessage = { id: Date.now() + 1, type: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { id: Date.now() + 1, type: 'bot', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerStyle = {
    backgroundColor: 'var(--bg-primary)',
    height: 'calc(100vh - 80px)',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    transition: 'var(--transition)'
  };

  const chatContainerStyle = {
    flex: 1,
    padding: '40px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const messageStyle = (type) => ({
    backgroundColor: type === 'bot' ? 'var(--bg-secondary)' : 'var(--color-primary)',
    color: type === 'bot' ? 'var(--text-primary)' : 'white',
    padding: '16px 22px',
    borderRadius: type === 'bot' ? '24px 24px 24px 4px' : '24px 24px 4px 24px',
    maxWidth: '80%',
    alignSelf: type === 'bot' ? 'flex-start' : 'flex-end',
    boxShadow: 'var(--shadow-sm)',
    fontSize: '15px',
    lineHeight: '1.6',
    border: type === 'bot' ? '1px solid var(--border-primary)' : 'none',
    transition: 'var(--transition)'
  });

  const bottomAreaStyle = {
    backgroundColor: 'var(--bg-secondary)',
    padding: '24px 20px 40px 20px',
    borderTop: '1px solid var(--border-primary)',
    transition: 'var(--transition)'
  };

  const suggestionPillStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '16px',
    padding: '10px 18px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'var(--transition)'
  };

  const inputWrapperStyle = {
    flex: 1,
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '20px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    border: '1px solid var(--border-primary)',
    transition: 'var(--transition)'
  };

  const sendButtonStyle = {
    width: '52px',
    height: '52px',
    borderRadius: '18px',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
  };

  return (
    <div style={containerStyle}>
      <div style={chatContainerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: 'var(--color-primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px auto' }}>
            <Brain size={24} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>AI Wellness Coach</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Always active • Always helpful</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} style={messageStyle(msg.type)}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ ...messageStyle('bot'), display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite' }}></div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite 0.2s' }}></div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite 0.4s' }}></div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Coach is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={bottomAreaStyle}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
            <button onClick={() => setInputText('How is my wellness score?')} style={suggestionPillStyle}>How is my wellness score?</button>
            <button onClick={() => setInputText('Recommend a workout')} style={suggestionPillStyle}>Recommend a workout</button>
            <button onClick={() => setInputText('Suggest a healthy dinner')} style={suggestionPillStyle}>Suggest a healthy dinner</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={inputWrapperStyle}>
              <input 
                type="text" 
                placeholder="Message your coach..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}
              />
              <Mic size={22} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            </div>
            <button onClick={handleSend} style={sendButtonStyle} disabled={!inputText.trim() || isTyping}>
              <Send size={22} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ChatAI;
