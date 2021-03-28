import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useTypedSelector } from 'Reducers';
import './Admin.scss';
import CreateDraft from './CreateDraft';

export default function Admin({ history }: RouteComponentProps) {
  const account = useTypedSelector((state) => state.account);

  useEffect(() => {
    if (!account.isAdmin) {
      history.push('/');
    }
  }, []);

  return (
    <div id="admin">
      <CreateDraft />
    </div>
  );
}
