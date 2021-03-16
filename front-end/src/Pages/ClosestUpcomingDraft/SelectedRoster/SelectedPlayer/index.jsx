import React from 'react';

export default function SelectedPlayer({
  playerData,
  handleRemoveSelectedPlayer,
  empty
}) {
  return (
    <div className="selected-player">
      <div className="avatar">
        {playerData ? (
          <img src={playerData.owner.metadata.avatarUrl} alt="" />
        ) : (
          <div className="empty-background"></div>
        )}
      </div>
      {playerData && (
        <div className="player-info">
          <h1>{playerData.owner.metadata.platformUserHandle.split('#')[0]}</h1>
        </div>
      )}
    </div>
  );
}
