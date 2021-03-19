import { Router } from 'express';

import { createMongoClient } from '../../DB';

import { getUpcomingDraft } from '../../Components/Drafts';

const router = Router();

router.post('/', async (req, res) => {
  // todo: eventually some sort of validation on userId here once auth system is in place

  const { userId, draftId } = req.body;

  const mongoClient = createMongoClient();
  await mongoClient.connect();

  try {
    const upcomingDraft = await getUpcomingDraft(draftId);

    if (!upcomingDraft) {
      return res.send({ type: 'error', message: 'Draft does not exist' });
    }

    const draftParticipantsCollection = mongoClient
      .db('valorant-draft-db')
      .collection(`draft-participants-${draftId}`);

    if (!draftParticipantsCollection) {
      return res.send({ type: 'error', message: 'Draft does not exist' });
    }

    const isUserAlreadyEntered = await draftParticipantsCollection.findOne({
      _id: userId
    });

    if (isUserAlreadyEntered) {
      return res.send({
        type: 'error',
        message: 'User is already entered in draft'
      });
    }

    const insert = await draftParticipantsCollection.insertOne({
      _id: userId,
      draftId,
      enterDate: Math.floor(Date.now() / 1000)
    });

    if (insert.insertedCount === 1) {
      res.send({
        type: 'success',
        message: 'User successfully entered into draft'
      });
    } else {
      res.send({
        type: 'error',
        message: 'something went wrong entering draft'
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ err: 'something went wrong entering draft' });
  } finally {
    console.log('finally enter draft');
    await mongoClient.close();
  }
});

export default router;
