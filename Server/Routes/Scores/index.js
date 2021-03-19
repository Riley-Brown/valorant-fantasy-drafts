import { Router } from 'express';
const router = Router();

import { handleCalcPlayerScores } from '../../Components/Scores';

router.post('/calc-player-scores', async (req, res) => {
  const data = await handleCalcPlayerScores(req.body.playerId);
  res.send(data);
});

export default router;
