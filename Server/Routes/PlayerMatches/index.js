import { Router } from 'express';
const router = Router();

import { getPlayerMatches } from '../../Components/PlayerMatches';

router.get('/:playerId', async (req, res) => {
  const data = await getPlayerMatches(req.params.playerId);
  res.send(data);
});

export default router;
