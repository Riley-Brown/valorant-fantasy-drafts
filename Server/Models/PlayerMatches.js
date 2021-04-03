export function FormatPlayerMatches(matches) {
  const matchStats = [];

  matches.forEach((match) => {
    const matchId = match.attributes.id;
    const {
      isAvailable,
      map,
      mapImageUrl,
      mapName,
      result,
      timestamp
    } = match.metadata;

    if (isAvailable) {
      const {
        assists,
        damage,
        damagePerRound,
        deaths,
        defuses,
        firstBloods,
        headshotsPercentage,
        kdRatio,
        kills,
        placement,
        plants,
        roundsLost,
        roundsWon,
        score,
        scorePerRound
      } = match.segments[0].stats;

      const { agentImageUrl, agentName } = match.segments[0].metadata;

      matchStats.push({
        agentImageUrl,
        agentName,
        assists: assists.value,
        damage: damage.value,
        damagePerRound: damagePerRound.value,
        deaths: deaths.value,
        defuses: defuses.value,
        firstBloods: firstBloods.value,
        headshotsPercentage: headshotsPercentage.value,
        isAvailable,
        kdRatio: kdRatio.value,
        kills: kills.value,
        map,
        mapImageUrl,
        mapName,
        matchId,
        placement: placement.value,
        plants: plants.value,
        result,
        roundsLost: roundsLost.value,
        roundsWon: roundsWon.value,
        score: score.value,
        scorePerRound: scorePerRound.displayValue,
        timestamp: Math.floor(Date.parse(timestamp) / 1000)
      });
    }
  });

  return matchStats;
}
