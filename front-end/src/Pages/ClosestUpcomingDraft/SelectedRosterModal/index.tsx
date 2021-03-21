import { useState } from 'react';

import SelectedRoster from '../SelectedRoster';

import { ReactComponent as ChevronUp } from 'Assets/chevron-up.svg';

import SpinnerButton from 'Components/SpinnerButton';
import Fade from 'Components/Fade';

export default function SelectedRosterModal({
  selectedRoster,
  loading,
  handleEnterDraft
}: {
  selectedRoster: any[];
  loading: boolean;
  handleEnterDraft: () => Promise<void>;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Fade inProp={show}>
        <div className="modal-backdrop">
          <div className="container">
            <div className="modal">
              <div className="header">
                <h1>Selected roster</h1>
                <button
                  className="btn"
                  aria-label="Close roster modal"
                  onClick={() => setShow(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <SelectedRoster selectedRoster={selectedRoster} />
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
      </Fade>
      {selectedRoster.length > 0 && (
        <button
          onClick={() => setShow(true)}
          className="btn view-selected-roster-btn"
        >
          View selected roster
          <ChevronUp />
        </button>
      )}
    </div>
  );
}
