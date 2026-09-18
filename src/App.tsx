import './styles/App.css';
import Login from './components/Login/Login';
import MainPage from './pages/MainPage';
import bee from './assets/bee.svg';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Bee Social</h1>
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setUsername={setUsername}
          username={username}
        />
        <img src={bee} alt="Uma abelha: Logo da Bee" className="logo" />
      </div>
    );
  }
  return <MainPage setIsLoggedIn={setIsLoggedIn} username={username} />;
}

export default App;
