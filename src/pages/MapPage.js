import React from 'react';
import { ROUTES, MAP_COORDS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const card = { background: '#fff', border: '1px solid #e3e8f5', borderRadius: 12, padding: '20px 24px' };

export default function MapPage() {
  const { routeIdx, setRouteIdx } = useApp();
  const route = ROUTES[routeIdx];
  const from  = MAP_COORDS[route.from];
  const to    = MAP_COORDS[route.to];
  const mx    = (from.x + to.x) / 2;
  const my    = (from.y + to.y) / 2 - 50;

  const allLines = ROUTES.map(r => ({
    from: MAP_COORDS[r.from], to: MAP_COORDS[r.to],
    active: r.from === route.from && r.to === route.to,
  }));

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Route Map — India</div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        <div style={{ border: '1px solid #e3e8f5', borderRadius: 10, overflow: 'hidden', background: '#deeef8', flexShrink: 0 }}>
          <svg width="420" height="440" viewBox="0 0 420 440" role="img" aria-label="India route map">
            <title>India flight route map</title>
            <rect width="420" height="440" fill="#deeef8" />
            <defs>
              <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#1565c0" /></marker>
              <marker id="arrowGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#b0bec5" /></marker>
            </defs>
            {allLines.map((r, i) => (
              <path key={i}
                d={`M${r.from.x},${r.from.y} Q${(r.from.x+r.to.x)/2},${(r.from.y+r.to.y)/2-40} ${r.to.x},${r.to.y}`}
                fill="none"
                stroke={r.active ? '#1565c0' : '#b0bec5'}
                strokeWidth={r.active ? 2.5 : 1.2}
                strokeDasharray={r.active ? 'none' : '4,3'}
                markerEnd={r.active ? 'url(#arrowBlue)' : 'url(#arrowGray)'}
                opacity={r.active ? 1 : 0.5}
              />
            ))}
            {Object.entries(MAP_COORDS).map(([code, c]) => {
              const isFrom = code === route.from, isTo = code === route.to;
              return (
                <g key={code}>
                  <circle cx={c.x} cy={c.y} r={isFrom||isTo?11:7} fill={isFrom?'#1565c0':isTo?'#d32f2f':'#90a4ae'} stroke="#fff" strokeWidth={2} />
                  <text x={c.x} y={c.y-15} textAnchor="middle" fontSize="11" fontWeight="600" fill="#37474f">{c.name}</text>
                  <text x={c.x} y={c.y+4}  textAnchor="middle" fontSize="8"  fontWeight="700" fill="#fff">{code}</text>
                </g>
              );
            })}
            <text x={mx} y={my} textAnchor="middle" fontSize="11" fill="#1565c0" fontWeight="600">{route.fromCity} → {route.toCity}</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>All Routes</div>
          {ROUTES.map((r, i) => (
            <div key={i} onClick={() => setRouteIdx(i)}
              style={{ padding: '10px 14px', borderRadius: 9, marginBottom: 8, border: `1px solid ${i===routeIdx?'#1565c0':'#e3e8f5'}`, background: i===routeIdx?'#e3f2fd':'#fff', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600, color: i===routeIdx?'#1565c0':'#1a1a2e' }}>{r.fromCity} → {r.toCity}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{r.from} – {r.to} · ~2h 10m avg</div>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 12, color: '#aaa', lineHeight: 2 }}>
            <div><span style={{ width:10,height:10,borderRadius:'50%',background:'#1565c0',display:'inline-block',marginRight:6,verticalAlign:-1 }}/>Origin</div>
            <div><span style={{ width:10,height:10,borderRadius:'50%',background:'#d32f2f',display:'inline-block',marginRight:6,verticalAlign:-1 }}/>Destination</div>
          </div>
        </div>
      </div>
    </div>
  );
}
