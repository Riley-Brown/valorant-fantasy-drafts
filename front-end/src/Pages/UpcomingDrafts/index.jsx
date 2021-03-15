import React, { useEffect, useState } from 'react';

import { getUpcomingDrafts } from 'API/drafts';

import Draft from './Draft';

export default function Drafts() {
  const [upcomingDrafts, setUpcomingDrafts] = useState();

  useEffect(() => {
    getUpcomingDrafts().then((data) => setUpcomingDrafts(data));
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h1 style={{ margin: '20px 0', color: '#fff' }}>Upcoming drafts</h1>
      {upcomingDrafts &&
        upcomingDrafts.map((draft) => <Draft draftData={draft} />)}
    </div>
  );
}
