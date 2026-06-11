import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider }  from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import CompareTray  from './components/CompareTray';
import FlightsPage  from './pages/FlightsPage';
import CalendarPage from './pages/CalendarPage';
import ComparePage  from './pages/ComparePage';
import BaggagePage  from './pages/BaggagePage';
import OTPPage      from './pages/OTPPage';
import MapPage      from './pages/MapPage';
import InsightsPage from './pages/InsightsPage';
import AuthPage     from './pages/AuthPage';
import WelcomePage  from './pages/WelcomePage';

/* ── Inner app — only rendered after login ── */
function MainApp() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', background: '#f5f7ff', paddingBottom: 90 }}>
        <Navbar />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
          <Routes>
            <Route path="/"         element={<FlightsPage />}  />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/compare"  element={<ComparePage />}  />
            <Route path="/baggage"  element={<BaggagePage />}  />
            <Route path="/otp"      element={<OTPPage />}      />
            <Route path="/map"      element={<MapPage />}      />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <CompareTray />
      </div>
    </AppProvider>
  );
}

/* ── Auth gate ── */
function AuthGate() {
  const { user, logout } = useAuth();
  /* 'auth' → show login/signup
     'welcome' → show welcome screen
     'app' → show main app          */
  const [screen, setScreen] = useState('auth');

  /* If user logs out go back to auth */
  React.useEffect(() => {
    if (!user) setScreen('auth');
  }, [user]);

  if (screen === 'auth' || !user) {
    return <AuthPage onAuth={() => setScreen('welcome')} />;
  }

  if (screen === 'welcome') {
    return <WelcomePage onContinue={() => setScreen('app')} />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  );
}
