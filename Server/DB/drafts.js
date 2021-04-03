import { createMongoClient } from './';

export async function getDraftsCollection() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const draftsCollection = mongoClient
    .db('valorant-draft-db')
    .collection('drafts');

  return { draftsCollection, mongoClient };
}

export async function getDraftParticipantsCollection({
  draftId,
  autoConnect = true
}) {
  const mongoClient = createMongoClient();

  if (autoConnect) {
    await mongoClient.connect();
  }

  const draftParticipantsCollection = mongoClient
    .db('valorant-draft-db')
    .collection(`draft-participants-${draftId}`);

  return { draftParticipantsCollection, mongoClient };
}
