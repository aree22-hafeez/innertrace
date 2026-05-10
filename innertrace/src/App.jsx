import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Screens
import Splash from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import ProfileSetup from './screens/ProfileSetup';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

import Journal from './screens/Journal';
import AIJournal from './screens/AIJournal';
import ChatAI from './screens/ChatAI';
import Workouts from './screens/Workouts';
import Nutrition from './screens/Nutrition';
import Profile from './screens/Profile';
import FitnessAI from './screens/FitnessAI';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><AppLayout><Journal /></AppLayout></ProtectedRoute>} />
            <Route path="/ai-journal" element={<ProtectedRoute><AppLayout><AIJournal /></AppLayout></ProtectedRoute>} />
            <Route path="/chat-ai" element={<ProtectedRoute><AppLayout><ChatAI /></AppLayout></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><AppLayout><Workouts /></AppLayout></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><AppLayout><Nutrition /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/fitness-ai" element={<ProtectedRoute><FitnessAI /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;