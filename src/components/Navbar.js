import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { path: '/',         icon: 'ti-plane',     label: 'Flights'        },
  { path: '/calendar', icon: 'ti-calendar',  label: 'Price Calendar' },
  { path: '/compare',  icon: 'ti-columns',   label: 'Compare'        },
  { path: '/baggage',  icon: 'ti-briefcase', label: 'Baggage Policy' },
  { path: '/otp',      icon: 'ti-chart-bar', label: 'OTP Stats'      },
  { path: '/map',      icon: 'ti-map-2',     label: 'Route Map'      },
  { path: '/insights', icon: 'ti-brain',     label: 'Price Intel', badge: 'NEW' },
];

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#fff', borderBottom: '1px solid #e3e8f5',
    padding: '0 20px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: 58,
    boxShadow: '0 1px 8px rgba(21,101,192,.06)',
  },
  logo: {
    fontSize: 18, fontWeight: 800, color: '#1565c0',
    display: 'flex', alignItems: 'center', gap: 7,
    letterSpacing: -0.5, flexShrink: 0,
  },
  tabs: { display: 'flex', overflowX: 'auto', flex: 1, justifyContent: 'center' },
  tab: {
    padding: '0 11px', height: 58, display: 'flex', alignItems: 'center',
    gap: 5, fontSize: 12, fontWeight: 500, color: '#666',
    borderBottom: '2px solid transparent', transition: 'all .15s',
    whiteSpace: 'nowrap', textDecoration: 'none',
  },
  activeTab: { color: '#1565c0', borderBottom: '2px solid #1565c0' },
  badge: {
    fontSize: 9, fontWeight: 700, background: '#e53935', color: '#fff',
    padding: '1px 5px', borderRadius: 8,
  },
  userArea: {
    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: '#1565c0', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#333', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logoutBtn: {
    padding: '6px 12px', borderRadius: 8, border: '1px solid #e3e8f5',
    fontSize: 12, fontWeight: 500, color: '#888', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 4, transition: 'all .15s',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={s.nav}>
      {/* Logo */}
      <div style={s.logo}>
        <i className="ti ti-plane-departure" />
        SkyCompare
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map(t => (
          <NavLink key={t.path} to={t.path} end={t.path === '/'}
            style={({ isActive }) => ({ ...s.tab, ...(isActive ? s.activeTab : {}) })}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} />
            {t.label}
            {t.badge && <span style={s.badge}>{t.badge}</span>}
          </NavLink>
        ))}
      </div>

      {/* User area */}
      {user && (
        <div style={s.userArea}>
          <div style={{
            ...s.avatar,
            background: user.guest ? '#78909c' : user.provider === 'google' ? '#ea4335' : '#1565c0',
          }}>
            {user.avatar}
          </div>
          <div style={s.userName}>{user.name}</div>
          <button style={s.logoutBtn} onClick={logout}>
            <i className="ti ti-logout" style={{ fontSize: 13 }} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
