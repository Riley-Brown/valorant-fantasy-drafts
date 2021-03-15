import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

import { getPlayerMatches } from 'API/playerMatches';

export default function Player() {
  const [playerData, setPlayerData] = useState();
  const { playerId } = useParams();
  const location = useLocation();

  const history = useHistory();

  useEffect(() => {
    const encode = encodeURIComponent(`${playerId}${location.hash}`);
    getPlayerMatches(encode).then((playerData) => {
      setPlayerData(playerData);
    });
  }, []);

  return (
    <div>
      {playerData &&
        playerData.data.matches.map(
          (match) =>
            match.metadata.isAvailable && (
              <div
                onClick={() =>
                  history.push(
                    `/player/${playerId}/match/${match.attributes.id}`
                  )
                }
                style={{
                  padding: '20px',
                  maxWidth: '900px',
                  margin: 'auto',
                  color: 'white',
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
              url("${match.metadata.mapImageUrl}")`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  marginBottom: '40px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <h1 style={{ marginRight: '20px' }}>
                    {match.metadata.mapName}
                  </h1>
                  <h2
                    style={{
                      color:
                        match.metadata.result === 'defeat'
                          ? 'var(--danger)'
                          : 'var(--success)'
                    }}
                  >
                    {match.metadata.result}
                  </h2>
                </div>
              </div>
            )
        )}
    </div>
  );
}
