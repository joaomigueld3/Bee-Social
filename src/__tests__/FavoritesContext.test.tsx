import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../context/FavoritesContext';

function TestConsumer({ id }: { id: string }) {
  const { isFavorite, toggle, favorites } = useFavorites();
  return (
    <div>
      <span data-testid="count">{favorites.size}</span>
      <span data-testid="status">{isFavorite(id) ? 'yes' : 'no'}</span>
      <button onClick={() => toggle(id)}>toggle</button>
    </div>
  );
}

describe('FavoritesContext', () => {
  it('starts with no favorites', () => {
    render(<FavoritesProvider><TestConsumer id="1" /></FavoritesProvider>);
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('status').textContent).toBe('no');
  });

  it('adds a favorite on toggle', () => {
    render(<FavoritesProvider><TestConsumer id="1" /></FavoritesProvider>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('status').textContent).toBe('yes');
  });

  it('removes a favorite on second toggle', () => {
    render(<FavoritesProvider><TestConsumer id="1" /></FavoritesProvider>);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('status').textContent).toBe('no');
  });
});
