import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ReactComponent as ChevronDownSvg } from 'Assets/chevron-down.svg';

import useHandleOutsideClick from 'Hooks/useHandleOutsideClick';

import { logout } from 'API';

import { formattedInt } from 'Helpers';

import { useTypedSelector } from 'Reducers';
import { setIsAuthed, logout as logoutAction } from 'Actions';

export default function AccountDropdown() {
  const account = useTypedSelector((state) => state.account);

  const [isShowSettingsDropdown, setIsShowSettingsDropdown] = useState(false);

  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useHandleOutsideClick(dropdownWrapperRef, () =>
    setIsShowSettingsDropdown(false)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isShowSettingsDropdown) {
      dropdownRef.current?.focus();
      // window.addEventListener('keydown', handleKeyboardNavigation, false);
    } else {
      // window.removeEventListener('keydown', handleKeyboardNavigation, false);
    }

    // return () => {
    //   window.removeEventListener('keydown', handleKeyboardNavigation, false);
    // };
  }, [isShowSettingsDropdown]);

  const handleKeyboardNavigation = (e: KeyboardEvent) => {
    if (dropdownRef.current) {
      if (e.key === 'Escape') {
        setIsShowSettingsDropdown(false);
      }
    }
  };

  return (
    <div
      ref={dropdownWrapperRef}
      tabIndex={0}
      className="dropdown-wrapper"
      id="account-dropdown"
      onClick={() => setIsShowSettingsDropdown(!isShowSettingsDropdown)}
      aria-haspopup="true"
      aria-expanded={isShowSettingsDropdown}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsShowSettingsDropdown(!isShowSettingsDropdown);
        }
      }}
    >
      <h1 className="email">{account.email}</h1>
      <div className="avatar">
        <span style={{ textTransform: 'uppercase' }}>
          {account.email.split('')[0]}
        </span>
      </div>
      <ChevronDownSvg />
      {isShowSettingsDropdown && (
        <ul
          className="dropdown"
          role="menu"
          ref={dropdownRef}
          tabIndex={0}
          onKeyDown={(e) => {
            e.stopPropagation();

            if (e.key === 'Escape') {
              setIsShowSettingsDropdown(false);
            }
          }}
        >
          <h2>Balance: ${formattedInt(account.balance)}</h2>
          {account.isAdmin && (
            <li>
              <Link
                className="focusable"
                role="menuitem"
                onClick={() => setIsShowSettingsDropdown(false)}
                to="/admin"
              >
                Admin
              </Link>
            </li>
          )}
          <li>
            <Link
              className="focusable"
              role="menuitem"
              onClick={() => setIsShowSettingsDropdown(false)}
              to="/account"
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              className="focusable"
              role="menuitem"
              onClick={() => setIsShowSettingsDropdown(false)}
              to="/"
            >
              Drafts
            </Link>
          </li>
          <li>
            <Link
              className="focusable"
              role="menuitem"
              onClick={() => setIsShowSettingsDropdown(false)}
              to="/account/drafts"
            >
              My drafts
            </Link>
          </li>
          <li>
            <button
              role="menuitem"
              className="btn logout-btn focusable"
              onClick={async () => {
                dispatch(setIsAuthed(false));
                dispatch(logoutAction());
                logout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
