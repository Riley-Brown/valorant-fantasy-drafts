export default function SelectedPlayer({ playerData }) {
  return (
    <div className="selected-player">
      <div className="avatar">
        {playerData ? (
          <img
            src={playerData.avatarUrl}
            alt={`${playerData.userHandleOnly} avatar`}
          />
        ) : (
          <div className="empty-background"></div>
        )}
      </div>
      {playerData && (
        <div className="player-info">
          <h1>{playerData.userHandleOnly}</h1>
        </div>
      )}
    </div>
  );
}
