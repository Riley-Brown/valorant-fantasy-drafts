import React, { useEffect, useState } from 'react';
import { enterDraft, getClosestUpcomingDraft } from 'API/drafts';

import AvailableDraftPlayer from './AvailableDraftPlayer';
import SelectedRoster from './SelectedRoster';

import useCountdownTimer from 'Hooks/useCountdownTimer';
import SpinnerButton from 'Components/SpinnerButton';

import './ClosestUpcomingDraft.scss';

import { useToasts } from 'react-toast-notifications';
import { useTypedSelector } from 'Reducers';

import { setShowAuthModal } from 'Actions/global';
import { useDispatch } from 'react-redux';

export default function ClosestUpcomingDraft() {
  const [closestDraft, setClosestDraft] = useState();
  const [selectedRoster, setSelectedRoster] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAuthed = useTypedSelector((state) => state.global.isAuthed);

  const dispatch = useDispatch();

  const { addToast } = useToasts();

  useEffect(() => {
    getClosestUpcomingDraft().then((draft) => {
      setClosestDraft(draft);
    });
  }, []);

  const handleSelectPlayer = (player) => {
    if (selectedRoster.length === 5) {
      const rosterWithoutLastPlayer = selectedRoster.slice(0, 4);
      setSelectedRoster([...rosterWithoutLastPlayer, player]);
    } else {
      setSelectedRoster((prev) => [...prev, { ...player }]);
    }
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

  const handleEnterDraft = async () => {
    try {
      if (!isAuthed) {
        dispatch(setShowAuthModal(true));
        return;
      }

      setLoading(true);
      const enter = await enterDraft({
        draftId: closestDraft._id,
        selectedRoster: selectedRoster.map((player) => player.id)
      });

      if (enter.type === 'error') {
        addToast(<h2>{enter.message}</h2>, {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 10000
        });
      }

      if (enter.type === 'success') {
        addToast(<h2>Successfully entered draft!</h2>, {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 10000
        });
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

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
            <div>
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
          <div
            className="sticky-wrapper"
            style={{ position: 'sticky', top: isAuthed ? '135px' : '25px' }}
          >
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
              onClick={handleEnterDraft}
            >
              Lock in
            </SpinnerButton>
          </div>
        </div>
      </div>
    </div>
  );
}
