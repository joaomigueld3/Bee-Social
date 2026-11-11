import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RSVPProvider } from '../context/RSVPContext';
import { allEvents, allEventsByCity } from '../data/events';

// Uma cidade só mantém a página leve: getByRole em dezenas de cards estoura o timeout no jsdom
const cityEvents = allEventsByCity['Recife'];
const confirmedIds = [cityEvents[0].id, cityEvents[1].id];

function LocationProbe() {
  return <span data-testid="search">{useLocation().search}</span>;
}

async function renderMainPage() {
  localStorage.setItem('bee_social_rsvp', JSON.stringify(confirmedIds));
  render(
    <MemoryRouter initialEntries={['/events?city=Recife']}>
      <ThemeProvider>
        <FavoritesProvider>
          <RSVPProvider>
            <MainPage />
            <LocationProbe />
          </RSVPProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
  await waitFor(() => expect(cardCount()).toBe(cityEvents.length));
}

const cardCount = () => document.querySelectorAll('.cardItem').length;
const onlyConfirmedBtn = () => screen.getByRole('button', { name: /só confirmados/i });

describe('MainPage — filtro "Só confirmados"', () => {
  it('@spec:AC-008 restringe a lista aos eventos confirmados', async () => {
    await renderMainPage();

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
    // "Limpar" também zera a cidade: sai o skeleton (500 ms) e voltam os eventos de todas as cidades
    await waitFor(() => expect(cardCount()).toBe(allEvents.length), { timeout: 3000 });
  });

  it('o filtro não vai para a URL', async () => {
    await renderMainPage();
    fireEvent.click(onlyConfirmedBtn());
    expect(screen.getByTestId('search').textContent).toBe('?city=Recife');
  });

  it('o contador de presenças do topo acompanha os cards', async () => {
    await renderMainPage();
    const header = screen.getByRole('banner');
    expect(within(header).getByRole('status', { name: '2 presenças confirmadas' })).toBeInTheDocument();
  });
});
