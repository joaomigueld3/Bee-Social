import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/MainPage.css';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Skeleton from '../components/Card/Skeleton';
import SearchBar from '../components/SearchBar/SearchBar';
import EventDetail from '../components/EventDetail/EventDetail';
import { allEventsByCity } from '../data/events';
import { Event } from '../types';

const CITIES = ['Recife', 'São Paulo', 'Rio de Janeiro'];

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get('city') ?? 'Recife';
  const city = CITIES.includes(cityParam) ? cityParam : 'Recife';

  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const username = localStorage.getItem('username') ?? '';

  useEffect(() => {
    setIsLoading(true);
    setSearch('');
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [city]);

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSearchParams({ city: e.target.value });
  }

  const events = allEventsByCity[city] ?? [];
  const filtered = search.trim()
    ? events.filter(ev => ev.name.toLowerCase().includes(search.toLowerCase()))
    : events;

  return (
    <div className="mainContainer">
      <Header username={username} />

      <div className="controlsRow">
        <div className="selectWrapper">
          <label className="selectTitle" htmlFor="citySelect">Cidade:</label>
          <select
            id="citySelect"
            className="select"
            value={city}
            onChange={handleCityChange}
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <main className="main">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
          : filtered.length > 0
            ? filtered.map((ev, i) => (
                <Card key={ev.id} event={ev} index={i} onClick={() => setSelectedEvent(ev)} />
              ))
            : (
              <div className="emptyState">
                <p>Nenhum evento encontrado para "{search}".</p>
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
