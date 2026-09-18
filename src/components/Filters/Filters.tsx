import './Filters.css';
import { EventCategory, EventPrice } from '../../types';

export type PeriodFilter = 'Todos' | 'Tarde' | 'Noite' | 'Madrugada';

export interface FilterState {
  city: string;
  search: string;
  category: EventCategory | 'Todos';
  price: EventPrice | 'Todos';
  period: PeriodFilter;
}

export const INITIAL_FILTERS: FilterState = {
  city: 'Todas',
  search: '',
  category: 'Todos',
  price: 'Todos',
  period: 'Todos',
};

export const CITIES = [
  'Todas',
  'Recife',
  'São Paulo',
  'Rio de Janeiro',
  'Fortaleza',
  'Belo Horizonte',
  'Porto Alegre',
];

const CATEGORIES: Array<EventCategory | 'Todos'> = [
  'Todos', 'Rock', 'Pop', 'MPB', 'Samba', 'Pagode',
  'Sertanejo', 'Rap', 'Funk', 'R&B', 'Eletrônica', 'Jazz', 'Stand-up',
];

const PRICES: Array<EventPrice | 'Todos'> = [
  'Todos', 'Gratuito', 'Até R$ 100', 'R$ 100 a 200', 'Acima de R$ 200',
];

const PERIODS: PeriodFilter[] = ['Todos', 'Tarde', 'Noite', 'Madrugada'];

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  total: number;
  filtered: number;
}

export function countActiveFilters(f: FilterState): number {
  return (
    (f.city !== 'Todas' ? 1 : 0) +
    (f.search.trim() ? 1 : 0) +
    (f.category !== 'Todos' ? 1 : 0) +
    (f.price !== 'Todos' ? 1 : 0) +
    (f.period !== 'Todos' ? 1 : 0)
  );
}

export default function Filters({ filters, onChange, total, filtered }: FiltersProps) {
  const active = countActiveFilters(filters);

  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="filtersContainer">

      {/* Category pills */}
      <div className="categoryPills" role="group" aria-label="Filtrar por categoria">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`pill ${filters.category === cat ? 'pillActive' : ''}`}
            onClick={() => set({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Controls row */}
      <div className="filtersRow">
        <div className="filtersLeft">

          <div className="filterSelectGroup">
            <label className="filterLabel" htmlFor="searchFilter">Buscar</label>
            <div className="searchWrapper">
              <span className="searchIcon" aria-hidden="true">🔍</span>
              <input
                id="searchFilter"
                className="filterSearch"
                type="search"
                placeholder="Nome do evento..."
                value={filters.search}
                onChange={e => set({ search: e.target.value })}
                aria-label="Buscar evento"
              />
            </div>
          </div>

          <div className="filterSelectGroup">
            <label className="filterLabel" htmlFor="cityFilter">Cidade</label>
            <select
              id="cityFilter"
              className="filterSelect"
              value={filters.city}
              onChange={e => set({ city: e.target.value })}
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c === 'Todas' ? 'Todas as cidades' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="filterSelectGroup">
            <label className="filterLabel" htmlFor="priceFilter">Preço</label>
            <select
              id="priceFilter"
              className="filterSelect"
              value={filters.price}
              onChange={e => set({ price: e.target.value as EventPrice | 'Todos' })}
            >
              {PRICES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="filterSelectGroup">
            <label className="filterLabel" htmlFor="periodFilter">Período</label>
            <select
              id="periodFilter"
              className="filterSelect"
              value={filters.period}
              onChange={e => set({ period: e.target.value as PeriodFilter })}
            >
              {PERIODS.map(p => (
                <option key={p} value={p}>
                  {p === 'Tarde' ? 'Tarde (até 18h)' :
                   p === 'Noite' ? 'Noite (18–22h)' :
                   p === 'Madrugada' ? 'Madrugada (22h+)' : p}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="filtersMeta">
          <span className="filterCount">
            {filtered === total
              ? `${total} evento${total !== 1 ? 's' : ''}`
              : `${filtered} de ${total}`}
          </span>
          {active > 0 && (
            <button className="clearFilters" onClick={() => onChange(INITIAL_FILTERS)}>
              ✕ Limpar{active > 1 ? ` (${active})` : ''}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
