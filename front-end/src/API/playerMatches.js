export async function getPlayerMatches(playerId) {
  const res = await fetch(`http://localhost:9999/player-matches/${playerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
