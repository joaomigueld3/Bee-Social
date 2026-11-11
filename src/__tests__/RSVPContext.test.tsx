import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RSVPProvider, useRSVP } from '../context/RSVPContext';

function TestConsumer({ ids }: { ids: string[] }) {
  const { isAttending, toggleAttendance, confirmedCount } = useRSVP();
  return (
    <div>
      <span data-testid="count">{confirmedCount}</span>
      {ids.map(id => (
        <div key={id}>
          <span data-testid={`status-${id}`}>{isAttending(id) ? 'yes' : 'no'}</span>
          <button onClick={() => toggleAttendance(id)}>toggle {id}</button>
        </div>
      ))}
    </div>
  );
}

function renderConsumer(ids = ['1', '2']) {
  return render(<RSVPProvider><TestConsumer ids={ids} /></RSVPProvider>);
}

describe('RSVPContext', () => {
  it('@spec:AC-001 confirmar presença registra o evento e o total vira 1', () => {
    renderConsumer();
    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: 'toggle 1' }));

    expect(screen.getByTestId('status-1').textContent).toBe('yes');
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('@spec:AC-002 confirmar de novo cancela a presença e o total volta a 0', () => {
    renderConsumer();
    fireEvent.click(screen.getByRole('button', { name: 'toggle 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'toggle 1' }));

    expect(screen.getByTestId('status-1').textContent).toBe('no');
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('@spec:AC-003 presenças sobrevivem a um recarregamento', () => {
    const first = renderConsumer();
    fireEvent.click(screen.getByRole('button', { name: 'toggle 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'toggle 2' }));
    expect(JSON.parse(localStorage.getItem('bee_social_rsvp') ?? '[]')).toEqual(['1', '2']);

    first.unmount();
    renderConsumer();

    expect(screen.getByTestId('status-1').textContent).toBe('yes');
    expect(screen.getByTestId('status-2').textContent).toBe('yes');
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('ignora dados inválidos no localStorage', () => {
    localStorage.setItem('bee_social_rsvp', '{"quebrado":');
    renderConsumer();
    expect(screen.getByTestId('count').textContent).toBe('0');

    localStorage.setItem('bee_social_rsvp', JSON.stringify([1, 'a', null]));
    renderConsumer(['a']);
    expect(screen.getAllByTestId('count').at(-1)?.textContent).toBe('1');
  });

  it('é independente dos favoritos', () => {
    localStorage.setItem('favorites', JSON.stringify(['1']));
    renderConsumer();
    expect(screen.getByTestId('status-1').textContent).toBe('no');
  });
});
