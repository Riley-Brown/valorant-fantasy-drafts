import axios from 'axios';

export async function getPlayerMatches(player) {
  return await axios.get(
    `https://api.tracker.gg/api/v2/valorant/standard/matches/riot/${encodeURIComponent(
      player
    )}?type=competitive`
  );
}
