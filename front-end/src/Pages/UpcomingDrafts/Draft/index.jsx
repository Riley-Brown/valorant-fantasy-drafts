import useCountdownTimer from 'Hooks/useCountdownTimer';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Draft({ draftData }) {
  const { days, hours, minutes, seconds } = useCountdownTimer({
    unixTimestamp: draftData.startDate
  });

  return (
    <div
      style={{
        background: '#f1f1f1',
        marginBottom: '40px',
        borderRadius: '4px',
        color: '#222',
        padding: '20px'
      }}
    >
      <h1 style={{ marginBottom: '10px' }}>Random contest name</h1>
      <h3 style={{ color: 'var(--success-darker)' }}>
        Total prize: $ some prize amount haha scoobydoo
      </h3>
      <h3>Entry fee: Some entry fee so we can get rich ayyy lmao</h3>
      <h3 style={{ marginTop: '10px' }}>
        Starts in {days} days {hours}:{minutes}:{seconds}
      </h3>
      <Link
        to={`/draft/upcoming/${draftData._id}`}
        className="btn"
        style={{
          background: 'var(--primary)',
          color: 'white',
          fontWeight: '600',
          width: '100%',
          marginTop: '20px',
          textDecoration: 'none'
        }}
      >
        Join
      </Link>
    </div>
  );
}
