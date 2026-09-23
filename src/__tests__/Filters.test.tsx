import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters, { FilterState, INITIAL_FILTERS, countActiveFilters } from '../components/Filters/Filters';

function renderFilters(overrides: Partial<FilterState> = {}, onChange = vi.fn()) {
  const filters: FilterState = { ...INITIAL_FILTERS, ...overrides };
  render(<Filters filters={filters} onChange={onChange} total={10} filtered={10} />);
  return onChange;
}

describe('countActiveFilters', () => {
  it('returns 0 for the initial state', () => {
    expect(countActiveFilters(INITIAL_FILTERS)).toBe(0);
  });

  it('counts each non-default filter', () => {
    const filters: FilterState = {
      city: 'Recife',
      search: 'coldplay',
      category: 'Rock',
      price: 'Gratuito',
      period: 'Noite',
    };
    expect(countActiveFilters(filters)).toBe(5);
  });

  it('ignores whitespace-only search', () => {
    expect(countActiveFilters({ ...INITIAL_FILTERS, search: '   ' })).toBe(0);
  });
});

describe('Filters', () => {
  it('renders the event count', () => {
    renderFilters();
    expect(screen.getByText('10 eventos')).toBeInTheDocument();
  });

  it('calls onChange with the category when a pill is clicked', () => {
    const onChange = renderFilters();
    fireEvent.click(screen.getByRole('button', { name: 'Rock' }));
    expect(onChange).toHaveBeenCalledWith({ ...INITIAL_FILTERS, category: 'Rock' });
  });

  it('calls onChange when typing in the search input', () => {
    const onChange = renderFilters();
    fireEvent.change(screen.getByLabelText('Buscar evento'), { target: { value: 'Metallica' } });
    expect(onChange).toHaveBeenCalledWith({ ...INITIAL_FILTERS, search: 'Metallica' });
  });

  it('calls onChange when selecting a city', () => {
    const onChange = renderFilters();
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Recife' } });
    expect(onChange).toHaveBeenCalledWith({ ...INITIAL_FILTERS, city: 'Recife' });
  });

  it('shows the clear button only when filters are active', () => {
    renderFilters();
    expect(screen.queryByText(/Limpar/)).not.toBeInTheDocument();

    renderFilters({ category: 'Rock' });
    expect(screen.getByText('✕ Limpar')).toBeInTheDocument();
  });

  it('resets filters when the clear button is clicked', () => {
    const onChange = renderFilters({ category: 'Rock', search: 'test' });
    fireEvent.click(screen.getByText(/Limpar/));
    expect(onChange).toHaveBeenCalledWith(INITIAL_FILTERS);
  });
});
