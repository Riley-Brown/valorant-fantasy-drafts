import { createMongoClient } from './';

export async function getUsersCollection() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const usersCollection = mongoClient
    .db('valorant-draft-db')
    .collection('users');

  return { usersCollection, mongoClient };
}
