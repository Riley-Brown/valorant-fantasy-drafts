import { useState } from 'react';
import { useForm } from 'react-hook-form';

import './LoginForm.scss';

import { login } from 'API';

import SpinnerButton from 'Components/SpinnerButton';

export default function LoginForm({
  handleGetAccount,
  onLoginSuccess
}: {
  handleGetAccount: () => Promise<void>;
  onLoginSuccess: () => any;
}) {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string; password: string }>();

  const [loading, setLoading] = useState(false);

  const handleLogin = handleSubmit(async ({ email, password }) => {
    setLoading(true);

    const loginRes = await login({ email, password });

    if (loginRes.type === 'ok') {
      await handleGetAccount();

      setLoading(false);
      onLoginSuccess();
    } else {
      setLoading(false);
      setError('email', { message: loginRes.message });
    }
  });

  return (
    <div id="login-form">
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            id="email"
          />
          {errors.email && (
            <small
              style={{ marginTop: '5px', display: 'block' }}
              className="text-danger"
            >
              {errors.email.message}
            </small>
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <small
              style={{ marginTop: '5px', display: 'block' }}
              className="text-danger"
            >
              {errors.password.message}
            </small>
          )}
        </div>
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
