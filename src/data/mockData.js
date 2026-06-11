export const AIRLINES = [
  { id: 'AI', name: 'Air India', color: '#d32f2f', otp: 71, hub: 'DEL' },
  { id: '6E', name: 'IndiGo',    color: '#1565c0', otp: 83, hub: 'DEL' },
  { id: 'SG', name: 'SpiceJet',  color: '#f57c00', otp: 68, hub: 'DEL' },
  { id: 'UK', name: 'Vistara',   color: '#7b1fa2', otp: 88, hub: 'DEL' },
  { id: 'G8', name: 'Go First',  color: '#00838f', otp: 65, hub: 'BOM' },
];

export const ROUTES = [
  { from: 'HYD', to: 'DEL', fromCity: 'Hyderabad', toCity: 'Delhi'     },
  { from: 'HYD', to: 'BOM', fromCity: 'Hyderabad', toCity: 'Mumbai'    },
  { from: 'DEL', to: 'BLR', fromCity: 'Delhi',     toCity: 'Bangalore' },
  { from: 'BOM', to: 'MAA', fromCity: 'Mumbai',    toCity: 'Chennai'   },
];

export const BAGGAGE_POLICIES = [
  { airline: 'Air India', cabin: '7 kg (1 piece)', checkin: '25 kg (Economy)', extra: '₹700/kg',  laptop: 'Allowed separately', liquid: '100ml/item' },
  { airline: 'IndiGo',   cabin: '7 kg (1 piece)', checkin: '15 kg (Economy)', extra: '₹1000/kg', laptop: 'Counted in cabin',   liquid: '100ml/item' },
  { airline: 'SpiceJet', cabin: '7 kg (1 piece)', checkin: '20 kg (Economy)', extra: '₹1200/kg', laptop: 'Counted in cabin',   liquid: '100ml/item' },
  { airline: 'Vistara',  cabin: '7 kg (1 piece)', checkin: '20 kg (Economy)', extra: '₹800/kg',  laptop: 'Allowed separately', liquid: '100ml/item' },
  { airline: 'Go First', cabin: '7 kg (1 piece)', checkin: '15 kg (Economy)', extra: '₹1500/kg', laptop: 'Counted in cabin',   liquid: '100ml/item' },
];

export const ROUTE_OTP = [
  { route: 'HYD–DEL', AI: 72, '6E': 85, SG: 67, UK: 90, G8: 63 },
  { route: 'HYD–BOM', AI: 70, '6E': 82, SG: 65, UK: 87, G8: 60 },
  { route: 'DEL–BLR', AI: 75, '6E': 84, SG: 70, UK: 88, G8: 68 },
];

export const MAP_COORDS = {
  HYD: { x: 320, y: 310, name: 'Hyderabad' },
  DEL: { x: 280, y: 200, name: 'Delhi'      },
  BOM: { x: 220, y: 295, name: 'Mumbai'     },
  BLR: { x: 295, y: 360, name: 'Bangalore'  },
  MAA: { x: 330, y: 370, name: 'Chennai'    },
};

export const BOOKING_TIPS = [
  { icon: '🗓️', title: 'Best day to book',    desc: 'Tuesday & Wednesday flights are on average 12–15% cheaper than Friday departures.' },
  { icon: '⏰', title: 'Sweet spot window',    desc: 'Book 3–6 weeks before travel. Prices spike sharply in the last 7 days before departure.' },
  { icon: '🌅', title: 'Cheapest time slot',  desc: 'Early morning (5–8 AM) and late night (10 PM+) slots are 8–20% cheaper than peak hours.' },
  { icon: '📅', title: 'Avoid peak dates',    desc: 'Prices jump 40–60% during long weekends, Diwali, Holi, and school holiday periods.' },
  { icon: '🔄', title: 'Flexible dates trick',desc: 'Being flexible by ±2 days can save ₹800–₹2000 on a typical domestic ticket.' },
  { icon: '🧳', title: 'Pre-book baggage',    desc: 'Pre-booking check-in baggage saves 30–40% vs. paying at the airport counter.' },
];

const TIMES = [
  ['06:00','08:10'], ['09:30','11:45'], ['13:15','15:25'],
  ['17:00','19:10'], ['20:30','22:40'], ['23:00','01:10+1'],
];

const BASE_PRICES = [3200, 2800, 4100, 3600];

export function generateFlights(routeIdx, dateOffset = 0) {
  const route = ROUTES[routeIdx];
  const flights = AIRLINES.map((airline, ai) => {
    const t     = TIMES[(ai + dateOffset) % TIMES.length];
    const dur   = 125 + ((ai * 13 + dateOffset * 7) % 30);
    const stops = ai === 2 ? 1 : 0;
    const price = BASE_PRICES[routeIdx] + ai * 200 + dateOffset * 120 + ((ai * 137 + routeIdx * 59) % 300);
    const dealScore = Math.round(Math.max(20, Math.min(99, 95 - (price - BASE_PRICES[routeIdx]) / 80)));
    return {
      id: `${airline.id}-${routeIdx}-${ai}-${dateOffset}`,
      airline, from: route.from, to: route.to,
      fromCity: route.fromCity, toCity: route.toCity,
      dep: t[0], arr: t[1],
      duration: `${Math.floor(dur / 60)}h ${dur % 60}m`,
      durationMin: dur + stops * 45,
      stops, price, dealScore,
      seats: 3 + ((ai * 7 + dateOffset * 3) % 12),
      baggage: { cabin: '7kg', checkin: stops === 0 ? '15kg' : '20kg', extra: '₹1200/kg' },
    };
  });
  return flights.sort((a, b) => a.price - b.price);
}

export function generateCalendar(routeIdx) {
  const base  = BASE_PRICES[routeIdx];
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const price = base + ((i * 137 + routeIdx * 59) % 1500) - 200;
    return {
      date:  d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      price, low: price < base + 300,
    };
  });
}

export function generatePricePrediction(routeIdx) {
  const base        = BASE_PRICES[routeIdx];
  const multipliers = [1.0, 0.92, 1.18, 0.88, 0.95, 1.42, 1.05, 0.78];
  const labels      = ['This week','Week 2','Week 3','Week 4','Week 5','Week 6 (Festival)','Week 7','Week 8'];
  return multipliers.map((m, i) => ({
    week:       labels[i],
    price:      Math.round(base * m),
    predicted:  i > 0,
    trend:      i === 0 ? 'current' : Math.round(base * m) > Math.round(base * multipliers[i - 1]) ? 'up' : 'down',
    change:     i === 0 ? 0 : Math.round(((m - multipliers[i - 1]) / multipliers[i - 1]) * 100),
    confidence: Math.round(95 - i * 8),
  }));
}

export function generateSeatTrend(routeIdx) {
  const daysOut   = [60, 45, 30, 21, 14, 7, 3, 1];
  const baseSeats = [180,160,130,100, 72,45,20, 8];
  return daysOut.map((d, i) => ({
    daysOut:  d,
    label:    d === 1 ? '1 day before' : `${d} days out`,
    seatsLeft: baseSeats[i] + ((routeIdx * 11 + i * 7) % 20) - 10,
    avgPrice:  Math.round(BASE_PRICES[routeIdx] * (1 + (7 - i) * 0.04)),
  }));
}

export function getFareAlertSuggestion(currentPrice) {
  return {
    aggressive:   Math.round(currentPrice * 0.85),
    moderate:     Math.round(currentPrice * 0.92),
    conservative: Math.round(currentPrice * 0.97),
  };
}
