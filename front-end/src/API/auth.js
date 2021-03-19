export async function login({ email, password }) {
  const res = await fetch('http://localhost:9999/auth/login', {
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
  const res = await fetch('http://localhost:9999/auth/signup', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}
