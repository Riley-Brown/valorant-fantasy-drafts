import { Router } from 'express';
const router = Router();

import { getUsersCollection } from '../../DB/users';
import { createToken, hashPassword } from '../../Auth';

import UserModel from '../../Models/User';

import { validationResult } from 'express-validator';

router.post('/', async (req, res) => {
  const result = validationResult(req).formatWith(({ msg }) => ({
    msg
  }));

  if (!result.isEmpty()) {
    return res.status(400).json({
      type: 'validationErrors',
      errors: result.mapped()
    });
  }

  const { displayName, email, password } = req.body;

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

    const newUser = UserModel({ displayName, email, hashedPassword });

    const insert = await usersCollection.insertOne(newUser);

    if (insert.insertedCount === 1) {
      const token = createToken(newUser._id);

      res.cookie('userSession', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90000000),
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
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
