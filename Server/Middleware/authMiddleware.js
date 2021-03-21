import jwt from 'jsonwebtoken';

import { getUsersCollection } from '../DB/users';

const handleVerifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        reject('session expired');
      } else {
        resolve(decodedToken);
      }
    });
  });
};

const handleSendAuthError = (res) =>
  res.send({ type: 'authError', message: 'Not authorized' });

export const requireUserAuth = async (req, res, next) => {
  const token = req.cookies.userSession;

  try {
    if (!token) return handleSendAuthError();
    res.locals.userTokenObject = await handleVerifyToken(token);
    next();
  } catch (err) {
    console.log(err);
    return handleSendAuthError(res);
  }
};

export const requireAdminAuth = async (req, res, next) => {
  const token = req.cookies.userSession;

  const { usersCollection, mongoClient } = await getUsersCollection();

  try {
    if (!token) return handleSendAuthError();

    const decodedToken = await handleVerifyToken(token);

    const user = await usersCollection.findOne({ _id: decodedToken.id });

    if (user && user.isAdmin) {
      res.locals.userTokenObject = decodedToken;
      next();
    } else {
      return handleSendAuthError(res);
    }
  } catch (err) {
    console.log(err);
    return handleSendAuthError(res);
  } finally {
    mongoClient.close();
  }
};
