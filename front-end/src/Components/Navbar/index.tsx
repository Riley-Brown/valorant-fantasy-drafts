import {
  setAuthLoginType,
  setIsAuthed,
  setShowAuthModal,
  logout as logoutAction
} from 'Actions';

import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'Reducers';
import './Navbar.scss';

import { logout } from 'API';

import AccountDropdown from './AccountDropdown';

export default function Navbar() {
  const account = useTypedSelector((state) => state.account);
  const dispatch = useDispatch();

  const isAuthed = useTypedSelector((state) => state.global.isAuthed);

  return (
    <nav role="navigation" id="navbar">
      <div>{isAuthed && <AccountDropdown />}</div>
      {isAuthed ? (
        <button
          onClick={async () => {
            dispatch(setIsAuthed(false));
            dispatch(logoutAction());
            logout();
          }}
          className="btn"
        >
          Logout
        </button>
      ) : (
        <>
          <div>
            <button
              className="btn"
              onClick={() => {
                dispatch(setAuthLoginType('login'));
                dispatch(setShowAuthModal(true));
              }}
              style={{ marginRight: '20px' }}
            >
              Login
            </button>
            <button
              className="btn register"
              onClick={() => {
                dispatch(setAuthLoginType('signup'));
                dispatch(setShowAuthModal(true));
              }}
            >
              Register
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
