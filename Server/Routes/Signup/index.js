import { Router } from 'express';
const router = Router();

import { getUsersCollection } from '../../DB/users';
import { createToken, hashPassword } from '../../Auth';

import { isString } from '../../Helpers';

import UserModel from '../../Models/User';

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !isString(email) || !isString(password)) {
    return res.send({ type: 'error', message: 'Invalid email or password' });
  }

  const { mongoClient, usersCollection } = await getUsersCollection();

  try {
    const isUserExist = await usersCollection.findOne({
      email: email.toLowerCase()
    });

    if (isUserExist) {
      return res.send({
        type: 'error',
        message: 'Email is already registered, email must be unique'
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = UserModel({ email, hashedPassword });

    const insert = await usersCollection.insertOne(newUser);

    if (insert.insertedCount === 1) {
      const token = createToken(newUser._id);

      res.cookie('userSession', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90000000),
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: 'none'
      });

      res.send({ type: 'ok', message: 'User successfully signed up' });
    } else {
      res.send({
        type: 'error',
        message: 'Something went wrong during signup'
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'Error signing up' });
  } finally {
    await mongoClient.close();
  }
});

export default router;
