export function FormatLeaderboardPlayers(players) {
  return players.map((player) => {
    const { avatarUrl, pictureUrl, platformUserHandle } = player.owner.metadata;

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
}
