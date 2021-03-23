import { API_ROOT } from "./root";

export async function getMatchStats(matchId) {
  const res = await fetch(`${API_ROOT}/match-stats/${matchId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
