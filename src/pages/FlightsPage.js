import React from 'react';
import SearchBar   from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FlightCard  from '../components/FlightCard';
import { useApp }  from '../context/AppContext';

export default function FlightsPage() {
  const { filteredFlights } = useApp();
  return (
    <div>
      <SearchBar />
      <FilterPanel />
      {filteredFlights.length === 0
        ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#aaa' }}>
            <i className="ti ti-mood-empty" style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
            No flights match your filters.
          </div>
        : filteredFlights.map(f => <FlightCard key={f.id} flight={f} />)
      }
    </div>
  );
}
