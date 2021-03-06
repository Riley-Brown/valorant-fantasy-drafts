import { API_ROOT } from './root';

export async function getUpcomingDrafts() {
    const res = await fetch(`${API_ROOT}/drafts/upcoming`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();
}

export async function getUpcomingDraft(draftId) {
    const res = await fetch(`${API_ROOT}/drafts/upcoming/id/${draftId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();
}

export async function getClosestUpcomingDraft() {
    const res = await fetch(`${API_ROOT}/drafts/upcoming/closest-draft`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();
}

export async function enterDraft({ draftId, selectedRoster }) {
    const res = await fetch(`${API_ROOT}/drafts/enter-draft`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ draftId, selectedRoster }),
    });

    return res.json();
}

export async function createDraft({ startDate, endDate, entryFee }) {
    const res = await fetch(`${API_ROOT}/drafts/create-draft`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate, entryFee }),
    });

    return res.json();
}

export async function getLiveDraftResults(draftId) {
    const res = await fetch(`${API_ROOT}/drafts/scores/${draftId}`, {
        method: 'GET',
    });

    return res.json();
}

export function liveDraftResultsEventsUrl(draftId) {
    return `${API_ROOT}/drafts/scores/${draftId}/events`;
}

export async function getLiveDraftStreams(draftId) {
    const res = await fetch(`${API_ROOT}/drafts/live/${draftId}/streams`, {
        method: 'GET',
    });

    return res.json();
}
