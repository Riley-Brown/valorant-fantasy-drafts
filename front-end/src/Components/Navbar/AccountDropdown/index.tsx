import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ReactComponent as ChevronDownSvg } from 'Assets/chevron-down.svg';

import { Menu } from '@headlessui/react';

import { logout } from 'API';

import { formattedInt } from 'Helpers';

import { useTypedSelector } from 'Reducers';
import { setIsAuthed, logout as logoutAction } from 'Actions';

export default function AccountDropdown() {
  const account = useTypedSelector((state) => state.account);
  const dispatch = useDispatch();

  return (
    <div className="dropdown-wrapper">
      <Menu>
        <>
          <Menu.Button className="btn dropdown-button">
            <h1 className="email">{account.email}</h1>
            <div className="avatar">
              <span style={{ textTransform: 'uppercase' }}>
                {account.email.split('')[0]}
              </span>
            </div>
            <ChevronDownSvg />
          </Menu.Button>
          <Menu.Items className="dropdown">
            <h2>Balance: ${formattedInt(account.balance)}</h2>
            {account.isAdmin && (
              <Menu.Item>
                {({ active }) => (
                  <Link className={`${active ? 'active' : ''}`} to="/admin">
                    Admin
                  </Link>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <Link className={`${active ? 'active' : ''}`} to="/account">
                  Account
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link className={`${active ? 'active' : ''}`} to="/">
                  Drafts
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active ? 'active' : ''}`}
                  to="/account/drafts"
                >
                  My drafts
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`btn logout-btn ${active ? 'active' : ''}`}
                  onClick={async () => {
                    dispatch(setIsAuthed(false));
                    dispatch(logoutAction());
                    logout();
                  }}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </>
      </Menu>
    </div>
  );
}
