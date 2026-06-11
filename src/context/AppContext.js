import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { generateFlights, generateCalendar } from '../data/mockData';

const AppCtx = createContext();

export function AppProvider({ children }) {
  const [routeIdx,      setRouteIdx]      = useState(0);
  const [dateOffset,    setDateOffset]    = useState(0);
  const [compareList,   setCompareList]   = useState([]);
  const [filterStops,   setFilterStops]   = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [sortBy,        setSortBy]        = useState('price');

  const flights  = useMemo(() => generateFlights(routeIdx, dateOffset), [routeIdx, dateOffset]);
  const calendar = useMemo(() => generateCalendar(routeIdx), [routeIdx]);

  const filteredFlights = useMemo(() => {
    let f = [...flights];
    if (filterStops   !== 'all') f = f.filter(x => x.stops === parseInt(filterStops));
    if (filterAirline !== 'all') f = f.filter(x => x.airline.id === filterAirline);
    if      (sortBy === 'price')     f.sort((a, b) => a.price - b.price);
    else if (sortBy === 'duration')  f.sort((a, b) => a.durationMin - b.durationMin);
    else if (sortBy === 'departure') f.sort((a, b) => a.dep.localeCompare(b.dep));
    else if (sortBy === 'otp')       f.sort((a, b) => b.airline.otp - a.airline.otp);
    return f;
  }, [flights, filterStops, filterAirline, sortBy]);

  const toggleCompare = useCallback((flight) => {
    setCompareList(prev =>
      prev.find(x => x.id === flight.id)
        ? prev.filter(x => x.id !== flight.id)
        : prev.length < 3 ? [...prev, flight] : prev
    );
  }, []);

  const shareLink = useCallback(() => {
    const url = `${window.location.origin}?route=${routeIdx}&date=${dateOffset}&sort=${sortBy}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    alert('Share link copied!\n\n' + url);
  }, [routeIdx, dateOffset, sortBy]);

  const exportCSV = useCallback(() => {
    const header = ['Airline','From','To','Dep','Arr','Duration','Stops','Price','OTP%'];
    const rows   = filteredFlights.map(f => [
      f.airline.name, f.from, f.to, f.dep, f.arr, f.duration, f.stops, f.price, f.airline.otp,
    ]);
    const csv  = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'skycompare-flights.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [filteredFlights]);

  return (
    <AppCtx.Provider value={{
      routeIdx, setRouteIdx,
      dateOffset, setDateOffset,
      compareList, setCompareList, toggleCompare,
      filterStops, setFilterStops,
      filterAirline, setFilterAirline,
      sortBy, setSortBy,
      flights, filteredFlights, calendar,
      shareLink, exportCSV,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  return useContext(AppCtx);
}
