import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RSVPProvider } from '../context/RSVPContext';
import { allEvents } from '../data/events';

const confirmedIds = [allEvents[0].id, allEvents[1].id];

async function renderMainPage() {
  localStorage.setItem('bee_social_rsvp', JSON.stringify(confirmedIds));
  render(
    <MemoryRouter initialEntries={['/events']}>
      <ThemeProvider>
        <FavoritesProvider>
          <RSVPProvider>
            <MainPage />
          </RSVPProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
  await screen.findAllByRole('heading', { level: 3 });
}

const cardCount = () => screen.queryAllByRole('heading', { level: 3 }).length;
const onlyConfirmedBtn = () => screen.getByRole('button', { name: /só confirmados/i });

describe('MainPage — filtro "Só confirmados"', () => {
  it('@spec:AC-008 restringe a lista aos eventos confirmados', async () => {
    await renderMainPage();
    expect(cardCount()).toBe(allEvents.length);

    fireEvent.click(onlyConfirmedBtn());

    expect(cardCount()).toBe(confirmedIds.length);
    expect(onlyConfirmedBtn()).toHaveAttribute('aria-pressed', 'true');
  });

  it('@spec:AC-009 cancelar a presença com o filtro ativo tira o evento da lista na hora', async () => {
    await renderMainPage();
    fireEvent.click(onlyConfirmedBtn());
    expect(cardCount()).toBe(2);

    fireEvent.click(screen.getAllByRole('button', { name: 'Cancelar presença' })[0]);

    expect(cardCount()).toBe(1);
  });

  it('@spec:AC-010 "Limpar" desliga o filtro e volta a mostrar todos os eventos', async () => {
    await renderMainPage();
    fireEvent.click(onlyConfirmedBtn());
    expect(cardCount()).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));

    expect(onlyConfirmedBtn()).toHaveAttribute('aria-pressed', 'false');
    expect(cardCount()).toBe(allEvents.length);
  });

  it('o filtro não vai para a URL', async () => {
    await renderMainPage();
    fireEvent.click(onlyConfirmedBtn());
    expect(window.location.search).not.toContain('rsvp');
  });

  it('o contador de presenças do topo acompanha os cards', async () => {
    await renderMainPage();
    const header = screen.getByRole('banner');
    expect(within(header).getByRole('status', { name: '2 presenças confirmadas' })).toBeInTheDocument();
  });
});
