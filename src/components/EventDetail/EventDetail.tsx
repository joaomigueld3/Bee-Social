import { useEffect } from 'react';
import { Event } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import './EventDetail.css';

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

function buildMapsUrl(event: Event): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.street}, ${event.city}, ${event.state}`)}`;
}

function toGCalDate(dateStr: string, timeStr: string): string {
  const [day, month, year] = dateStr.split('/');
  const [h = '0', m = '0'] = timeStr.split(':');
  return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}T${h.padStart(2, '0')}${m.padStart(2, '0')}00`;
}

function buildGCalUrl(event: Event): string {
  const [h, m] = event.startTime.split(':').map(Number);
  const endH = String((h + 2) % 24).padStart(2, '0');
  const endM = String(m || 0).padStart(2, '0');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${toGCalDate(event.eventDate, event.startTime)}/${toGCalDate(event.eventDate, `${endH}:${endM}`)}`,
    details: `${event.eventPlace}${event.link ? '\n\nIngressos: ' + event.link : ''}`,
    location: `${event.street}, ${event.city} - ${event.state}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(event.id);
  const mapsUrl = buildMapsUrl(event);
  const gCalUrl = buildGCalUrl(event);

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

        {event.imageUrl && (
          <div className="detailBanner">
            <img src={event.imageUrl} alt={`Banner de ${event.name}`} loading="lazy" />
          </div>
        )}

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
            <a className="detailAddressLink" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              {event.street}, {event.city} — {event.state} ↗
            </a>
          </div>
          <div className="detailItem">
            <span className="detailLabel">📅 Data</span>
            <span className="detailValue">{event.eventDate}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">🕐 Horário</span>
            <span className="detailValue">{event.startTime}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">🎵 Categoria</span>
            <span className="detailValue">{event.category}</span>
          </div>
          <div className="detailItem">
            <span className="detailLabel">💰 Preço</span>
            <span className="detailValue">{event.price}</span>
          </div>
          {event.phone && (
            <div className="detailItem">
              <span className="detailLabel">📞 Telefone</span>
              <span className="detailValue">{event.phone}</span>
            </div>
          )}
        </div>

        <div className="detailActions">
          {event.street && (
            <a className="detailActionBtn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              🗺️ Ver no Maps
            </a>
          )}
          <a className="detailActionBtn" href={gCalUrl} target="_blank" rel="noopener noreferrer">
            📅 Salvar na Agenda
          </a>
          {event.link && (
            <a className="detailActionPrimary" href={event.link} target="_blank" rel="noopener noreferrer">
              🎟 Comprar ingresso ↗
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
