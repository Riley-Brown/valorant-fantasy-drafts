import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { getMatchStats } from 'API/matchStats';

export default function MatchStats() {
  const { matchId } = useParams();

  const [matchData, setMatchData] = useState();

  useEffect(() => {
    getMatchStats(matchId).then((matchData) => {
      setMatchData(matchData);
    });
  }, []);

  return <div>ayyy lmao sup?? </div>;
}
