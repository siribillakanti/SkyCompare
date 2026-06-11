import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const blue  = '#1565c0';
const green = '#2e7d32';

const s = {
  card:         { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '16px 20px', marginBottom: 10, transition: 'border .15s, box-shadow .15s' },
  cardSelected: { border: '1.5px solid #1565c0', boxShadow: '0 2px 12px rgba(21,101,192,.1)' },
  row:          { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  logoBox:      { width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' },
  time:         { fontSize: 22, fontWeight: 700, lineHeight: 1 },
  airport:      { fontSize: 11, color: '#888', marginTop: 2 },
  midLine:      { height: 1, background: '#e3e8f5', position: 'relative', margin: '5px 0' },
  stopSpan:     { position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 500, background: '#fff', border: '1px solid #e3e8f5' },
  otpTag:       { fontSize: 11, padding: '2px 7px', borderRadius: 10, fontWeight: 500, display: 'inline-block', marginTop: 4 },
  price:        { fontSize: 22, fontWeight: 700, color: blue },
  perPax:       { fontSize: 11, color: '#999', marginTop: 2 },
  btnBook:      { padding: '8px 0', borderRadius: 8, background: blue, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', width: '100%' },
  btnCmp:       { padding: '7px 0', borderRadius: 8, border: '1px solid #e3e8f5', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', width: '100%' },
  btnCmpOn:     { background: '#e3f2fd', color: blue, borderColor: blue },
  footer:       { marginTop: 10, borderTop: '1px solid #f0f3fa', paddingTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' },
  footItem:     { fontSize: 12, color: '#777', display: 'flex', alignItems: 'center', gap: 4 },
  expandBtn:    { fontSize: 12, color: blue, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' },
  expandBox:    { marginTop: 10, padding: '10px 14px', background: '#f7f9ff', borderRadius: 8, fontSize: 13, color: '#555', lineHeight: 1.7 },
};

export default function FlightCard({ flight }) {
  const { compareList, toggleCompare } = useApp();
  const [expanded, setExpanded] = useState(false);
  const inCompare = !!compareList.find(x => x.id === flight.id);
  const otpGood   = flight.airline.otp >= 80;

  return (
    <div style={{ ...s.card, ...(inCompare ? s.cardSelected : {}) }}>
      <div style={s.row}>
        {/* Airline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
          <div style={{ ...s.logoBox, background: flight.airline.color }}>{flight.airline.id}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{flight.airline.name}</div>
            <div style={{ fontSize: 11, color: '#999' }}>{flight.airline.id}-{1000 + (parseInt(flight.id.split('-')[2]) * 137) % 8000}</div>
          </div>
        </div>

        {/* Dep */}
        <div style={{ textAlign: 'center', minWidth: 72 }}>
          <div style={s.time}>{flight.dep}</div>
          <div style={s.airport}>{flight.from}</div>
        </div>

        {/* Middle */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 110 }}>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{flight.duration}</div>
          <div style={s.midLine}>
            <span style={{ ...s.stopSpan, color: flight.stops ? '#e65100' : green, borderColor: flight.stops ? '#ffe0b2' : '#c8e6c9' }}>
              {flight.stops ? `${flight.stops} stop` : 'Non-stop'}
            </span>
          </div>
          <span style={{ ...s.otpTag, background: otpGood ? '#e8f5e9' : '#fff3e0', color: otpGood ? green : '#e65100' }}>
            {flight.airline.otp}% on-time
          </span>
        </div>

        {/* Arr */}
        <div style={{ textAlign: 'center', minWidth: 72 }}>
          <div style={s.time}>{flight.arr}</div>
          <div style={s.airport}>{flight.to}</div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right', minWidth: 100 }}>
          <div style={s.price}>₹{flight.price.toLocaleString()}</div>
          <div style={s.perPax}>per person</div>
          <div style={{ fontSize: 11, marginTop: 2, color: flight.seats <= 5 ? '#d32f2f' : green, fontWeight: 500 }}>
            {flight.seats} seats left
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 110 }}>
          <button style={s.btnBook}>Book Now</button>
          <button style={{ ...s.btnCmp, ...(inCompare ? s.btnCmpOn : {}) }} onClick={() => toggleCompare(flight)}>
            {inCompare ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <span style={s.footItem}><i className="ti ti-briefcase" style={{ fontSize: 13 }} /> Cabin: {flight.baggage.cabin}</span>
        <span style={s.footItem}><i className="ti ti-briefcase-2" style={{ fontSize: 13 }} /> Check-in: {flight.baggage.checkin}</span>
        <button style={s.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Hide details' : '▼ More details'}
        </button>
      </div>

      {expanded && (
        <div style={s.expandBox}>
          <strong>Extra baggage:</strong> ₹1200/kg &nbsp;|&nbsp;
          <strong>Meal:</strong> Paid &nbsp;|&nbsp;
          <strong>Seat selection:</strong> Paid &nbsp;|&nbsp;
          <strong>Refund:</strong> Partial (₹300 fee) &nbsp;|&nbsp;
          <strong>Web check-in:</strong> Opens 48h before departure
        </div>
      )}
    </div>
  );
}
