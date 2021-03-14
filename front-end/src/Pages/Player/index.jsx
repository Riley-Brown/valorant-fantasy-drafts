import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

export default function Player() {
  const [playerData, setPlayerData] = useState();
  const { playerId } = useParams();
  const location = useLocation();

  const history = useHistory();

  useEffect(() => {
    const lsPlayerData = localStorage.getItem(playerData);

    if (lsPlayerData) {
      setPlayerData(lsPlayerData);
    } else {
      console.log(playerId, location.hash);
      const encode = encodeURIComponent(`${playerId}${location.hash}`);

      fetch(`http://localhost:9999/player-matches/${encode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((jsonData) =>
        jsonData.json().then((playerData) => {
          console.log(playerData);
          setPlayerData(playerData);
          localStorage.setItem(playerId, JSON.stringify(playerData));
        })
      );
    }
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
                          ? 'rgb(255, 74, 89)'
                          : 'rgb(48, 235, 191)'
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
