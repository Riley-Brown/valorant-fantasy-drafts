import { getDraftsCollection } from '../../DB/drafts';
import { getLeaderboard } from '../../API/TrackerGG';

import { v4 as uuid } from 'uuid';

export async function createDraft({ startDate, endDate, entryFee }) {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const players = await getLeaderboard();

  const draftId = uuid();

  console.log({ draftId });

  const insert = await draftsCollection.insertOne({
    _id: draftId,
    endDate,
    entryFee: entryFee || 0,
    players,
    startDate
  });

  await mongoClient
    .db('valorant-draft-db')
    .createCollection(`draft-participants-${draftId}`);

  await mongoClient.close();

  return insert.insertedCount;
}

export async function getAllDrafts() {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection.find({}).toArray();

  await mongoClient.close();

  return results;
}

export async function getUpcomingDrafts() {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .toArray();

  await mongoClient.close();

  return results;
}

export async function getDraftById(draftId) {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const result = await draftsCollection.findOne({ _id: draftId });

  await mongoClient.close();

  return result;
}

export async function getClosestUpcomingDraft() {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .limit(5)
    .sort({ startDate: 1 })
    .toArray();

  await mongoClient.close();

  if (results.length > 0) {
    return results[0];
  } else {
    return results;
  }
}
