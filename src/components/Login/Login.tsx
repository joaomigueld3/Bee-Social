import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem('username', username);
    navigate('/events');
  }

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
        <button className="btnEnter" type="submit">Enter</button>
      </div>
    </form>
  );
}
