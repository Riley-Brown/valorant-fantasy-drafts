export function FormatPlayerMatches(matches) {
  const matchStats = [];

  matches.forEach((match) => {
    const matchId = match.attributes.id;
    const {
      result,
      isAvailable,
      map,
      mapName,
      mapImageUrl,
      timestamp
    } = match.metadata;

    const score = match.segments[0].stats.score.value;

    matchStats.push({
      isAvailable,
      map,
      mapImageUrl,
      mapName,
      matchId,
      result,
      score,
      timestamp: Math.floor(Date.parse(timestamp) / 1000)
    });
  });

  return matchStats;
}
