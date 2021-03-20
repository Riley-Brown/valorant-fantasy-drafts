import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.userSession;
  console.log({ token });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.send({
          type: 'sessionExpired',
          message: 'Login session expired, please login again'
        });
      } else {
        console.log({ decodedToken });
        res.locals.userTokenObject = decodedToken;
        next();
      }
    });
  } else {
    return res.send({ type: 'authError', message: 'Not authorized' });
  }
};
