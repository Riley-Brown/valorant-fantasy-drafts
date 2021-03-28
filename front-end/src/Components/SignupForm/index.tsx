import { useState, FormEvent } from 'react';
import { signup } from 'API/auth';

import './SignupForm.scss';

import { useHistory } from 'react-router';

import SpinnerButton from 'Components/SpinnerButton';
import { useDispatch } from 'react-redux';
import { setIsAuthed } from 'Actions/global';
import { getAccount } from 'API/account';
import { setAccount } from 'Actions/account';

export default function SignupForm({
  onSignupSuccess
}: {
  onSignupSuccess: () => any;
}) {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const signupRes = await signup({ email, password });

    if (signupRes.type === 'ok') {
      dispatch(setIsAuthed(true));

      const account = await getAccount();
      dispatch(
        setAccount({
          balance: account.data.balance,
          balanceFormatted: `$${account.data.balance * 100}`,
          drafts: [],
          email: account.data.email,
          isAdmin: false,
          signupDate: account.data.signupDate,
          userId: account.data._id
        })
      );

      setLoading(false);

      onSignupSuccess();
      // history.push('/');
    } else {
      setLoading(false);
      setError(signupRes.message);
    }
  };

  return (
    <div id="signup-form">
      <form onSubmit={handleSignup}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            id="email"
            value={email}
          />
          {error && (
            <small
              style={{ marginTop: '5px', display: 'block' }}
              className="text-danger"
            >
              {error}
            </small>
          )}
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
        <SpinnerButton
          spinnerProps={{ style: { width: '1.5rem', height: '1.5rem' } }}
          type="submit"
          loading={loading}
          onClick={handleSignup}
        >
          Signup
        </SpinnerButton>
      </form>
    </div>
  );
}
