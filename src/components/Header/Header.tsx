import './Header.css';
import arrow from '../../assets/arrow.svg';

interface HeaderProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
}

export default function Header({ setIsLoggedIn, username }: HeaderProps) {
  return (
    <div className="header">
      <div className="goBack">
        <button onClick={() => setIsLoggedIn(false)} title="Back to first screen">
          <img
            src={arrow}
            alt="Ícone de seta pra esquerda, para voltar pra tela de login"
          />
        </button>
        <button onClick={() => setIsLoggedIn(false)} title="Back to first screen">
          Go back
        </button>
      </div>
      <p>{username}</p>
    </div>
  );
}
