import './Card.css';
import TagItem from './TagItem';
import { Event } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface CardProps {
  event: Event;
  index: number;
  onClick: () => void;
}

function getDateBadge(dateStr: string): { label: string; className: string } | null {
  const parts = dateStr.trim().split('/').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [day, month, year] = parts;
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((eventDate.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return { label: 'Hoje', className: 'badgeToday' };
  if (diff > 0 && diff <= 30) return { label: 'Em breve', className: 'badgeSoon' };
  if (diff < 0) return { label: 'Passado', className: 'badgePast' };
  return { label: 'Em breve', className: 'badgeSoon' };
}

export default function Card({ event, index, onClick }: CardProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(event.id);
  const badge = getDateBadge(event.eventDate);

  return (
    <div
      className="cardItem"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {event.imageUrl && (
        <div className="cardBanner">
          <img src={event.imageUrl} alt={`Banner de ${event.name}`} loading="lazy" />
        </div>
      )}
      <div className="cardTopRow">
        <div className="cardBadges">
          {badge && <span className={`badge ${badge.className}`}>{badge.label}</span>}
          <span className="badgeCategory">{event.category}</span>
          <span className="badgePrice">{event.price}</span>
        </div>
        <button
          className={`favoriteBtn ${favorite ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggle(event.id); }}
          aria-label={favorite ? 'Remover favorito' : 'Adicionar favorito'}
          title={favorite ? 'Remover favorito' : 'Adicionar favorito'}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="cardClickable" onClick={onClick} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onClick()}>
        <h3 className="cardTitle">{event.name}</h3>
        <p className="cardAddress">
          {event.street && <>{event.street}<br /></>}
          {event.city}, {event.state}
        </p>
      </div>

      <TagItem
        phone={event.phone}
        venue={event.eventPlace}
        type={event.eventDate}
        link={event.link}
        startTime={event.startTime}
      />
    </div>
  );
}
