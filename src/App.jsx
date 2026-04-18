import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Screens
import Splash from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Workout from './screens/Workout';
import Nutrition from './screens/Nutrition';
import Journal from './screens/Journal';
import AICompanion from './screens/AICompanion';
import Profile from './screens/Profile';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Full screen routes (No Navbar/Header) */}
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Layout routes (With Navbar/Header/Footer) */}
        <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/workout" element={<AppLayout><Workout /></AppLayout>} />
        <Route path="/nutrition" element={<AppLayout><Nutrition /></AppLayout>} />
        <Route path="/journal" element={<AppLayout><Journal /></AppLayout>} />
        <Route path="/chat" element={<AppLayout><AICompanion /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
