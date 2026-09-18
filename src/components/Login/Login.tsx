import './Login.css';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}

export default function Login({ setIsLoggedIn, setUsername, username }: LoginProps) {
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <form className="form" onSubmit={login}>
      <p className="loginText">Please, enter your Email below</p>
      <input
        type="email"
        name="username"
        className="inputName"
        placeholder="Email"
        minLength={6}
        required
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <div className="checkboxArea">
        <label>
          <input id="checkbox" type="checkbox" required />
          Are you older than 18 years old?
        </label>
      </div>
      <div className="buttonArea">
        <button className="btnEnter" type="submit" title="Enter">
          Enter
        </button>
      </div>
    </form>
  );
}
