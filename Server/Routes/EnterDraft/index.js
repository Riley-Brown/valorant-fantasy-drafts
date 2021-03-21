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
      return res.send({
        type: 'draftNotExist',
        message: 'Draft does not exist'
      });
    }

    const validateSelectedRoster = () => {
      if (!Array.isArray(selectedRoster) || selectedRoster.length !== 5) {
        return false;
      }
      const draftPlayers = upcomingDraft.players;

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
      return res.send({
        type: 'invalidDraftRoster',
        message: 'invalid draft players'
      });
    }

    const draftParticipantsCollection = mongoClient
      .db('valorant-draft-db')
      .collection(`draft-participants-${draftId}`);

    if (!draftParticipantsCollection) {
      return res.send({
        type: 'draftNotExist',
        message: 'Draft does not exist'
      });
    }

    const isUserAlreadyEntered = await draftParticipantsCollection.findOne({
      _id: userId
    });

    if (isUserAlreadyEntered) {
      return res.send({
        type: 'alreadyEntered',
        message: 'Already entered in this draft'
      });
    }

    const usersCollection = mongoClient
      .db('valorant-draft-db')
      .collection('users');

    const user = await usersCollection.findOne({ _id: userId });

    const { entryFee } = upcomingDraft;

    if (entryFee && user.balance < entryFee) {
      return res.send({
        type: 'insufficientBalance',
        message: 'Your current balance is too low to enter this draft'
      });
    }

    const enterDate = Math.floor(Date.now() / 1000);

    const insert = await draftParticipantsCollection.insertOne({
      _id: userId,
      draftId,
      enterDate,
      entryFee,
      selectedRoster,
      userId
    });

    if (insert.insertedCount === 1) {
      // Update user's drafts array and balance in DB
      const updateUser = await usersCollection.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { balance: -entryFee },
          $push: { drafts: { draftId, enterDate, entryFee } }
        },
        // return updated updated document values
        { returnOriginal: false }
      );

      res.send({
        type: 'success',
        message: 'User successfully entered into draft',
        data: {
          balance: updateUser.value.balance
        }
      });
    } else {
      res.send({
        type: 'error',
        message: 'something went wrong entering draft'
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', err: 'something went wrong entering draft' });
  } finally {
    console.log('finally enter draft');
    await mongoClient.close();
  }
});

export default router;
