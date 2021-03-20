import { Router } from 'express';
const router = Router();

import { createMongoClient } from '../../DB';

router.get('/', async (req, res) => {
  const mongoClient = createMongoClient();
  await mongoClient.connect();

  const { id: userId } = res.locals.userTokenObject;
  console.log({ userId });

  try {
    const usersCollection = mongoClient
      .db('valorant-draft-db')
      .collection('users');

    const userAccount = await usersCollection.findOne({ _id: userId });

    console.log(userAccount);

    res.send({
      type: 'ok',
      data: {
        email: userAccount.email,
        balance: userAccount.balance
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'error getting account' });
  } finally {
    await mongoClient.close();
  }
});

export default router;
