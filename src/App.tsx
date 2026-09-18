import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Login from './components/Login/Login';
import MainPage from './pages/MainPage';
import FavoritesPage from './pages/FavoritesPage';
import bee from './assets/bee.svg';
import './styles/App.css';

function LoginPage() {
  const isLoggedIn = !!localStorage.getItem('username');
  if (isLoggedIn) return <Navigate to="/events" replace />;

  return (
    <div className="container">
      <h1><span>Bee Social</span></h1>
      <Login />
      <img src={bee} alt="Uma abelha: Logo da Bee" className="logo" />
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('username');
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/events" element={<PrivateRoute><MainPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
