import { Router } from 'express';
import Queue from 'bull';

import differenceInMinutes from 'date-fns/differenceInMinutes';

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
import { fromUnixTime } from 'date-fns';

const scoreQueue = new Queue('calc scores');

scoreQueue.process('calcScore', async (job, done) => {
  console.log(job);

  try {
    const scores = await calcDraftScores(job.id);
    job.update(null);
    done(null, scores);
  } catch (err) {
    job.remove();
    console.log(err);
  }
});

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

router.get('/scores/:draftId', async (req, res) => {
  const { draftId } = req.params;

  // await scoreQueue.clean(100);
  // return;

  // console.log(scoreQueue);
  // // res.json(scoreQueue);
  // return;

  console.log(draftId);
  // await scoreQueue.removeJobs(draftId);

  const job = await scoreQueue.getJob(draftId);
  console.log(job);

  if (!job) {
    console.log('no job, added to queue');
    await scoreQueue.add('calcScore', null, { jobId: draftId });
    return res.json({ status: 'active', message: 'Started score calc queue' });
  }

  const { finishedOn, processedOn } = job;

  const jobStatus = await job.getState();

  if (jobStatus === 'completed') {
    const lastUpdated = Math.floor((finishedOn || processedOn) / 1000);

    const minutesSinceCompleted = differenceInMinutes(
      new Date(),
      fromUnixTime(lastUpdated)
    );

    console.log(minutesSinceCompleted);

    // Queue up new job if prev older than 5 minutes
    if (minutesSinceCompleted > 5) {
      const prevData = job.returnvalue;
      await job.remove();
      await scoreQueue.add('calcScore', prevData, {
        jobId: draftId
      });

      return res.json({
        status: 'active',
        lastUpdated,
        data: prevData,
        message: 'Updating scores inprogress'
      });
    }
  }

  console.log('returning existing cached scores');
  res.json({
    status: jobStatus,
    lastUpdated: Math.floor((finishedOn || processedOn) / 1000),
    data: job.returnvalue || job.data
  });
});

router.get('/scores/:draftId/events', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  scoreQueue.on('completed', (job) => {
    res.write(
      `data: ${JSON.stringify({
        ...job.returnvalue,
        lastUpdated: Math.floor(job.finishedOn / 1000)
      })}\n\n`
    );
  });

  res.on('close', () => {
    scoreQueue.removeAllListeners();
    res.end();
  });
});

export default router;
