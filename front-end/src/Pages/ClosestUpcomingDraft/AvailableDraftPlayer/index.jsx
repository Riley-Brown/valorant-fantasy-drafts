import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { getLeaderboard } from 'API/leaderboard';

export default function AvailableDraftPlayer({
  playerData,
  selectedRoster,
  handleRemoveSelectedPlayer,
  handleSelectPlayer
}) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const findIsSelected = selectedRoster.find(
      (player) => player.id === playerData.id
    );

    if (findIsSelected) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedRoster]);

  return (
    <div
      onClick={() => {
        const findIsSelected = selectedRoster.find(
          (player) => player.id === playerData.id
        );

        if (findIsSelected) {
          handleRemoveSelectedPlayer(playerData);
        } else {
          handleSelectPlayer(playerData);
        }
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        marginBottom: '20px',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '5px',
        background: isSelected ? 'var(--success-darker)' : '#f1f1f1',
        color: isSelected ? '#fff' : '#222',
        transition: '300ms',
        pointerEvents:
          selectedRoster.length === 5 && !isSelected ? 'none' : 'all'
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
        {playerData.rank}{' '}
        {playerData.owner.metadata.platformUserHandle.split('#')[0]}
      </h1>
    </div>
  );
}
