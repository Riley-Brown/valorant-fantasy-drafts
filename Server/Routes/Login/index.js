import { Router } from 'express';
const router = Router();

import { validatePasswordHash, createToken } from '../../Auth';

import { createMongoClient } from '../../DB';

import { isString } from '../../Helpers';

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const mongoClient = createMongoClient();
  await mongoClient.connect();

  try {
    const usersCollection = mongoClient
      .db('valorant-draft-db')
      .collection('users');

    if (!email || !password || !isString(email) || !isString(password)) {
      return res.send({ type: 'error', message: 'Invalid email or password' });
    }

    const findUser = await usersCollection.findOne({ email });

    if (!findUser) {
      return res.send({ type: 'error', message: 'User does not exist' });
    }

    const isPasswordMatch = await validatePasswordHash({
      password,
      hashedPassword: findUser.password
    });

    console.log({ isPasswordMatch });

    if (isPasswordMatch) {
      const token = createToken(findUser._id);
      console.log(token);

      res.cookie('userSession', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90000000)
      });

      res.send({ type: 'ok', message: 'Login success' });
    } else {
      res.send({ type: 'error', message: 'Invalid email or password' });
    }
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
});

export default router;
