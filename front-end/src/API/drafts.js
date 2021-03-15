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
  const res = await fetch(`http://localhost:9999/drafts/upcoming/${draftId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}
