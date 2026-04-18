import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Screens
import Splash from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;