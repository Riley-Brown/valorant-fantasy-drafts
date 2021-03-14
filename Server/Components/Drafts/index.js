import mongoClient from '../../DB';

export async function createDraft({ startDate, endDate }) {
  if (!mongoClient.isConnected()) {
    await mongoClient.connect();
  }

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  console.log(collection);

  const insert = await collection.insertOne({ startDate, endDate });

  await mongoClient.close();
  console.log(insert.insertedCount);
  return insert.insertedCount;
}

export async function getAllDrafts() {
  if (!mongoClient.isConnected()) {
    await mongoClient.connect();
  }

  const collection = mongoClient.db('valorant-draft-db').collection('drafts');

  const results = await collection.find({}).toArray();

  return results;
}

export async function getDraft(draftId) {
  try {
  } catch (err) {}
}
