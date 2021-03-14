import axios from 'axios';

export async function getLeaderboard() {
  try {
    const { data } = await axios.get(
      `https://api.tracker.gg/api/v1/valorant/standard/leaderboards?type=ranked&platform=all&board=default&skip=0&take=100`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
}
