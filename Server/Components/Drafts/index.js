import { createMongoClient } from '../../DB';
import { getLeaderboard } from '../Leaderboard';

import Mongodb from 'mongodb';

export async function createDraft({ startDate, endDate }) {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const players = await getLeaderboard();

  const insert = await collection.insertOne({ startDate, endDate, players });

  await mongoClient.close();
  console.log(insert.insertedCount);
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

  const results = await collection.findOne({ _id: Mongodb.ObjectId(draftId) });

  return results;
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
