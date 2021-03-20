import { useState, useEffect } from 'react';
import './AvailableDraftPlayer.scss';

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
      className="available-draft-player"
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
        background: isSelected ? 'var(--success-darker)' : '#f1f1f1',
        color: isSelected ? '#fff' : '#222',
        transition: '300ms'
      }}
    >
      <img
        className="avatar"
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
