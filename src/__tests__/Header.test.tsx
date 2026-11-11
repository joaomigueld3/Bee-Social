import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RSVPProvider, useRSVP } from '../context/RSVPContext';

function ConfirmButton({ id }: { id: string }) {
  const { toggleAttendance } = useRSVP();
  return <button onClick={() => toggleAttendance(id)}>confirmar {id}</button>;
}

function renderHeader() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <RSVPProvider>
            <Header username="visitante" />
            <ConfirmButton id="1" />
          </RSVPProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('@spec:AC-004 mostra o total de presenças e atualiza na hora', () => {
    renderHeader();
    expect(screen.getByRole('status', { name: '0 presenças confirmadas' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'confirmar 1' }));

    const indicator = screen.getByRole('status', { name: '1 presença confirmada' });
    expect(indicator).toHaveTextContent('✓ Presenças');
    expect(indicator).toHaveTextContent('1');
  });

  it('o indicador de presenças não é um link', () => {
    renderHeader();
    expect(screen.queryByRole('link', { name: /presenças/i })).not.toBeInTheDocument();
  });

  it('renderiza a navegação e o usuário', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByText('visitante')).toBeInTheDocument();
  });
});
