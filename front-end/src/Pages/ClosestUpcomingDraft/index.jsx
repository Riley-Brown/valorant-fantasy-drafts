import React, { useEffect, useState } from 'react';
import { enterDraft, getClosestUpcomingDraft } from 'API/drafts';

import AvailableDraftPlayer from './AvailableDraftPlayer';
import SelectedRoster from './SelectedRoster';

import useCountdownTimer from 'Hooks/useCountdownTimer';
import SpinnerButton from 'Components/SpinnerButton';

import './ClosestUpcomingDraft.scss';

export default function ClosestUpcomingDraft() {
  const [closestDraft, setClosestDraft] = useState();
  const [selectedRoster, setSelectedRoster] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClosestUpcomingDraft().then((draft) => {
      setClosestDraft(draft);
    });
  }, []);

  const handleSelectPlayer = (player) => {
    setSelectedRoster((prev) => [...prev, { ...player }]);
  };

  const handleRemoveSelectedPlayer = (player) => {
    setSelectedRoster((prev) =>
      prev.filter((curPlayer) => curPlayer.id !== player.id)
    );
  };

  const { days, hours, minutes, seconds } = useCountdownTimer({
    unixTimestamp: closestDraft?.startDate
  });

  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (searchFilter) {
      setFilteredPlayers(
        closestDraft.players.data.items.filter((player) =>
          player.id.toLowerCase().includes(searchFilter.toLowerCase())
        )
      );
    }
  }, [searchFilter]);

  return (
    <div
      id="closest-upcoming-draft"
      style={{
        margin: '40px',
        maxWidth: '1100px',
        margin: '40px auto',
        color: 'white'
      }}
    >
      <h1 style={{ marginBottom: '5px' }}>Daily Radiant fantasy draft</h1>
      <p style={{ marginBottom: '20px' }}>
        Starts in {days} days {hours}:{minutes}:{seconds}
      </p>
      <h1 style={{ color: '#fff', marginBottom: '10px' }}>Available players</h1>
      <div className="wrapper" style={{ display: 'flex' }}>
        <div style={{ flex: '0 1 50%' }}>
          <input
            style={{
              width: '100%',
              padding: '20px',
              borderRadius: '4px',
              border: 'none',
              marginBottom: '20px'
            }}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search for player"
          />

          {closestDraft?.players && (
            <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 125px)' }}>
              {(searchFilter
                ? filteredPlayers
                : closestDraft.players.data.items
              ).map((player) => (
                <AvailableDraftPlayer
                  selectedRoster={selectedRoster}
                  playerData={player}
                  handleRemoveSelectedPlayer={handleRemoveSelectedPlayer}
                  handleSelectPlayer={handleSelectPlayer}
                />
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: '100px', flex: 'auto' }}>
          <SelectedRoster
            selectedRoster={selectedRoster}
            setSelectedRoster={setSelectedRoster}
            handleRemoveSelectedPlayer={handleRemoveSelectedPlayer}
          />
          <SpinnerButton
            className="btn lock-in-button"
            spinnerProps={{ style: { color: '#2663f2' } }}
            loading={loading}
            disabled={selectedRoster.length < 5}
            onClick={async () => {
              setLoading(true);
              await enterDraft({
                draftId: closestDraft._id,
                selectedRoster: selectedRoster.map((player) => player.id)
              });
              setLoading(false);
            }}
          >
            Lock in
          </SpinnerButton>
        </div>
      </div>
    </div>
  );
}
