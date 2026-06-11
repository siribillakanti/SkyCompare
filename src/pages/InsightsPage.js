import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  generatePricePrediction, generateSeatTrend,
  BOOKING_TIPS, getFareAlertSuggestion, ROUTES,
} from '../data/mockData';

const blue   = '#1565c0';
const green  = '#2e7d32';
const orange = '#e65100';
const red    = '#c62828';
const purple = '#6a1b9a';
const card   = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 14, padding: '22px 24px', marginBottom: 16 };

/* ── Custom Tooltip ── */
function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#fff', border: '1px solid #e3e8f5', borderRadius: 9, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: blue, fontWeight: 700, fontSize: 15 }}>₹{payload[0].value?.toLocaleString()}</div>
      {d.predicted && <div style={{ color: '#888', marginTop: 4 }}>Confidence: <span style={{ fontWeight: 600, color: d.confidence > 60 ? green : orange }}>{d.confidence}%</span></div>}
      {d.change !== 0 && <div style={{ color: d.change > 0 ? red : green, marginTop: 2 }}>{d.change > 0 ? '▲' : '▼'} {Math.abs(d.change)}% vs prev week</div>}
    </div>
  );
}

/* ══ 1. Price Predictor ══ */
function PricePredictor({ routeIdx }) {
  const data     = useMemo(() => generatePricePrediction(routeIdx), [routeIdx]);
  const current  = data[0].price;
  const lowest   = Math.min(...data.map(d => d.price));
  const highest  = Math.max(...data.map(d => d.price));
  const bestWeek = data.find(d => d.price === lowest);
  const worstWk  = data.find(d => d.price === highest);
  const nextP    = data[1]?.price ?? current;

  const rec = nextP > current * 1.05
    ? { text: 'Book Now', color: green,  bg: '#e8f5e9', icon: '✅', reason: `Prices predicted to rise ${Math.round(((nextP - current)/current)*100)}% next week.` }
    : nextP < current * 0.95
    ? { text: 'Wait',     color: orange, bg: '#fff3e0', icon: '⏳', reason: `Prices may drop ${Math.round(((current-nextP)/current)*100)}% next week.` }
    : { text: 'Flexible', color: blue,   bg: '#e3f2fd', icon: '🔁', reason: 'Prices are stable. Book when convenient.' };

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>📈 Price Predictor — Next 8 Weeks</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Based on historical demand, seasonal trends & festival calendar</div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label:'Current Price',  value:`₹${current.toLocaleString()}`,         color: blue,   bg:'#e3f2fd' },
          { label:'Predicted Low',  value:`₹${lowest.toLocaleString()}`,           color: green,  bg:'#e8f5e9' },
          { label:'Predicted High', value:`₹${highest.toLocaleString()}`,          color: red,    bg:'#ffebee' },
          { label:'Best Week',      value: bestWeek.week.replace('\n',' '),        color: purple, bg:'#f3e5f5' },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 240, marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={blue} stopOpacity={0.15} />
                <stop offset="95%" stopColor={blue} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} tickFormatter={v => v.split(' ')[0]} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
            <Tooltip content={<PriceTooltip />} />
            <ReferenceLine y={current} stroke={orange} strokeDasharray="4 3" label={{ value:'Today', fontSize:10, fill:orange }} />
            <Area type="monotone" dataKey="price" stroke={blue} strokeWidth={2.5} fill="url(#pGrad)"
              dot={({ cx, cy, payload }) => (
                <circle key={payload.week} cx={cx} cy={cy} r={payload.predicted ? 4 : 6}
                  fill={payload.predicted ? '#fff' : blue}
                  stroke={payload.price === lowest ? green : payload.price === highest ? red : blue}
                  strokeWidth={payload.price===lowest||payload.price===highest ? 2.5 : 1.5}
                />
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendation box */}
      <div style={{ background: rec.bg, border: `1px solid ${rec.color}30`, borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 24 }}>{rec.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: rec.color, fontSize: 14, marginBottom: 4 }}>Recommendation: {rec.text}</div>
          <div style={{ fontSize: 13, color: '#555' }}>{rec.reason}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
            Best week: <strong>{bestWeek.week.replace('\n',' ')}</strong> · Avoid: <strong>{worstWk.week.replace('\n',' ')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ 2. Deal Score ══ */
function DealScorePanel() {
  const { filteredFlights } = useApp();
  const flights = filteredFlights.slice(0, 5);

  const scoreColor = s => s >= 80 ? green : s >= 60 ? blue : s >= 40 ? orange : red;
  const scoreLabel = s => s >= 80 ? 'Excellent Deal' : s >= 60 ? 'Good Deal' : s >= 40 ? 'Average' : 'Overpriced';

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🏷️ Deal Score — How Good Is Each Flight?</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Score compares price vs historical average, stops, OTP & seat availability</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {flights.map(f => {
          const score = f.dealScore ?? 50;
          const col   = scoreColor(score);
          return (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#fafbff', borderRadius: 10, border: '1px solid #e3e8f5' }}>
              <div style={{ minWidth: 110, fontWeight: 600, fontSize: 13 }}>{f.airline.name}</div>
              <div style={{ minWidth: 80, fontWeight: 700, color: blue }}>₹{f.price.toLocaleString()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, background: '#e8eaf6', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: col, borderRadius: 5, transition: 'width .6s' }} />
                </div>
              </div>
              <div style={{ minWidth: 32, fontWeight: 800, fontSize: 16, color: col, textAlign: 'center' }}>{score}</div>
              <div style={{ minWidth: 110, textAlign: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: col + '18', color: col }}>{scoreLabel(score)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: '#aaa' }}>Score out of 100. Factors: price vs 30-day avg, on-time %, seat availability, stops.</div>
    </div>
  );
}

/* ══ 3. Fare Alert ══ */
function FareAlert({ routeIdx }) {
  const { filteredFlights } = useApp();
  const currentPrice = filteredFlights[0]?.price ?? 3200;
  const suggestions  = getFareAlertSuggestion(currentPrice);
  const [alertPrice, setAlertPrice] = useState(suggestions.moderate);
  const [email,      setEmail]      = useState('');
  const [done,       setDone]       = useState(false);
  const route = ROUTES[routeIdx];

  function handleSet() {
    if (email.includes('@')) setDone(true);
    else alert('Please enter a valid email address.');
  }

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🔔 Fare Alert — Get Notified When Price Drops</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>
        We'll notify you when {route.fromCity} → {route.toCity} drops below your target
      </div>

      {done ? (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 10, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
          <div style={{ fontWeight: 700, color: green, fontSize: 15 }}>Fare alert set!</div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
            We'll email <strong>{email}</strong> when the price drops below <strong>₹{alertPrice.toLocaleString()}</strong>
          </div>
          <button onClick={() => setDone(false)} style={{ marginTop: 12, fontSize: 12, color: blue, textDecoration: 'underline', cursor: 'pointer' }}>Edit alert</button>
        </div>
      ) : (
        <>
          {/* Presets */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Quick presets (current: ₹{currentPrice.toLocaleString()})</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label:'Aggressive (-15%)', value: suggestions.aggressive,   color: green  },
                { label:'Moderate (-8%)',    value: suggestions.moderate,     color: blue   },
                { label:'Conservative (-3%)',value: suggestions.conservative, color: orange },
              ].map(p => (
                <button key={p.label} onClick={() => setAlertPrice(p.value)}
                  style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    border: `1.5px solid ${alertPrice === p.value ? p.color : '#e3e8f5'}`,
                    background: alertPrice === p.value ? p.color + '18' : '#fff',
                    color: alertPrice === p.value ? p.color : '#555' }}>
                  ₹{p.value.toLocaleString()} — {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 6 }}>
              <span>Alert me when price drops below</span>
              <strong style={{ color: blue }}>₹{alertPrice.toLocaleString()}</strong>
            </div>
            <input type="range"
              min={Math.round(currentPrice * 0.6)} max={Math.round(currentPrice * 0.99)} step={50}
              value={alertPrice} onChange={e => setAlertPrice(+e.target.value)}
              style={{ width: '100%', accentColor: blue }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#bbb', marginTop: 2 }}>
              <span>₹{Math.round(currentPrice * 0.6).toLocaleString()}</span>
              <span>₹{Math.round(currentPrice * 0.99).toLocaleString()}</span>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, padding: '9px 14px', borderRadius: 9, border: '1px solid #e3e8f5', fontSize: 13 }} />
            <button onClick={handleSet}
              style={{ padding: '9px 20px', borderRadius: 9, background: blue, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              Set Alert
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══ 4. Seat Availability Trend ══ */
function SeatTrend({ routeIdx }) {
  const data = useMemo(() => generateSeatTrend(routeIdx), [routeIdx]);
  const reversed = [...data].reverse();

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>💺 Seat Availability Trend</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Seats remaining & price change as departure approaches</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>Seats Remaining vs Days to Departure</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reversed} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" />
                <XAxis dataKey="daysOut" tick={{ fontSize: 9 }} tickFormatter={v => `${v}d`} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={v => [v, 'Seats']} labelFormatter={v => `${v} days before`} />
                <Bar dataKey="seatsLeft" radius={[4,4,0,0]}>
                  {reversed.map((entry, i) => (
                    <Cell key={i} fill={entry.seatsLeft < 20 ? red : entry.seatsLeft < 60 ? orange : blue} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>Price Surge as Departure Nears</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reversed} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" />
                <XAxis dataKey="daysOut" tick={{ fontSize: 9 }} tickFormatter={v => `${v}d`} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Avg Price']} labelFormatter={v => `${v} days before`} />
                <Line type="monotone" dataKey="avgPrice" stroke={red} strokeWidth={2.5} dot={{ r:3, fill:red }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { icon:'⚠️', text:'Last 7 days: prices surge 30–50%', bg:'#ffebee', col:red   },
          { icon:'✅', text:'Sweet spot: 21–30 days before',     bg:'#e8f5e9', col:green },
          { icon:'💡', text:'Book 45+ days out for max savings', bg:'#e3f2fd', col:blue  },
        ].map((tip, i) => (
          <div key={i} style={{ flex:1, minWidth:160, background:tip.bg, borderRadius:8, padding:'8px 12px', fontSize:12, color:tip.col, fontWeight:500 }}>
            {tip.icon} {tip.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ 5. Booking Tips ══ */
function BookingTips() {
  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>💡 Smart Booking Tips</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Proven strategies to save money on domestic flights</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {BOOKING_TIPS.map((tip, i) => (
          <div key={i} style={{ background: '#fafbff', border: '1px solid #e3e8f5', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ Main Page ══ */
export default function InsightsPage() {
  const { routeIdx } = useApp();
  const route = ROUTES[routeIdx];

  return (
    <div>
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg,#1565c0 0%,#0d47a1 100%)', borderRadius: 14, padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 32 }}>🧠</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Price Intelligence</div>
          <div style={{ fontSize: 13, color: '#90caf9', marginTop: 2 }}>
            {route.fromCity} → {route.toCity} · Predictions, alerts, deal scores & booking tips
          </div>
        </div>
      </div>

      <PricePredictor routeIdx={routeIdx} />
      <DealScorePanel />
      <FareAlert      routeIdx={routeIdx} />
      <SeatTrend      routeIdx={routeIdx} />
      <BookingTips />
    </div>
  );
}
