import React, { useState } from 'react';
import { login } from 'API/auth';

import './Login.scss';

export default function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const loginRes = await login({ email, password });

    if (loginRes.type === 'ok') {
      setLoading(false);
      history.push('/');
    } else {
      setLoading(false);
      setError(loginRes.message);
    }
  };

  return (
    <div id="login">
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            id="email"
            value={email}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            id="password"
            value={password}
          />
        </div>
        <button type="submit" className="btn" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
