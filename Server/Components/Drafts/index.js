import { createMongoClient } from '../../DB';
import { getLeaderboard } from '../Leaderboard';

import { v4 as uuid } from 'uuid';

export async function createDraft({ startDate, endDate }) {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const players = await getLeaderboard();

  const draftId = uuid();

  const insert = await collection.insertOne({
    _id: draftId,
    startDate,
    endDate,
    players
  });

  await mongoClient
    .db('valorant-draft-db')
    .createCollection(`draft-participants-${draftId}`);

  await mongoClient.close();

  return insert.insertedCount;
}

export async function getAllDrafts() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const results = await collection.find({}).toArray();

  return results;
}

export async function getUpcomingDrafts() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const results = await collection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .toArray();

  return results;
}

export async function getUpcomingDraft(draftId) {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  return await collection.findOne({ _id: draftId });
}

export async function getClosestUpcomingDraft() {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const results = await collection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .limit(5)
    .sort({ startDate: 1 })
    .toArray();

  if (results.length > 0) {
    return results[0];
  } else {
    return results;
  }
}
