import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    fontFamily: 'Inter, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '440px',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1A1D2D',
    margin: '0 0 12px 0'
  };

  const subtitleStyle = {
    fontSize: '15px',
    color: '#808291',
    marginBottom: '32px'
  };

  const inputGroupStyle = {
    width: '100%',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  const labelStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D2D',
    marginBottom: '10px'
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F5F5F7',
    borderRadius: '12px',
    padding: '0 16px',
    height: '48px',
    boxSizing: 'border-box'
  };

  const iconStyle = {
    color: '#9CA3AF',
    marginRight: '12px'
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#1A1D2D',
    height: '100%'
  };

  const submitBtnStyle = {
    width: '100%',
    backgroundColor: '#8B8E9D', // Matches the exact purple/gray from the design
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '24px',
    height: '52px',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
    marginBottom: '32px',
    transition: 'opacity 0.2s'
  };

  const dividerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '24px'
  };

  const lineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#E5E7EB'
  };

  const dividerTextStyle = {
    padding: '0 12px',
    fontSize: '13px',
    color: '#9CA3AF'
  };

  const socialContainerStyle = {
    display: 'flex',
    gap: '16px',
    width: '100%',
    marginBottom: '32px'
  };

  const socialBtnStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '22px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1D2D'
  };

  const footerTextStyle = {
    fontSize: '13px',
    color: '#808291'
  };

  // Basic Google Icon SVG
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1A1D2D"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#1A1D2D"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#1A1D2D"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#1A1D2D"/>
    </svg>
  );

  // Basic Apple Icon SVG
  const AppleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1A1D2D" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.63 11.23C16.66 14.39 19.34 15.4 19.37 15.41C19.34 15.5 18.91 16.94 17.88 18.42C16.99 19.7 16.03 20.97 14.59 20.99C13.16 21.02 12.69 20.14 11.08 20.14C9.46 20.14 8.95 20.99 7.57 21.02C6.18 21.05 5.09 19.62 4.19 18.33C2.33 15.65 0.94 10.95 2.85 7.68C3.8 6.06 5.48 5.02 7.33 5.02C8.71 5.02 9.99 5.95 10.83 5.95C11.66 5.95 13.2 4.86 14.86 4.86C15.49 4.86 17.26 4.92 18.44 6.64C18.35 6.7 16.6 7.7 16.63 11.23V11.23Z" />
      <path d="M11.96 3.31C12.72 2.38 13.24 1.09 13.11 -0.19C11.99 0.26 10.59 0.97 9.8 1.93C9.11 2.76 8.5 4.09 8.67 5.34C9.92 5.43 11.2 4.24 11.96 3.31V3.31Z" />
    </svg>
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>Sign in to continue your wellness journey</p>

        <form style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <div style={inputContainerStyle}>
              <Mail size={18} style={iconStyle} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                style={inputStyle}
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputContainerStyle}>
              <Lock size={18} style={iconStyle} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="........" 
                style={inputStyle}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} style={iconStyle} /> : <Eye size={18} style={iconStyle} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={submitBtnStyle}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Sign In
          </button>

        </form>

        <div style={dividerContainerStyle}>
          <div style={lineStyle}></div>
          <span style={dividerTextStyle}>Or continue with</span>
          <div style={lineStyle}></div>
        </div>

        <div style={socialContainerStyle}>
          <button style={socialBtnStyle}>
            <GoogleIcon /> Google
          </button>
          <button style={socialBtnStyle}>
            <AppleIcon /> Apple
          </button>
        </div>

        <div style={footerTextStyle}>
          Don't have an account? <Link to="/signup" style={{ color: '#808291', textDecoration: 'underline' }}>Sign up</Link>
        </div>

      </div>
    </div>
  );
};

export default SignIn;