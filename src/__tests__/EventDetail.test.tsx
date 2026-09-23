import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventDetail from '../components/EventDetail/EventDetail';
import { FavoritesProvider } from '../context/FavoritesContext';
import { Event } from '../types';

const mockEvent: Event = {
  id: 'test-1',
  name: 'Show de Teste',
  link: 'https://example.com/ingressos',
  street: 'Rua Exemplo, 123',
  city: 'Recife',
  state: 'Pernambuco',
  eventDate: '25/12/2026',
  phone: '(81) 99999-9999',
  startTime: '20:30',
  eventPlace: 'Teatro Teste',
  category: 'Rock',
  price: 'Até R$ 100',
};

function renderDetail(onClose = vi.fn(), event: Event = mockEvent) {
  render(
    <FavoritesProvider>
      <EventDetail event={event} onClose={onClose} />
    </FavoritesProvider>
  );
  return onClose;
}

describe('EventDetail', () => {
  it('renders the event details', () => {
    renderDetail();
    expect(screen.getByText('Show de Teste')).toBeInTheDocument();
    expect(screen.getByText('Teatro Teste')).toBeInTheDocument();
    expect(screen.getByText('25/12/2026')).toBeInTheDocument();
    expect(screen.getByText('20:30')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const onClose = renderDetail();
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the overlay is clicked but not when the panel is clicked', () => {
    const onClose = renderDetail();
    fireEvent.click(screen.getByText('Show de Teste'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape is pressed', () => {
    const onClose = renderDetail();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite state', () => {
    renderDetail();
    const favBtn = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    fireEvent.click(favBtn);
    expect(screen.getByRole('button', { name: /Remover dos favoritos/i })).toBeInTheDocument();
  });

  it('builds a Google Maps link from the address', () => {
    renderDetail();
    const mapsLink = screen.getByRole('link', { name: /Ver no Maps/i });
    expect(mapsLink.getAttribute('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Rua Exemplo, 123, Recife, Pernambuco')
    );
  });

  it('builds a Google Calendar link with the correct date range', () => {
    renderDetail();
    const gcalLink = screen.getByRole('link', { name: /Salvar na Agenda/i });
    const href = gcalLink.getAttribute('href')!;
    expect(href).toContain('calendar.google.com/calendar/render');
    expect(href).toContain('dates=20261225T203000%2F20261225T223000');
    expect(href).toContain('text=Show+de+Teste');
  });

  it('renders the ticket link when a link is provided', () => {
    renderDetail();
    const ticketLink = screen.getByRole('link', { name: /Comprar ingresso/i });
    expect(ticketLink.getAttribute('href')).toBe('https://example.com/ingressos');
  });

  it('omits the ticket link when the event has none', () => {
    renderDetail(vi.fn(), { ...mockEvent, link: '' });
    expect(screen.queryByRole('link', { name: /Comprar ingresso/i })).not.toBeInTheDocument();
  });
});
