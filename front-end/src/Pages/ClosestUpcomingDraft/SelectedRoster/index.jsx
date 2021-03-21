import './SelectedRoster.scss';

import SelectedPlayer from './SelectedPlayer';

export default function SelectedRoster({ selectedRoster }) {
  return (
    <div id="selected-roster">
      {Array(5)
        .fill('')
        .map((_, index) =>
          selectedRoster[index] ? (
            <SelectedPlayer playerData={selectedRoster[index]} />
          ) : (
            <SelectedPlayer empty={true} />
          )
        )}
    </div>
  );
}
