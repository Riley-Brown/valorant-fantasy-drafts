import React, { FormEvent, useState } from 'react';

import { ReactComponent as PlusSvg } from 'Assets/plus-circle.svg';
import Fade from 'Components/Fade';
import Portal from 'Components/Portal';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useToasts } from 'react-toast-notifications';

import { createDraft } from 'API/drafts';
import SpinnerButton from 'Components/SpinnerButton';

export default function CreateDraft() {
  const { addToast } = useToasts();

  const [show, setShow] = useState(false);

  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => new Date());
  const [entryFee, setEntryFee] = useState('5.00');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const create = await createDraft({
        startDate: Math.floor(startDate.getTime() / 1000),
        endDate: Math.floor(endDate.getTime() / 1000),
        entryFee: parseInt(entryFee) * 100
      });

      console.log(create);

      if (create.type === 'ok') {
        addToast(<h2>Successfully created draft!</h2>, {
          appearance: 'success',
          autoDismiss: true
        });
      } else {
        addToast(<h2>{create.message}</h2>, {
          appearance: 'error',
          autoDismiss: true
        });
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  };

  return (
    <div className="create-draft">
      <button
        onClick={() => setShow(true)}
        className="btn"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <PlusSvg style={{ marginRight: '5px' }} />
        <h1>Create draft</h1>
      </button>
      <Portal id="create-draft-modal">
        <Fade inProp={show}>
          <div className="modal-backdrop" onClick={() => setShow(false)}>
            <div className="container" onClick={(e) => e.stopPropagation()}>
              <h1 style={{ marginBottom: '20px' }}>Create a new draft</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="input-wrapper">
                    <label htmlFor="start-time">Start time</label>
                    <DatePicker
                      dateFormat="hh:mm a MM/dd "
                      showTimeInput={true}
                      selected={startDate}
                      id="start-time"
                      onChange={(date) => {
                        console.log(date);
                        setStartDate(date as Date);
                      }}
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="end-time">End time</label>
                    <DatePicker
                      id="end-time"
                      dateFormat="hh:mm a MM/dd "
                      showTimeInput={true}
                      selected={endDate}
                      onChange={(date) => {
                        console.log(date);
                        setEndDate(date as Date);
                      }}
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <label htmlFor="entry-fee">Entry fee</label>
                  <input
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    type="number"
                    id="entry-fee"
                  />
                </div>
                <SpinnerButton loading={loading} type="submit" className="btn">
                  Submit
                </SpinnerButton>
              </form>
            </div>
          </div>
        </Fade>
      </Portal>
    </div>
  );
}
