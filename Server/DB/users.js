import { mongoClient } from './';

export async function getUsersCollection() {
  const usersCollection = mongoClient
    .db('valorant-draft-db')
    .collection('users');

  return { usersCollection, mongoClient };
}
