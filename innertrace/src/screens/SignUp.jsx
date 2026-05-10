import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password, persona: 'Wellness Enthusiast' });
      login({ id: data.userId, name, email, persona: 'Wellness Enthusiast' });
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    fontFamily: 'Inter, sans-serif',
    padding: '20px',
    transition: 'var(--transition)'
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    width: '100%',
    maxWidth: '460px',
    borderRadius: '28px',
    padding: '48px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'var(--transition)'
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '16px',
    padding: '0 18px',
    height: '56px',
    boxSizing: 'border-box',
    border: '1px solid var(--border-primary)',
    transition: 'var(--transition)'
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '15px',
    color: 'var(--text-primary)',
    height: '100%',
    fontWeight: '500'
  };

  const submitBtnStyle = {
    width: '100%',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    height: '56px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '12px',
    marginBottom: '32px',
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'var(--transition)'
  };

  const socialBtnStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    height: '52px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    transition: 'var(--transition)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto', color: 'white', fontSize: '28px', fontWeight: '900' }}>
            ✨
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-1px' }}>Join InnerTrace</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>Begin your journey to a better you.</p>
        </div>

        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          {error && <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '20px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Full Name</label>
            <div style={inputContainerStyle}>
              <User size={18} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="John Doe" 
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Email</label>
            <div style={inputContainerStyle}>
              <Mail size={18} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Password</label>
            <div style={inputContainerStyle}>
              <Lock size={18} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" style={submitBtnStyle} disabled={loading}>
            {loading ? 'Creating Account...' : (
              <>
                Get Started <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-primary)' }}></div>
          <span style={{ padding: '0 16px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-primary)' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '32px' }}>
          <button style={socialBtnStyle}>Google</button>
          <button style={socialBtnStyle}>Apple</button>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Already have an account? <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;