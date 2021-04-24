import { useState } from 'react';
import { useForm } from 'react-hook-form';

import './SignupForm.scss';

import { signup } from 'API';

import SpinnerButton from 'Components/SpinnerButton';

export default function SignupForm({
  handleGetAccount,
  onSignupSuccess
}: {
  handleGetAccount: () => Promise<void>;
  onSignupSuccess: () => any;
}) {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string; password: string; password2: string }>();

  console.log(errors);

  const [loading, setLoading] = useState(false);

  const handleSignup = handleSubmit(async ({ email, password, password2 }) => {
    console.log(errors, email, password);

    if (password !== password2) {
      setError('password', { message: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    const signupRes = await signup({ email, password });

    if (signupRes.type === 'ok') {
      await handleGetAccount();
      setLoading(false);
      onSignupSuccess();
    } else {
      setLoading(false);
      setError('email', { message: signupRes.message });
    }
  });

  return (
    <div id="signup-form">
      <form onSubmit={handleSignup}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
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
        <div className="input-wrapper">
          <label htmlFor="password2">Confirm password</label>
          <input
            {...register('password2', {
              required: 'Confirm password is required'
            })}
            type="password"
            id="password2"
          />
          {errors.password2 && (
            <small
              style={{ marginTop: '5px', display: 'block' }}
              className="text-danger"
            >
              {errors.password2.message}
            </small>
          )}
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
