import { Router } from 'express';
const router = Router();

import {
  createDraft,
  getAllDrafts,
  getUpcomingDrafts,
  getUpcomingDraft,
  getClosestUpcomingDraft
} from '../../Components/Drafts';

router.post('/create-draft', async (req, res) => {
  const { startDate, endDate } = req.body;
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
      startDate: Math.floor(startDate),
      endDate: Math.floor(endDate)
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
    const draft = await getUpcomingDraft(req.params.draftId);
    console.log(draft);
    res.send(draft);
  } catch (err) {
    console.log(err);
  }
});

router.get('/upcoming/closest-draft', async (req, res) => {
  try {
    const draft = await getClosestUpcomingDraft();
    console.log(draft);
    res.send(draft);
  } catch (err) {
    console.log(err);
  }
});

export default router;
