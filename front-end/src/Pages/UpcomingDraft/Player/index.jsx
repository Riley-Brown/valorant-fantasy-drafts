import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { getLeaderboard } from 'API/leaderboard';

export default function Leaderboard({ playerData }) {
  // const [leaderboard, setLeaderboard] = useState();
  // const history = useHistory();

  // useEffect(() => {
  //   const lsLeaderboard = localStorage.getItem('leaderboard');

  //   if (lsLeaderboard) {
  //     console.log(JSON.parse(lsLeaderboard));
  //     setLeaderboard(JSON.parse(lsLeaderboard));
  //   } else {
  //     getLeaderboard().then((data) => {
  //       localStorage.setItem('leaderboard', JSON.stringify(data));
  //       setLeaderboard(data);
  //     });
  //   }
  // }, []);

  return (
    <div
      style={{
        display: 'flex',
        margin: '20px auto',
        alignItems: 'center',
        background: '#f1f1f1',
        padding: '20px',
        color: '#222',
        borderRadius: '5px'
      }}
    >
      <img
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: '20px'
        }}
        src={playerData.owner.metadata.avatarUrl}
        alt={`${playerData.owner.metadata.platformUserHandle}`}
      />
      <h1>
        {playerData.rank} {playerData.owner.metadata.platformUserHandle}
      </h1>
    </div>
  );
}
