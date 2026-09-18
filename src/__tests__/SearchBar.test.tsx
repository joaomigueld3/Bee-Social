import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Buscar evento...')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="Coldplay" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Coldplay')).toBeInTheDocument();
  });

  it('calls onChange with new value when user types', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Guns' } });
    expect(onChange).toHaveBeenCalledWith('Guns');
  });
});
