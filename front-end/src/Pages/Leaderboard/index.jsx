import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState();
  const history = useHistory();

  useEffect(() => {
    const lsLeaderboard = localStorage.getItem('leaderboard');

    if (lsLeaderboard) {
      console.log(JSON.parse(lsLeaderboard));
      setLeaderboard(JSON.parse(lsLeaderboard));
    } else {
      fetch('http://localhost:9999/leaderboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((jsonData) =>
        jsonData.json().then((data) => {
          console.log({ data });
          localStorage.setItem('leaderboard', JSON.stringify(data));
        })
      );
    }
  }, []);

  return (
    <div style={{ margin: '100px', width: '70%' }}>
      {leaderboard &&
        leaderboard.data.items.map((player) => (
          <div
            style={{
              display: 'flex',
              margin: '20px auto'
            }}
            onClick={() => history.push(`/player/${player.id}`)}
          >
            <img
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '20px'
              }}
              src={player.owner.metadata.avatarUrl}
              alt={`${player.owner.metadata.platformUserHandle}`}
            />
            <h1>
              {player.rank} {player.owner.metadata.platformUserHandle}
            </h1>
          </div>
        ))}
    </div>
  );
}
