import { setAccount } from 'Actions/account';
import { setIsAuthed } from 'Actions/global';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'Reducers';
import './Navbar.scss';

import { logout } from 'API/auth';

export default function Navbar() {
  const account = useTypedSelector((state) => state.account);
  const dispatch = useDispatch();

  return (
    <nav id="navbar">
      <div>
        <h1>{account.email}</h1>
        <h2>Your balance: ${account.balanceFormatted}</h2>
      </div>

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
    </nav>
  );
}
