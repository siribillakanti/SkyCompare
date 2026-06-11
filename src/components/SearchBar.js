import React from 'react';
import { ROUTES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const s = {
  wrap: {
    background: 'linear-gradient(135deg,#f0f4ff 0%,#e8f0fe 100%)',
    border: '1px solid #c5d5f5', borderRadius: 14,
    padding: '16px 20px', marginBottom: 14,
    display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end',
  },
  field:   { flex: 1, minWidth: 180 },
  label:   { fontSize: 11, color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  select:  { width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #dde3f5', fontSize: 14, background: '#fff', color: '#1a1a2e', cursor: 'pointer' },
  dateRow: { display: 'flex', alignItems: 'center', gap: 6 },
  dateBox: { flex: 1, padding: '9px 12px', background: '#fff', border: '1px solid #dde3f5', borderRadius: 9, textAlign: 'center', fontWeight: 600, fontSize: 14 },
  arrowBtn:{ padding: '9px 13px', borderRadius: 9, border: '1px solid #dde3f5', background: '#fff', fontSize: 16, color: '#1565c0', cursor: 'pointer', fontWeight: 700 },
  actions: { display: 'flex', gap: 8 },
  btnPrimary: { padding: '9px 20px', borderRadius: 9, background: '#1565c0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  btnOutline: { padding: '9px 14px', borderRadius: 9, background: '#fff', color: '#1565c0', fontSize: 13, fontWeight: 500, border: '1px solid #c5d5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
};

export default function SearchBar() {
  const { routeIdx, setRouteIdx, dateOffset, setDateOffset, shareLink, exportCSV } = useApp();
  const selDate = new Date();
  selDate.setDate(selDate.getDate() + dateOffset);
  const dateStr = selDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={s.wrap}>
      <div style={s.field}>
        <div style={s.label}>Route</div>
        <select style={s.select} value={routeIdx} onChange={e => setRouteIdx(+e.target.value)}>
          {ROUTES.map((r, i) => <option key={i} value={i}>{r.fromCity} → {r.toCity}</option>)}
        </select>
      </div>
      <div style={s.field}>
        <div style={s.label}>Travel Date</div>
        <div style={s.dateRow}>
          <button style={s.arrowBtn} onClick={() => setDateOffset(Math.max(0, dateOffset - 1))}>‹</button>
          <div style={s.dateBox}>{dateStr}</div>
          <button style={s.arrowBtn} onClick={() => setDateOffset(dateOffset + 1)}>›</button>
        </div>
      </div>
      <div style={s.actions}>
        <button style={s.btnPrimary}><i className="ti ti-search" style={{ fontSize: 15 }} /> Search</button>
        <button style={s.btnOutline} onClick={shareLink}><i className="ti ti-share" style={{ fontSize: 15 }} /> Share</button>
        <button style={s.btnOutline} onClick={exportCSV}><i className="ti ti-file-spreadsheet" style={{ fontSize: 15 }} /> Export</button>
      </div>
    </div>
  );
}
