import { useState, FormEvent } from 'react';
import { useHistory } from 'react-router';

import { login } from 'API/auth';

import './LoginForm.scss';
import SpinnerButton from 'Components/SpinnerButton';
import { useDispatch } from 'react-redux';
import { setIsAuthed } from 'Actions/global';
import { getAccount } from 'API/account';
import { setAccount } from 'Actions/account';

export default function LoginForm({
  onLoginSuccess
}: {
  onLoginSuccess: () => any;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const history = useHistory();

  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const loginRes = await login({ email, password });

    if (loginRes.type === 'ok') {
      dispatch(setIsAuthed(true));
      // history.push('/');

      const account = await getAccount();
      dispatch(
        setAccount({
          balance: account.data.balance,
          balanceFormatted: `$${account.data.balance * 100}`,
          drafts: account.data.drafts,
          email: account.data.email,
          isAdmin: account.data.isAdmin,
          signupDate: account.data.signupDate,
          stripeCustomerId: account.data.stripeCustomerId,
          userId: account.data.userId
        })
      );

      setLoading(false);
      onLoginSuccess();
    } else {
      setLoading(false);
      setError(loginRes.message);
    }
  };

  return (
    <div id="login-form">
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={({ target }) => {
              setError(false);
              setEmail(target.value);
            }}
            type="email"
            id="email"
            value={email}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            onChange={({ target }) => {
              setError(false);
              setPassword(target.value);
            }}
            type="password"
            id="password"
            value={password}
          />
        </div>
        {error && (
          <small
            style={{ marginTop: '5px', display: 'block' }}
            className="text-danger"
          >
            {error}
          </small>
        )}
        <SpinnerButton
          spinnerProps={{ style: { width: '1.5rem', height: '1.5rem' } }}
          type="submit"
          loading={loading}
          onClick={handleLogin}
        >
          Login
        </SpinnerButton>
      </form>
    </div>
  );
}
