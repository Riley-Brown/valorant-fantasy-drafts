export async function getAccount() {
  const res = await fetch('http://localhost:9999/account', {
    method: 'GET',
    credentials: 'include'
  });

  return res.json();
}
