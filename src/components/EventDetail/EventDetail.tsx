import { useEffect } from 'react';
import { Event } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import './EventDetail.css';

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(event.id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="detailOverlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={event.name}>
      <div className="detailPanel" onClick={e => e.stopPropagation()}>
        <div className="detailTopBar">
          <button
            className={`detailFavoriteBtn ${favorite ? 'active' : ''}`}
            onClick={() => toggle(event.id)}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {favorite ? '♥' : '♡'} {favorite ? 'Favoritado' : 'Favoritar'}
          </button>
          <button className="detailCloseBtn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <h2 className="detailTitle">{event.name}</h2>

        <div className="detailGrid">
          <div className="detailItem">
            <span className="detailLabel">📍 Local</span>
            <span className="detailValue">{event.eventPlace}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">🗺️ Endereço</span>
            <span className="detailValue">{event.street}, {event.city} — {event.state}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">📅 Data</span>
            <span className="detailValue">{event.eventDate}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">🕐 Horário</span>
            <span className="detailValue">{event.startTime}</span>
          </div>
          {event.phone && (
            <div className="detailItem">
              <span className="detailLabel">📞 Telefone</span>
              <span className="detailValue">{event.phone}</span>
            </div>
          )}
        </div>

        {event.link && (
          <a
            className="detailLink"
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Comprar ingresso ↗
          </a>
        )}
      </div>
    </div>
  );
}
