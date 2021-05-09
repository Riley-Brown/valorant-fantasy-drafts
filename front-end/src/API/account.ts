import { API_ROOT } from './root';

import { AccountStateTypes } from 'Reducers/account';

export async function getAccount(): Promise<{
  type: string;
  data: AccountStateTypes;
}> {
  const res = await fetch(`${API_ROOT}/account`, {
    method: 'GET',
    credentials: 'include'
  });

  return res.json();
}

export async function updateAccount(data: {
  displayName: string;
}): Promise<{
  type: string;
  data: AccountStateTypes;
}> {
  const res = await fetch(`${API_ROOT}/account/update`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
