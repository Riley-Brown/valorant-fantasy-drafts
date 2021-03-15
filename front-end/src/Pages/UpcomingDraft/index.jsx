import React, { useEffect, useState } from 'react';

import { getUpcomingDraft } from 'API/drafts';
import { useParams } from 'react-router';

import Player from './Player';

export default function UpcomingDraft() {
  const { draftId } = useParams();
  const [draftData, setDraftData] = useState();

  useEffect(() => {
    getUpcomingDraft(draftId).then((draftData) => {
      console.log(draftData);
      setDraftData(draftData);
    });
  }, []);

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '40px auto'
      }}
    >
      <h1 style={{ color: '#fff' }}>Choose your players</h1>
      {draftData?.players && (
        <div style={{ marginTop: '40px' }}>
          {draftData.players.data.items.map((player) => (
            <Player playerData={player} />
          ))}
        </div>
      )}
    </div>
  );
}
