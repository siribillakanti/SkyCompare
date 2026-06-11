import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const blue = '#1565c0';

const s = {
  tray:    { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '2px solid ' + blue, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 200, flexWrap: 'wrap', boxShadow: '0 -2px 20px rgba(21,101,192,.12)' },
  label:   { fontWeight: 700, fontSize: 13, color: blue, display: 'flex', alignItems: 'center', gap: 6 },
  chip:    { display: 'flex', alignItems: 'center', gap: 8, background: '#f0f4ff', borderRadius: 8, padding: '6px 10px', fontSize: 13 },
  name:    { fontWeight: 500 },
  price:   { fontWeight: 700, color: blue },
  remove:  { color: '#aaa', fontSize: 16, cursor: 'pointer', lineHeight: 1, background: 'none', border: 'none' },
  btnCmp:  { marginLeft: 'auto', padding: '9px 22px', borderRadius: 9, background: blue, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' },
};

export default function CompareTray() {
  const { compareList, toggleCompare } = useApp();
  const navigate = useNavigate();
  if (compareList.length === 0) return null;
  return (
    <div style={s.tray} className="no-print">
      <div style={s.label}><i className="ti ti-columns" style={{ fontSize: 16 }} /> Compare ({compareList.length}/3)</div>
      {compareList.map(f => (
        <div key={f.id} style={s.chip}>
          <span style={s.name}>{f.airline.name}</span>
          <span style={s.price}>₹{f.price.toLocaleString()}</span>
          <button style={s.remove} onClick={() => toggleCompare(f)}>×</button>
        </div>
      ))}
      <button style={s.btnCmp} onClick={() => navigate('/compare')}>Compare Now →</button>
    </div>
  );
}
