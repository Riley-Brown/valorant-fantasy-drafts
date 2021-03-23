import { API_ROOT } from './root';

export async function getPlayerMatches(playerId) {
  const res = await fetch(`${API_ROOT}/player-matches/${playerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
