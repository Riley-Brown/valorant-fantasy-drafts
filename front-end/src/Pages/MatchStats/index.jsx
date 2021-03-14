import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

export default function MatchStats() {
  const { matchId } = useParams();

  const [matchData, setMatchData] = useState();

  useEffect(() => {
    fetch(`http://localhost:9999/match-stats/${matchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((jsonData) =>
      jsonData.json().then((matchData) => {
        console.log(matchData);
        setMatchData(matchData);
      })
    );
  }, []);

  return <div></div>;
}
