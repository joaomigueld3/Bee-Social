import { useState, useEffect, useMemo } from 'react';
import '../styles/MainPage.css';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Skeleton from '../components/Card/Skeleton';
import EventDetail from '../components/EventDetail/EventDetail';
import Filters, { FilterState, INITIAL_FILTERS } from '../components/Filters/Filters';
import { allEventsByCity, allEvents } from '../data/events';
import { Event } from '../types';

function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function matchesPeriod(startTime: string, period: FilterState['period']): boolean {
  if (period === 'Todos') return true;
  const minutes = parseTime(startTime);
  if (period === 'Tarde') return minutes < 18 * 60;
  if (period === 'Noite') return minutes >= 18 * 60 && minutes < 22 * 60;
  return minutes >= 22 * 60 || minutes < 6 * 60;
}

export default function MainPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const username = localStorage.getItem('username') ?? '';

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, [filters.city]);

  const cityEvents = useMemo(
    () => filters.city === 'Todas' ? allEvents : (allEventsByCity[filters.city] ?? []),
    [filters.city]
  );

  const filtered = useMemo(() => {
    return cityEvents.filter(ev => {
      if (filters.search.trim() && !ev.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'Todos' && ev.category !== filters.category) return false;
      if (filters.price !== 'Todos' && ev.price !== filters.price) return false;
      if (!matchesPeriod(ev.startTime, filters.period)) return false;
      return true;
    });
  }, [cityEvents, filters.search, filters.category, filters.price, filters.period]);

  return (
    <div className="mainContainer">
      <Header username={username} />

      <Filters
        filters={filters}
        onChange={setFilters}
        total={cityEvents.length}
        filtered={filtered.length}
      />

      <main className="main">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
          : filtered.length > 0
            ? filtered.map((ev, i) => (
                <Card key={ev.id} event={ev} index={i} onClick={() => setSelectedEvent(ev)} />
              ))
            : (
              <div className="emptyState">
                <p>Nenhum evento encontrado com os filtros aplicados.</p>
                <button
                  className="emptyStateReset"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                >
                  Limpar filtros
                </button>
              </div>
            )
        }
      </main>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
