import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateAccount } from 'API';
import { updateAccount as updateAccountAction } from 'Actions';

import { ReactComponent as EditSvg } from 'Assets/edit.svg';
import SpinnerButton from 'Components/SpinnerButton';

export default function DisplayName({ displayName }: { displayName: string }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [updatedDisplayName, setUpdatedDisplayName] = useState(displayName);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateAccount = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await updateAccount({ displayName: updatedDisplayName });

    dispatch(updateAccountAction({ displayName: updatedDisplayName }));

    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="wrapper">
      <li>Display name</li>
      <div className="display-name-wrapper">
        {isEditing ? (
          <>
            <form onSubmit={handleUpdateAccount}>
              <input
                className="edit-display-name"
                type="text"
                defaultValue={displayName}
                onChange={(e) => setUpdatedDisplayName(e.target.value)}
              />
              <div className="btn-wrapper">
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedDisplayName(displayName);
                  }}
                >
                  Cancel
                </button>
                <SpinnerButton
                  loading={loading}
                  className="btn save"
                  type="submit"
                >
                  Save
                </SpinnerButton>
              </div>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsEditing(true)}
              className="btn"
              style={{
                color: 'white',
                padding: 5,
                lineHeight: 1,
                marginRight: '10px'
              }}
              title="Edit display name"
            >
              <EditSvg width={20} height={20} />
            </button>
            <li>{displayName}</li>
          </div>
        )}
      </div>
    </div>
  );
}
