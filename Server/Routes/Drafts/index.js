import { Router } from 'express';
const router = Router();

import { requireAdminAuth } from '../../Middleware/authMiddleware';

import {
  createDraft,
  getAllDrafts,
  getUpcomingDrafts,
  getDraftById,
  getClosestUpcomingDraft,
  calcDraftScores
} from '../../Components/Drafts';

router.post('/create-draft', requireAdminAuth, async (req, res) => {
  const { startDate, endDate, entryFee } = req.body;
  const currentDateUnix = Date.now() / 1000;

  if (!startDate || !endDate) {
    return res.send({
      type: 'error',
      message: 'Missing required start or end date values'
    });
  }

  if (endDate < startDate) {
    return res.send({
      type: 'error',
      message: 'Draft end date cannot be less than start date'
    });
  }

  if (endDate < currentDateUnix) {
    return res.send({
      type: 'error',
      message: 'Draft end date cannot be in the past'
    });
  }

  if (startDate < currentDateUnix) {
    return res.send({
      type: 'error',
      message: 'Draft start date cannot be in the past'
    });
  }

  try {
    await createDraft({
      entryFee,
      endDate: Math.floor(endDate),
      startDate: Math.floor(startDate)
    });
    res.send({ type: 'ok', message: 'Draft created' });
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'something went wrong creating draft' });
  }
});

router.get('/get-drafts', async (req, res) => {
  try {
    const drafts = await getAllDrafts();
    res.send({ type: 'ok', message: 'Draft created', data: drafts });
  } catch (err) {
    console.log(err);
    res.send({ type: 'error', message: 'something went wrong' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const drafts = await getUpcomingDrafts();
    res.send(drafts);
  } catch (err) {
    console.log(err);
  }
});

router.get('/upcoming/id/:draftId', async (req, res) => {
  try {
    const draft = await getDraftById(req.params.draftId);
    res.send(draft);
  } catch (err) {
    console.log(err);
  }
});

router.get('/upcoming/closest-draft', async (req, res) => {
  try {
    const draft = await getClosestUpcomingDraft();
    res.send(draft);
  } catch (err) {
    console.log(err);
  }
});

router.post('/calc-draft-scores', async (req, res) => {
  try {
    const scores = await calcDraftScores(req.body.draftId);
    console.log(scores);

    res.send(scores);
  } catch (err) {
    console.log(err);
    res.send({
      type: 'calcScoresError',
      message: err.message
    });
  }
});

export default router;
