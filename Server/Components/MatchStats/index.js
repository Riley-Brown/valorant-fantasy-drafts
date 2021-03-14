import axios from 'axios';

export async function getMatchStats(matchId) {
  try {
    const { data } = await axios.get(
      `https://api.tracker.gg/api/v2/valorant/standard/matches/${matchId}`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
}
