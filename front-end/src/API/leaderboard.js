import { API_ROOT } from './root';

export async function getLeaderboard() {
  const res = await fetch(`${API_ROOT}/leaderboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
