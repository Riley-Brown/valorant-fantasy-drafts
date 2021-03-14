import { Router } from 'express';
const router = Router();

import { getMatchStats } from '../../Components/MatchStats';

router.get('/:matchId', async (req, res) => {
  const data = await getMatchStats(req.params.matchId);
  res.send(data);
});

export default router;
