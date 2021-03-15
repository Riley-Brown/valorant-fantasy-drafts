export async function getMatchStats(matchId) {
  const res = await fetch(`http://localhost:9999/match-stats/${matchId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
