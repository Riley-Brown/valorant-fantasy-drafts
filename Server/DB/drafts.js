import { createMongoClient } from './';

export async function getDraftsCollection() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const draftsCollection = mongoClient
    .db('valorant-draft-db')
    .collection('drafts');

  return { draftsCollection, mongoClient };
}
