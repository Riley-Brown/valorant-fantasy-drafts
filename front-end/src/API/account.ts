import { API_ROOT } from './root';

export async function getAccount() {
  const res = await fetch(`${API_ROOT}/account`, {
    method: 'GET',
    credentials: 'include'
  });

  return res.json();
}
