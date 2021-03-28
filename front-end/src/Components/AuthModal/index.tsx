import { useState } from 'react';
import { useDispatch } from 'react-redux';

import './AuthModal.scss';

import { setAuthLoginType, setShowAuthModal } from 'Actions/global';
import { useTypedSelector } from 'Reducers';

import trollLogo from 'Assets/troll-logo.png';

import SignupForm from 'Components/SignupForm';
import Fade from 'Components/Fade';
import LoginForm from 'Components/LoginForm';
import Portal from 'Components/Portal';

export default function AuthModal() {
  const showAuthModal = useTypedSelector((state) => state.global.showAuthModal);

  const dispatch = useDispatch();

  const loginType = useTypedSelector((state) => state.global.loginType);

  return (
    <div>
      <Portal id="auth-modal">
        <Fade inProp={showAuthModal}>
          <div
            id="modal-backdrop"
            onClick={() => {
              dispatch(setShowAuthModal(false));
            }}
          >
            <div className="container" onClick={(e) => e.stopPropagation()}>
              <div className="info">
                <img className="logo" src={trollLogo} alt="" />
                {loginType === 'login' ? (
                  <>
                    <h1>Login to Dolzy.com</h1>
                    <p>Login to your account to enter this draft</p>
                  </>
                ) : (
                  <>
                    <h1>Welcome to Dolzy.com</h1>
                    <p>Signup for our shitty ass site to enter this draft</p>
                  </>
                )}
              </div>
              {loginType === 'login' ? (
                <>
                  <LoginForm
                    onLoginSuccess={() => {
                      dispatch(setShowAuthModal(false));
                    }}
                  />
                  <footer>
                    <small>
                      Don't have an account?{' '}
                      <button
                        className="btn"
                        onClick={() => dispatch(setAuthLoginType('signup'))}
                      >
                        Signup
                      </button>
                    </small>
                  </footer>
                </>
              ) : (
                <>
                  <SignupForm
                    onSignupSuccess={() => dispatch(setShowAuthModal(false))}
                  />
                  <footer>
                    <small>
                      Already have an account?{' '}
                      <button
                        className="btn"
                        onClick={() => dispatch(setAuthLoginType('login'))}
                      >
                        Login
                      </button>
                    </small>
                  </footer>
                </>
              )}
            </div>
          </div>
        </Fade>
      </Portal>
    </div>
  );
}
