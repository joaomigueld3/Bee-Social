import './styles/App.css';
import Login from './components/Login/Login';
import MainPage from './pages/MainPage';
import bee from './assets/bee.svg';
import { useState } from 'react';

function App() {
  const [condicional, setCondicional] = useState(false);
  const [username, setUsername] = useState('');

  if (!condicional) {
    return (
      <div className="container">
        <h1>
          <a>Bee Social</a>
        </h1>
        <Login
          setCondicional={setCondicional}
          setUsername={setUsername}
          username={username}
        />
        <img src={bee} alt="Uma abelha: Logo da Bee" className="logo" />
      </div>
    );
  }
  return <MainPage setCondicional={setCondicional} username={username} />;
}

export default App;
