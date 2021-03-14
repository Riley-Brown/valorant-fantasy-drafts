import axios from 'axios';

export async function getPlayerMatches(player) {
  try {
    const { data } = await axios.get(
      `https://api.tracker.gg/api/v2/valorant/standard/matches/riot/${encodeURIComponent(
        player
      )}?type=competitive`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
}
