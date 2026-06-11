import React from 'react';
import { AIRLINES, ROUTE_OTP } from '../data/mockData';

const card = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '20px 24px', marginBottom: 14 };
const otpColor     = v => v >= 80 ? '#2e7d32' : v >= 70 ? '#f57c00' : '#d32f2f';
const otpBarColor  = v => v >= 80 ? '#43a047' : v >= 70 ? '#ffa726' : '#ef5350';

export default function OTPPage() {
  return (
    <div>
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>On-Time Performance by Airline</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
          {AIRLINES.map(a => (
            <div key={a.id} style={{ border: '1px solid #e3e8f5', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{a.name}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: otpColor(a.otp) }}>{a.otp}%</div>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>on-time flights</div>
              <div style={{ height: 8, background: '#f0f3fa', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.otp}%`, background: otpBarColor(a.otp), borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Route-wise OTP (%)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                <th style={{ padding: '9px 14px', textAlign: 'left', fontSize: 12, color: '#888', borderBottom: '2px solid #c5d5f5' }}>Route</th>
                {AIRLINES.map(a => <th key={a.id} style={{ padding: '9px 14px', textAlign: 'center', fontSize: 12, color: '#888', borderBottom: '2px solid #c5d5f5' }}>{a.name.split(' ')[0]}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROUTE_OTP.map((row, i) => (
                <tr key={row.route} style={{ borderBottom: '1px solid #f0f3fa', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                  <td style={{ padding: '9px 14px', fontWeight: 500 }}>{row.route}</td>
                  {AIRLINES.map(a => (
                    <td key={a.id} style={{ padding: '9px 14px', textAlign: 'center', fontWeight: 700, color: otpColor(row[a.id]) }}>{row[a.id]}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
