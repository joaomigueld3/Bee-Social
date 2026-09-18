import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';
import './FavoritesPage.css';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import EventDetail from '../components/EventDetail/EventDetail';
import { allEvents } from '../data/events';
import { useFavorites } from '../context/FavoritesContext';
import { Event } from '../types';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const username = localStorage.getItem('username') ?? '';

  const favoriteEvents = allEvents.filter(ev => favorites.has(ev.id));

  return (
    <div className="mainContainer">
      <Header username={username} />

      <div className="favoritesHeader">
        <h2 className="favoritesTitle">♥ Meus Favoritos</h2>
        <p className="favoritesCount">
          {favoriteEvents.length === 0
            ? 'Nenhum evento favoritado ainda.'
            : `${favoriteEvents.length} evento${favoriteEvents.length > 1 ? 's' : ''}`}
        </p>
      </div>

      <main className="main">
        {favoriteEvents.length === 0 ? (
          <div className="emptyState">
            <p>Favorite eventos na tela de <Link to="/events">Eventos</Link> para vê-los aqui.</p>
          </div>
        ) : (
          favoriteEvents.map((ev, i) => (
            <Card key={ev.id} event={ev} index={i} onClick={() => setSelectedEvent(ev)} />
          ))
        )}
      </main>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
