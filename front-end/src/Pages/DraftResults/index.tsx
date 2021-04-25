import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { getLiveDraftResults, liveDraftResultsEventsUrl } from 'API';
import SelectedRoster from 'Pages/ClosestUpcomingDraft/SelectedRoster';
import { calcUnixTimeDifference } from 'Helpers';

export default function DraftResults() {
  const params = useParams<{ draftId: string }>();

  const [lastUpdated, setLastUpdated] = useState<number>();
  const [participantsScores, setParticipantsScores] = useState<any[]>();
  const [playerMatches, setPlayerMatches] = useState<any[]>();
  const [players, setPlayers] = useState<{
    [key: string]: {
      avatarUrl: string;
      elo: number;
      iconUrl: string;
      id: string;
      pictureUrl: string;
      platformUserHandle: string;
      rank: number;
      userHandleOnly: string;
      wins: number;
    };
  }>();

  useEffect(() => {
    const events = new EventSource(liveDraftResultsEventsUrl(params.draftId));

    events.addEventListener('message', (message) => {
      console.log(message);
      const {
        participantsScores,
        playerMatches,
        lastUpdated,
        players
      } = JSON.parse(message.data);

      // console.log(parsedData);

      setParticipantsScores(participantsScores);

      setPlayerMatches(handleFormatPlayerMatches(playerMatches));
      setLastUpdated(lastUpdated);
      setPlayers(players);
    });

    getLiveDraftResults(params.draftId).then((res) => {
      setParticipantsScores(res.data.participantsScores);

      const playerMatches = handleFormatPlayerMatches(res.data.playerMatches);

      console.log(playerMatches);

      setPlayerMatches(playerMatches);
      setLastUpdated(res.lastUpdated);
      setPlayers(res.data.players);

      const currentTime = Math.floor(Date.now() / 1000);
      const { minutes, seconds } = calcUnixTimeDifference(
        currentTime,
        res.lastUpdated
      );

      setLastUpdatedFormatted({ minutes, seconds });
    });
  }, []);

  const lastUpdatedIntervalRef = useRef<any>();

  const [lastUpdatedFormatted, setLastUpdatedFormatted] = useState<{
    minutes: number;
    seconds: number;
  }>();

  useEffect(() => {
    const handleLastUpdated = () => {
      const currentTime = Date.now() / 1000;
      const { minutes, seconds } = calcUnixTimeDifference(
        currentTime,
        lastUpdated as number
      );

      setLastUpdatedFormatted({ minutes, seconds });
    };

    if (lastUpdated) {
      lastUpdatedIntervalRef.current = setInterval(handleLastUpdated, 5000);
    }

    return () => {
      clearInterval(lastUpdatedIntervalRef.current);
    };
  }, [lastUpdated]);

  const handleFormatPlayerMatches = (playerMatches: any) => {
    return (playerMatches = Object.keys(playerMatches)
      .map((key) => ({ ...playerMatches[key], id: key }))
      .sort((a: any, b: any) => b.totalScore - a.totalScore));
  };

  return (
    <div
      style={{
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 50
      }}
    >
      {players && playerMatches && (
        <div style={{ marginRight: 200 }}>
          <h1>Best performing players</h1>
          {lastUpdated && (
            <h4 style={{ marginBottom: 20 }}>
              Last updated: {lastUpdatedFormatted?.minutes} minutes
              {lastUpdatedFormatted?.seconds} seconds
            </h4>
          )}
          {playerMatches.map((player) => (
            <div style={{ marginBottom: 20 }}>
              <h2>{players[player.id].userHandleOnly}</h2>
              <img src={players[player.id].avatarUrl} alt="" />
              <h4>Rank: {players[player.id].rank}</h4>
              <h4>Total score for this draft: {player.totalScore}</h4>
            </div>
          ))}
        </div>
      )}
      {participantsScores && (
        <div>
          <h1 style={{ marginBottom: 20 }}>Best performing draft rosters</h1>

          {participantsScores.map((participant: any, index) => (
            <div style={{ marginBottom: 50 }}>
              <h4 style={{ marginBottom: 10 }}>
                Total score: {participant.totalScore}
              </h4>
              <SelectedRoster selectedRoster={participant.selectedRoster} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
