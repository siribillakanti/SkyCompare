import React from 'react';
import { BAGGAGE_POLICIES } from '../data/mockData';

const COLS = ['Airline','Cabin Bag','Check-in Bag','Extra Bag','Laptop','Liquids'];
const card = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '20px 24px' };

export default function BaggagePage() {
  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Baggage Policy Grid</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>{COLS.map(c => <th key={c} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#1565c0', fontSize: 12, background: '#f0f4ff', borderBottom: '2px solid #c5d5f5' }}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {BAGGAGE_POLICIES.map((p, i) => (
              <tr key={p.airline} style={{ borderBottom: '1px solid #f0f3fa', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                <td style={{ padding: '11px 14px', fontWeight: 600 }}>{p.airline}</td>
                <td style={{ padding: '11px 14px', color: '#555' }}>{p.cabin}</td>
                <td style={{ padding: '11px 14px', color: '#555' }}>{p.checkin}</td>
                <td style={{ padding: '11px 14px', color: '#c62828', fontWeight: 600 }}>{p.extra}</td>
                <td style={{ padding: '11px 14px', color: p.laptop === 'Allowed separately' ? '#2e7d32' : '#555' }}>{p.laptop}</td>
                <td style={{ padding: '11px 14px', color: '#555' }}>{p.liquid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', background: '#fff8e1', borderRadius: 8, fontSize: 12, color: '#795548' }}>
        <i className="ti ti-alert-circle" style={{ marginRight: 5, verticalAlign: -1 }} />
        Policies may vary by fare class and season. Always verify with the airline before travel.
      </div>
    </div>
  );
}
