import { useNavigate, Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { allEvents } from '../data/events';
import { CITIES } from '../components/Filters/Filters';
import bee from '../assets/bee.svg';
import './LandingPage.css';

const CATEGORIES = ['Rock', 'MPB', 'Jazz', 'Stand-up', 'Eletrônica', 'Samba', 'Pop', 'Rap'];
const CITY_LIST = CITIES.filter(c => c !== 'Todas');

const artistImages = allEvents
  .filter(e => e.imageUrl)
  .map(e => ({
    url: e.imageUrl!,
    artist: e.name.split(' — ')[0].trim(),
  }));

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = !!localStorage.getItem('username');
  if (isLoggedIn) return <Navigate to="/events" replace />;

  function goToEvents(params: Record<string, string> = {}) {
    localStorage.setItem('username', 'visitante');
    const qs = new URLSearchParams(params).toString();
    navigate(`/events${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="landing">
      <div className="landingGlow" aria-hidden="true" />

      <button className="landingThemeBtn" onClick={toggleTheme} aria-label="Alternar tema">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="landingContent">
        <img src={bee} className="landingBee" alt="Logo Bee Social" />

        <h1 className="landingTitle">
          Bee <span className="landingTitleAccent">Social</span>
        </h1>
        <p className="landingTagline">Descubra eventos culturais perto de você</p>
        <p className="landingSub">
          70+ eventos em 6 cidades — shows, festivais,<br />stand-up e muito mais
        </p>

        <button className="landingCta" onClick={() => goToEvents()}>
          Explorar eventos →
        </button>

        <div className="landingSection">
          <span className="landingSectionLabel">Categorias</span>
          <div className="landingTags" role="group" aria-label="Categorias">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className="landingTag"
                onClick={() => goToEvents({ category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="landingSection">
          <span className="landingSectionLabel">Cidades</span>
          <div className="landingCityButtons" role="group" aria-label="Cidades">
            {CITY_LIST.map(city => (
              <button
                key={city}
                type="button"
                className="landingCityBtn"
                onClick={() => goToEvents({ city })}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {artistImages.length > 0 && (
        <div className="landingMarqueeSection">
          <p className="landingMarqueeTitle">Artistas em cartaz</p>
          <div className="landingMarqueeWrapper">
            <div className="landingMarqueeTrack">
              {[...artistImages, ...artistImages].map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className="landingMarqueeCard"
                  onClick={() => goToEvents({ search: img.artist })}
                  aria-label={`Ver eventos de ${img.artist}`}
                >
                  <img src={img.url} alt={img.artist} loading="lazy" />
                  <span className="landingMarqueeName">{img.artist}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
