import { mongoClient } from './';

export async function getDraftsCollection() {
  const draftsCollection = mongoClient
    .db('valorant-draft-db')
    .collection('drafts');

  return { draftsCollection, mongoClient };
}

export async function getDraftParticipantsCollection({ draftId }) {
  const draftParticipantsCollection = mongoClient
    .db('valorant-draft-db')
    .collection(`draft-participants-${draftId}`);

  return { draftParticipantsCollection, mongoClient };
}
