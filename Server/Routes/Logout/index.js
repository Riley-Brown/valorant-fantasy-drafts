import { Router } from 'express';
const router = Router();

router.post('/', async (req, res) => {
  try {
    res.cookie('userSession', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: 'none',
      domain: 'https://valorant-draft.riley.gg'
    });
    res.send({ type: 'ok', message: 'successfully signed out' });
  } catch (err) {
    console.log(err);
  }
});

export default router;
