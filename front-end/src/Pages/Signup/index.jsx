import React, { useState } from 'react';
import { signup } from 'API/auth';

import './Signup.scss';

import { ReactComponent as SpinnerSvg } from 'Assets/spinner.svg';

export default function Signup({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    const signupRes = await signup({ email, password });

    if (signupRes.type === 'ok') {
      setLoading(false);
      history.push('/');
    } else {
      setLoading(false);
      setError(signupRes.message);
    }
  };

  return (
    <div id="signup">
      <form onSubmit={handleSignup}>
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
        <div className="input-wrapper">
          <label htmlFor="password2">Confirm password</label>
          <input
            onChange={({ target }) => setPassword2(target.value)}
            type="password"
            id="password2"
          />
        </div>
        <button className="btn" type="submit" style={{ position: 'relative' }}>
          {loading ? (
            <SpinnerSvg
              style={{
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                width: '40px',
                height: '40px',
                margin: 'auto',
                right: '50%',
                transform: 'translate(50%, -50%)'
              }}
            />
          ) : (
            'Signup'
          )}
        </button>
      </form>
    </div>
  );
}
