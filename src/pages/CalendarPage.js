import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar  from '../components/SearchBar';
import { useApp } from '../context/AppContext';

const card = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '20px 24px', marginBottom: 14 };

export default function CalendarPage() {
  const { calendar, setDateOffset } = useApp();
  const minP = Math.min(...calendar.map(d => d.price));
  const maxP = Math.max(...calendar.map(d => d.price));

  return (
    <div>
      <SearchBar />
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Price Calendar — Next 14 Days</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(118px,1fr))', gap: 8, marginBottom: 24 }}>
          {calendar.map((d, i) => {
            const norm = (d.price - minP) / (maxP - minP);
            const bg   = d.low ? '#e8f5e9' : norm > 0.7 ? '#ffebee' : '#fff8e1';
            return (
              <div key={d.date} onClick={() => setDateOffset(i)}
                style={{ background: bg, border: '1px solid #e3e8f5', borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: '#666' }}>{d.label}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1565c0', margin: '4px 0' }}>₹{d.price.toLocaleString()}</div>
                {d.low && <span style={{ fontSize: 10, background: '#c8e6c9', color: '#1b5e20', padding: '1px 6px', borderRadius: 10 }}>Best</span>}
              </div>
            );
          })}
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Price Trend</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calendar} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickFormatter={v => v.split(' ').slice(0,2).join(' ')} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Price']} />
              <Line type="monotone" dataKey="price" stroke="#1565c0" strokeWidth={2.5} dot={{ fill: '#1565c0', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
