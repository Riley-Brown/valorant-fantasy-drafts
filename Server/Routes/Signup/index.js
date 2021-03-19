import { Router } from 'express';
const router = Router();

import { createMongoClient } from '../../DB';

import { createToken, hashPassword } from '../../Auth';

import { isString } from '../../Helpers';

import { v4 as uuid } from 'uuid';

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  if (!email || !password || !isString(email) || !isString(password)) {
    return res.send({ type: 'error', message: 'Invalid email or password' });
  }

  const mongoClient = createMongoClient();
  await mongoClient.connect();

  try {
    const usersCollection = mongoClient
      .db('valorant-draft-db')
      .collection('users');

    const isUserExist = await usersCollection.findOne({ email });

    if (isUserExist) {
      return res.send({ type: 'error', message: 'User is already registered' });
    } else {
      const hashedPassword = await hashPassword(password);
      const userId = uuid();

      const newUser = {
        _id: userId,
        balance: 0,
        email,
        password: hashedPassword,
        signupDate: Math.floor(Date.now() / 1000)
      };

      const insert = await usersCollection.insertOne(newUser);

      console.log(insert);

      if (insert.insertedCount === 1) {
        const token = createToken(userId);

        res.cookie('userSession', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 90000000)
        });
        res.send({ type: 'ok', message: 'User successfully signed up' });
      } else {
        res.send({
          type: 'error',
          message: 'Something went wrong during signup'
        });
      }
    }

    // const token = createToken(user.id);
    // console.log(token);
    // res.send({ type: 'ok', message: 'User successfully signed up' });
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'Error signing up' });
  } finally {
    await mongoClient.close();
  }
});

export default router;
