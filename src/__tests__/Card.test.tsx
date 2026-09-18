import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card/Card';
import { FavoritesProvider } from '../context/FavoritesContext';
import { Event } from '../types';

const mockEvent: Event = {
  id: 'test-1',
  name: 'Show de Teste',
  link: 'https://example.com',
  street: 'Rua Exemplo, 123',
  city: 'Recife',
  state: 'Pernambuco',
  eventDate: '01/01/2022',
  phone: '(81) 99999-9999',
  startTime: '20:00',
  eventPlace: 'Teatro Teste',
};

function renderCard(onClick = vi.fn()) {
  return render(
    <FavoritesProvider>
      <Card event={mockEvent} index={0} onClick={onClick} />
    </FavoritesProvider>
  );
}

describe('Card', () => {
  it('renders the event name', () => {
    renderCard();
    expect(screen.getByText('Show de Teste')).toBeInTheDocument();
  });

  it('renders city and state', () => {
    renderCard();
    expect(screen.getByText(/Recife, Pernambuco/)).toBeInTheDocument();
  });

  it('shows "Passado" badge for past events', () => {
    renderCard();
    expect(screen.getByText('Passado')).toBeInTheDocument();
  });

  it('calls onClick when the card title area is clicked', () => {
    const onClick = vi.fn();
    renderCard(onClick);
    fireEvent.click(screen.getByText('Show de Teste'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite without triggering onClick', () => {
    const onClick = vi.fn();
    renderCard(onClick);
    const favBtn = screen.getByRole('button', { name: /adicionar favorito/i });
    fireEvent.click(favBtn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /remover favorito/i })).toBeInTheDocument();
  });
});
