import { setAccount } from 'Actions/account';
import { setIsAuthed, setShowAuthModal } from 'Actions/global';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'Reducers';
import './Navbar.scss';

import { logout } from 'API/auth';
import { formattedInt } from 'Helpers';

export default function Navbar() {
  const account = useTypedSelector((state) => state.account);
  const dispatch = useDispatch();

  const isAuthed = useTypedSelector((state) => state.global.isAuthed);

  return (
    <nav id="navbar">
      <div>
        {isAuthed && (
          <div style={{ display: 'flex' }}>
            <h1>{account.email}</h1>
            <h2>Your balance: ${formattedInt(account.balance)}</h2>
          </div>
        )}
      </div>
      {isAuthed ? (
        <button
          onClick={async () => {
            dispatch(setIsAuthed(false));
            dispatch(
              setAccount({
                email: '',
                balance: 0,
                balanceFormatted: '0.00',
                userId: ''
              })
            );
            logout();
          }}
          className="btn"
        >
          Logout
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => dispatch(setShowAuthModal(true))}
        >
          Login
        </button>
      )}
    </nav>
  );
}
