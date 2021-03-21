import axios from 'axios';

export async function getLeaderboard() {
  try {
    const { data } = await axios.get(
      `https://api.tracker.gg/api/v1/valorant/standard/leaderboards?type=ranked&platform=all&board=default&skip=0&take=100`
    );

    const formattedPlayers = data.data.items.map((player) => {
      const {
        avatarUrl,
        pictureUrl,
        platformUserHandle
      } = player.owner.metadata;

      return {
        avatarUrl,
        elo: player.value,
        iconUrl: player.iconUrl,
        id: player.id,
        pictureUrl,
        platformUserHandle,
        rank: player.rank,
        userHandleOnly: platformUserHandle.split('#')[0],
        wins: player.owner.stats[1].value
      };
    });

    return formattedPlayers;
  } catch (err) {
    console.log(err);
  }
}
