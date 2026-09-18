import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="searchBarWrapper">
      <span className="searchIcon" aria-hidden="true">🔍</span>
      <input
        className="searchBar"
        type="search"
        placeholder="Buscar evento..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Buscar evento"
      />
    </div>
  );
}
