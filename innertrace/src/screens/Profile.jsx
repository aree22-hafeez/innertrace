import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Eye, Shield, AlertTriangle, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { userApi } from '../api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [persona, setPersona] = useState(user?.persona || 'Wellness Enthusiast');
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [toggles, setToggles] = useState({
    dailyReminders: true,
    mealReminders: true,
    moodCheckins: true,
    highContrast: false,
    voiceInteraction: true
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile(user.id, {
        name,
        persona,
        settings_json: user.settings_json
      });
      updateUser({ name, persona });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setLoading(true);
    try {
      await userApi.deleteProfile(user.id);
      logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
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

  const sectionStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    border: '1px solid var(--border-primary)',
    padding: '28px',
    marginBottom: '24px',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'var(--transition)'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid var(--border-primary)',
    backgroundColor: 'var(--bg-tertiary)',
    fontSize: '15px',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '24px',
    fontWeight: '500'
  };

  const personaOptions = ['Student', 'Working Professional', 'Older Adult', 'Wellness Enthusiast'];

  const renderToggle = (key, title, subtitle) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-primary)' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</div>
      </div>
      <div 
        onClick={() => handleToggle(key)}
        style={{ 
          width: '52px', height: '28px', borderRadius: '14px', 
          backgroundColor: toggles[key] ? 'var(--color-primary)' : 'var(--bg-tertiary)',
          position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s'
        }}
      >
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white',
          position: 'absolute', top: '2px', left: toggles[key] ? '26px' : '2px',
          transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '650px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Settings</h1>
          <button 
            onClick={logout}
            style={{ backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '14px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '32px', fontWeight: '900', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
              {name ? name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{name || 'User'}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{persona}</div>
            </div>
          </div>

          <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'block' }}>Display Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

          <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>I am a...</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {personaOptions.map(opt => (
              <button key={opt} onClick={() => setPersona(opt)} style={{ padding: '14px', borderRadius: '16px', border: `2px solid ${persona === opt ? 'var(--color-primary)' : 'var(--border-primary)'}`, backgroundColor: persona === opt ? 'var(--color-primary-light)' : 'transparent', color: persona === opt ? 'var(--color-primary)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'var(--transition)' }}>{opt}</button>
            ))}
          </div>

          <button onClick={handleSaveProfile} disabled={loading} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '18px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>

        {/* Notifications */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Bell size={20} color="var(--color-primary)" /> Notifications
          </div>
          {renderToggle('dailyReminders', 'Daily Reminders', 'Get reminded to log your wellness reflection')}
          {renderToggle('mealReminders', 'Meal Reminders', 'Track your daily nutrition and goals')}
          {renderToggle('moodCheckins', 'Mood Check-ins', 'Receive personalized wellness prompts')}
        </div>

        {/* Accessibility */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Eye size={20} color="var(--color-primary)" /> Accessibility
          </div>
          
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Font Size</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)' }}>{fontSize}px</span>
            </div>
            <div style={{ position: 'relative', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '5px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${((fontSize-12)/12)*100}%`, backgroundColor: 'var(--color-primary)', borderRadius: '5px' }}></div>
              <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>

          {renderToggle('highContrast', 'High Contrast Mode', 'Enhance text legibility and focus')}
          {renderToggle('voiceInteraction', 'Voice Interaction', 'Enable voice commands across the app')}
        </div>

        {/* Danger Zone */}
        <div style={{ ...sectionStyle, border: '1px solid #FCA5A5', backgroundColor: 'rgba(254, 226, 226, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '18px', fontWeight: '800', color: '#EF4444' }}>
            <AlertTriangle size={20} /> Account Deletion
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>This action is permanent and will delete all your personal wellness data, journals, and progress history.</p>
          <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'block' }}>Type <span style={{color: '#EF4444'}}>"DELETE"</span> to confirm</label>
          <input type="text" placeholder="Type here" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
          <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE' || loading} style={{ width: '100%', backgroundColor: deleteConfirm === 'DELETE' ? '#EF4444' : 'var(--bg-tertiary)', color: deleteConfirm === 'DELETE' ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '18px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed', transition: 'var(--transition)' }}>
            {loading ? 'Deleting Account...' : 'Delete My Account'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
