import { API_ROOT } from './root';

export async function login({ email, password }) {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function signup({ email, password }) {
  const res = await fetch(`${API_ROOT}/auth/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_ROOT}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  return res.json();
}
