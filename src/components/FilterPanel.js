import React from 'react';
import { AIRLINES } from '../data/mockData';
import { useApp }   from '../context/AppContext';

const STOP_OPTIONS = [['all','Any'],['0','Non-stop'],['1','1 Stop']];
const SORT_OPTIONS = [
  { value: 'price',     label: 'Price'     },
  { value: 'duration',  label: 'Duration'  },
  { value: 'departure', label: 'Departure' },
  { value: 'otp',       label: 'On-time %' },
];

const s = {
  wrap:   { display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', marginBottom: 14 },
  label:  { fontSize: 11, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  row:    { display: 'flex', gap: 6 },
  toggle: { padding: '7px 14px', borderRadius: 8, border: '1px solid #e3e8f5', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', color: '#555' },
  active: { background: '#1565c0', color: '#fff', borderColor: '#1565c0' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #e3e8f5', fontSize: 13, background: '#fff', color: '#1a1a2e', cursor: 'pointer' },
  hint:   { marginLeft: 'auto', fontSize: 12, color: '#aaa', paddingBottom: 2 },
};

export default function FilterPanel() {
  const { filterStops, setFilterStops, filterAirline, setFilterAirline, sortBy, setSortBy } = useApp();
  return (
    <div style={s.wrap}>
      <div>
        <div style={s.label}>Stops</div>
        <div style={s.row}>
          {STOP_OPTIONS.map(([v, l]) => (
            <button key={v} style={{ ...s.toggle, ...(filterStops === v ? s.active : {}) }} onClick={() => setFilterStops(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <div style={s.label}>Airline</div>
        <select style={s.select} value={filterAirline} onChange={e => setFilterAirline(e.target.value)}>
          <option value="all">All Airlines</option>
          {AIRLINES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div>
        <div style={s.label}>Sort by</div>
        <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div style={s.hint}><i className="ti ti-info-circle" style={{ marginRight: 4, verticalAlign: -1 }} />Add up to 3 flights to compare</div>
    </div>
  );
}
