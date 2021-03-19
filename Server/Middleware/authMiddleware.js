import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.userSession;
  console.log({ token });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log({ decodedToken });
        next();
      }
    });
  } else {
    res.send({ type: 'error', message: 'Not authorized' });
  }
};
