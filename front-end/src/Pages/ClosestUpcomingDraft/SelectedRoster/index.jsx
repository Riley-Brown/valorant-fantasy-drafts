import React from 'react';
import './SelectedRoster.scss';

import SelectedPlayer from './SelectedPlayer';

export default function SelectedRoster({
  selectedRoster,
  handleRemoveSelectedPlayer
}) {
  return (
    <div id="selected-roster">
      {Array(5)
        .fill('')
        .map((_, index) =>
          selectedRoster[index] ? (
            <SelectedPlayer
              handleRemoveSelectedPlayer={handleRemoveSelectedPlayer}
              playerData={selectedRoster[index]}
            />
          ) : (
            <SelectedPlayer empty={true} />
          )
        )}
    </div>
  );
}
