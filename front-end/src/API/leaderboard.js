export async function getLeaderboard() {
  const res = await fetch('http://localhost:9999/leaderboard', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
