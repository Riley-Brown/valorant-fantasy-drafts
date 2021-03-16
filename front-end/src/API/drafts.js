export async function getUpcomingDrafts() {
  const res = await fetch(`http://localhost:9999/drafts/upcoming`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}

export async function getUpcomingDraft(draftId) {
  const res = await fetch(
    `http://localhost:9999/drafts/upcoming/id/${draftId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return res.json();
}

export async function getClosestUpcomingDraft() {
  const res = await fetch(
    `http://localhost:9999/drafts/upcoming/closest-draft`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return res.json();
}
