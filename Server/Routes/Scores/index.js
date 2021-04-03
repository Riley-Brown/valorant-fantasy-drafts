import { Router } from 'express';
const router = Router();

import { FormatPlayerMatches } from '../../Models/PlayerMatches';
import { getPlayerMatches } from '../../API/TrackerGG';

router.post('/calc-player-scores', async (req, res) => {
  const { matches } = await getPlayerMatches(req.body.playerId);

  const formattedPlayerMatches = FormatPlayerMatches(matches);

  res.send(formattedPlayerMatches);
});

export default router;
