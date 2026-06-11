import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const blue = '#1565c0';

export default function WelcomePage({ onContinue }) {
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      flexDirection: 'column', gap: 0,
    }}>

      {/* Animated plane */}
      <div style={{ fontSize: 56, marginBottom: 24, animation: 'fly 1.5s ease-in-out infinite alternate' }}>
        ✈️
      </div>

      <style>{`
        @keyframes fly {
          from { transform: translateX(-10px) rotate(-5deg); }
          to   { transform: translateX(10px)  rotate(5deg);  }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div style={{ textAlign: 'center', animation: 'fadeUp .6s ease forwards', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#90caf9', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
          Welcome to
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>
          SkyCompare
        </div>

        {user && (
          <div style={{ fontSize: 18, color: '#bbdefb', marginBottom: 24 }}>
            {user.guest
              ? 'Browsing as Guest 👋'
              : `Hello, ${user.name}! 👋`}
          </div>
        )}

        <div style={{ fontSize: 14, color: '#90caf9', marginBottom: 40 }}>
          India's smartest flight comparison tool
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {['📈 Price Predictor','🔔 Fare Alerts','🏷️ Deal Scores','💺 Seat Trends','🗺️ Route Map'].map(f => (
            <span key={f} style={{
              background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, color: '#fff',
              border: '1px solid rgba(255,255,255,.2)',
            }}>
              {f}
            </span>
          ))}
        </div>

        <button onClick={onContinue} style={{
          padding: '13px 36px', borderRadius: 12, background: '#fff',
          color: blue, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,.2)',
        }}>
          Start Comparing Flights →
        </button>

        <div style={{ fontSize: 12, color: '#90caf9', marginTop: 16 }}>
          Auto-continuing in 3 seconds…
        </div>
      </div>
    </div>
  );
}
