import { Router } from 'express';
const router = Router();

router.post('/', async (req, res) => {
  try {
    res.cookie('userSession', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
    });
    res.send({ type: 'ok', message: 'successfully signed out' });
  } catch (err) {
    console.log(err);
  }
});

export default router;
