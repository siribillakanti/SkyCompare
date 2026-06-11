import React from 'react';
import { useApp } from '../context/AppContext';

const blue = '#1565c0';

const FIELDS = [
  { label: 'Price',         fn: f => `₹${f.price.toLocaleString()}` },
  { label: 'Departure',     fn: f => f.dep },
  { label: 'Arrival',       fn: f => f.arr },
  { label: 'Duration',      fn: f => f.duration },
  { label: 'Stops',         fn: f => f.stops === 0 ? 'Non-stop' : `${f.stops} stop` },
  { label: 'Cabin Bag',     fn: f => f.baggage.cabin },
  { label: 'Check-in Bag',  fn: f => f.baggage.checkin },
  { label: 'Extra Bag',     fn: f => f.baggage.extra },
  { label: 'On-time %',     fn: f => `${f.airline.otp}%`, isOtp: true },
  { label: 'Deal Score',    fn: f => `${f.dealScore ?? '—'}/100`, isDeal: true },
];

const card = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '20px 24px' };

export default function ComparePage() {
  const { compareList, setCompareList, filteredFlights } = useApp();
  const flights = compareList.length > 0 ? compareList : filteredFlights.slice(0, 3);

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          Side-by-side Comparison
          {compareList.length > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: '#888', marginLeft: 8 }}>({compareList.length} selected)</span>}
        </div>
        {compareList.length > 0 && (
          <button onClick={() => setCompareList([])} style={{ fontSize: 12, color: '#d32f2f', border: '1px solid #ffcdd2', padding: '5px 12px', borderRadius: 7, cursor: 'pointer' }}>
            Clear selection
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e3e8f5' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#888', width: 130 }}>Feature</th>
              {flights.map(f => (
                <th key={f.id} style={{ padding: '10px 14px', textAlign: 'center', minWidth: 140 }}>
                  <div style={{ fontWeight: 600 }}>{f.airline.name}</div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: blue }}>₹{f.price.toLocaleString()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((field, fi) => (
              <tr key={fi} style={{ borderBottom: '1px solid #f0f3fa', background: fi % 2 === 0 ? '#fafbff' : '#fff' }}>
                <td style={{ padding: '9px 14px', fontSize: 12, color: '#666', fontWeight: 500 }}>{field.label}</td>
                {flights.map(f => {
                  const val      = field.fn(f);
                  const otpStyle = field.isOtp  ? { color: f.airline.otp >= 80 ? '#2e7d32' : '#e65100', fontWeight: 700 } : {};
                  const dealStyle= field.isDeal ? { color: (f.dealScore ?? 0) >= 70 ? '#2e7d32' : '#e65100', fontWeight: 700 } : {};
                  return <td key={f.id} style={{ padding: '9px 14px', textAlign: 'center', ...otpStyle, ...dealStyle }}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compareList.length === 0 && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#f0f4ff', borderRadius: 8, fontSize: 12, color: '#5c7cce' }}>
          <i className="ti ti-info-circle" style={{ marginRight: 5 }} />
          Showing cheapest 3 flights. Go to Flights tab and click "+ Compare" to choose specific ones.
        </div>
      )}
    </div>
  );
}
