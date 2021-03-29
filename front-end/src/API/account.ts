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
