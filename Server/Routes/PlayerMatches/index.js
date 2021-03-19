import { Router } from 'express';
const router = Router();

import { getPlayerMatches } from '../../Components/PlayerMatches';

router.get('/', async (req, res) => {
  try {
    const { data } = await getPlayerMatches(req.body.playerId);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'Player does not exist' });
  }
});

export default router;
