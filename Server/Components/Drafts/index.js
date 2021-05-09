import {
  getDraftsCollection,
  getDraftParticipantsCollection
} from '../../DB/drafts';
import { getLeaderboard, getPlayerMatches } from '../../API/TrackerGG';

import { FormatPlayerMatches } from '../../Models/PlayerMatches';

import { v4 as uuid } from 'uuid';

export async function createDraft({ startDate, endDate, entryFee }) {
  const { mongoClient, draftsCollection } = await getDraftsCollection();

  const players = await getLeaderboard();

  const draftId = uuid();

  console.log({ draftId });

  const insert = await draftsCollection.insertOne({
    _id: draftId,
    endDate,
    entryFee: entryFee || 0,
    players,
    startDate
  });

  await mongoClient
    .db('valorant-draft-db')
    .createCollection(`draft-participants-${draftId}`);

  return insert.insertedCount;
}

export async function getAllDrafts() {
  const { draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection.find({}).toArray();

  return results;
}

export async function getUpcomingDrafts() {
  const { draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .toArray();

  return results;
}

export async function getDraftById(draftId) {
  const { draftsCollection } = await getDraftsCollection();

  const result = await draftsCollection.findOne({ _id: draftId });

  return result;
}

export async function getClosestUpcomingDraft() {
  const { draftsCollection } = await getDraftsCollection();

  const results = await draftsCollection
    .find({
      startDate: {
        $gt: Date.now() / 1000
      }
    })
    .limit(5)
    .sort({ startDate: 1 })
    .toArray();

  if (results.length > 0) {
    return results[0];
  } else {
    return results;
  }
}

export async function calcDraftScores(draftId) {
  console.time('calc scores');

  const draft = await getDraftById(draftId);

  if (!draft) {
    throw Error('Draft does not exist');
  }

  const { draftParticipantsCollection } = await getDraftParticipantsCollection({
    draftId
  });

  const participants = await draftParticipantsCollection.find().toArray();

  if (!draftParticipantsCollection) {
    throw Error('Draft does not exist');
  }

  const cachedPlayerMatches = {};
  const participantsScores = [];
  const players = {};

  for (let i = 0; i < participants.length; i++) {
    const participantScores = {};
    const { selectedRoster, userId } = participants[i];

    for (let j = 0; j < selectedRoster.length; j++) {
      const player = selectedRoster[j];
      if (!players[player.id]) {
        players[player.id] = player;
      }

      if (cachedPlayerMatches[player.id]) {
        participantScores[player.id] = {
          totalScore: cachedPlayerMatches[player.id].totalScore,
          selectedRoster
        };
      } else {
        // todo: handle potentially loading more paginated matches
        console.log('getting matches...');
        try {
          const { matches } = await getPlayerMatches(player.id);
          const formattedPlayerMatches = FormatPlayerMatches(matches);

          const filteredMatches = formattedPlayerMatches.filter(
            (match) =>
              match.timestamp >= draft.startDate &&
              match.timestamp <= draft.endDate
          );

          const calcMatchesScores = filteredMatches.reduce(
            (prev, match) => prev + match.score,
            0
          );

          participantScores[player.id] = {
            totalScore: calcMatchesScores
          };

          cachedPlayerMatches[player.id] = {
            totalScore: calcMatchesScores,
            matches: filteredMatches
          };
        } catch (err) {
          console.log(player);
          console.log(err);
        }
      }
    }

    const totalScore = Object.values(participantScores).reduce(
      (prev, player) => prev + player.totalScore,
      0
    );

    participantsScores.push({
      participantId: userId,
      totalScore,
      selectedRoster
    });
  }

  console.timeEnd('calc scores');

  return {
    participantsScores: participantsScores.sort(
      (a, b) => b.totalScore - a.totalScore
    ),
    playerMatches: cachedPlayerMatches,
    players
  };
}
