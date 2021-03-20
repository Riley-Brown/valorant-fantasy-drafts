import { Router } from 'express';
const router = Router();

router.post('/', async (req, res) => {
  try {
    res.cookie('userSession', '', {
      httpOnly: true
    });
    res.send({ type: 'ok', message: 'successfully signed out' });
  } catch (err) {
    console.log(err);
  }
});

export default router;
