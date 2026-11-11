import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card/Card';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RSVPProvider } from '../context/RSVPContext';
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
  category: 'Rock',
  price: 'Até R$ 100',
};

function renderCard(onClick = vi.fn()) {
  return render(
    <FavoritesProvider>
      <RSVPProvider>
        <Card event={mockEvent} index={0} onClick={onClick} />
      </RSVPProvider>
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

  it('@spec:AC-005 o botão de presença confirma sem abrir o detalhe', () => {
    const onClick = vi.fn();
    renderCard(onClick);
    fireEvent.click(screen.getByRole('button', { name: 'Marcar presença' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Cancelar presença' })).toBeInTheDocument();
  });

  it('@spec:AC-006 card confirmado mostra o selo "Eu vou" junto dos outros selos', () => {
    renderCard();
    expect(screen.queryByText('Eu vou')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Marcar presença' }));

    expect(screen.getByText('Eu vou')).toBeInTheDocument();
    expect(screen.getByText('Passado')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Até R$ 100')).toBeInTheDocument();
  });

  it('cancelar a presença remove o selo', () => {
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: 'Marcar presença' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar presença' }));
    expect(screen.queryByText('Eu vou')).not.toBeInTheDocument();
  });
});
