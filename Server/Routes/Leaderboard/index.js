import { Router } from 'express';
const router = Router();

import { getLeaderboard } from '../../Components/Leaderboard';

router.get('/', async (req, res) => {
  const data = await getLeaderboard();
  res.send(data);
});

export default router;
