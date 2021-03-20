import { Router } from 'express';

import { createMongoClient } from '../../DB';

import { getUpcomingDraft } from '../../Components/Drafts';

const router = Router();

router.post('/', async (req, res) => {
  const { draftId, selectedRoster } = req.body;

  const { id: userId } = res.locals.userTokenObject;

  const mongoClient = createMongoClient();
  await mongoClient.connect();

  try {
    const upcomingDraft = await getUpcomingDraft(draftId);

    if (!upcomingDraft) {
      return res.send({ type: 'error', message: 'Draft does not exist' });
    }

    const validateSelectedRoster = () => {
      if (!Array.isArray(selectedRoster) || selectedRoster.length !== 5) {
        return false;
      }
      const draftPlayers = upcomingDraft.players.data.items;

      for (let i = 0; i < selectedRoster.length; i++) {
        const findPlayer = draftPlayers.find(
          (player) => player.id === selectedRoster[i]
        );

        if (!findPlayer) {
          return false;
        }
      }

      return true;
    };

    const isSelectedRosterValid = validateSelectedRoster();

    if (!isSelectedRosterValid) {
      return res.send({ type: 'error', message: 'invalid draft players' });
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
      enterDate: Math.floor(Date.now() / 1000),
      selectedRoster
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
