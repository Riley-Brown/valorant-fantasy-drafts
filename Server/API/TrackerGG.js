import axios from 'axios';
import { FormatLeaderboardPlayers } from '../Models/Leaderboard';

export async function getPlayerMatches(player) {
  const { data } = await axios.get(
    `https://api.tracker.gg/api/v2/valorant/standard/matches/riot/${encodeURIComponent(
      player
    )}?type=competitive`
  );

  return data.data;
}

export async function getLeaderboard() {
  const { data } = await axios.get(
    `https://api.tracker.gg/api/v1/valorant/standard/leaderboards?type=ranked&platform=all&board=default&skip=0&take=100`
  );

  const formattedLeaderboard = FormatLeaderboardPlayers(data.data.items);

  return formattedLeaderboard;
}

export async function getMatchStats(matchId) {
  const { data } = await axios.get(
    `https://api.tracker.gg/api/v2/valorant/standard/matches/${matchId}`
  );

  return data;
}
