import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import arrow from '../../assets/arrow.svg';

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('username');
    navigate('/');
  }

  return (
    <header className="header">
      <div className="headerLeft">
        <button className="goBackBtn" onClick={logout} title="Sair">
          <img src={arrow} alt="Voltar" />
        </button>
        <button className="goBackBtn goBackText" onClick={logout}>
          Sair
        </button>
      </div>

      <nav className="headerNav">
        <Link to="/events" className="navLink">Eventos</Link>
        <Link to="/favorites" className="navLink navFavorites">
          ♥ Favoritos
          {favorites.size > 0 && (
            <span className="favCount">{favorites.size}</span>
          )}
        </Link>
      </nav>

      <div className="headerRight">
        <button
          className="themeToggle"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span className="username">{username}</span>
      </div>
    </header>
  );
}
