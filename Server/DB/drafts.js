import { mongoClient } from './';

export async function getDraftsCollection() {
  const draftsCollection = mongoClient
    .db('valorant-draft-db')
    .collection('drafts');

  return { draftsCollection, mongoClient };
}

export async function getDraftParticipantsCollection(draftId) {
  const draftParticipantsCollection = mongoClient
    .db('valorant-draft-db')
    .collection(`draft-participants-${draftId}`);

  return {
    draftParticipantsCollection,
    mongoClient
  };
}

export async function getDraftParticipants(draftId) {
  const { draftParticipantsCollection } = await getDraftParticipantsCollection(
    draftId
  );

  if (!draftParticipantsCollection) {
    return null;
  }

  const participants = await draftParticipantsCollection.find({}).toArray();

  return participants;
}
