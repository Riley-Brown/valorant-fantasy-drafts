import { Router } from 'express';
const router = Router();

import { getUsersCollection } from '../../DB/users';

router.get('/', async (req, res) => {
  const { usersCollection, mongoClient } = await getUsersCollection();

  const { id: userId } = res.locals.userTokenObject;

  try {
    const userAccount = await usersCollection.findOne({ _id: userId });

    res.send({
      type: 'ok',
      data: {
        balance: userAccount.balance,
        displayName: userAccount.displayName,
        drafts: (userAccount.drafts || []).reverse(),
        email: userAccount.email,
        isAdmin: userAccount.isAdmin,
        signupDate: userAccount.signupDate,
        stripeCustomerId: userAccount.stripeCustomerId
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'error getting account' });
  } finally {
    await mongoClient.close();
  }
});

router.put('/update', async (req, res) => {
  const { usersCollection, mongoClient } = await getUsersCollection();

  const { id: userId } = res.locals.userTokenObject;

  try {
    const updateUser = await usersCollection.findOneAndUpdate(
      { _id: userId },
      { $set: { displayName: req.body.displayName } },
      { returnOriginal: false }
    );

    console.log(updateUser);

    res.send({
      type: 'ok',
      data: {
        balance: userAccount.balance,
        displayName: userAccount.displayName,
        drafts: (userAccount.drafts || []).reverse(),
        email: userAccount.email,
        isAdmin: userAccount.isAdmin,
        signupDate: userAccount.signupDate,
        stripeCustomerId: userAccount.stripeCustomerId
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
