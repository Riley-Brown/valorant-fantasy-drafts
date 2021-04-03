import { Router } from 'express';
const router = Router();

import { getLeaderboard } from '../../API/TrackerGG';

router.get('/', async (req, res) => {
  const data = await getLeaderboard();
  res.send(data);
});

export default router;
