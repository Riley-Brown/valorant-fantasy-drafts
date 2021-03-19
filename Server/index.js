import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI);

import Leaderboard from './Routes/Leaderboard';
import MatchStats from './Routes/MatchStats';
import PlayerMatches from './Routes/PlayerMatches';
import Drafts from './Routes/Drafts';
import Scores from './Routes/Scores';
import EnterDraft from './Routes/EnterDraft';

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.urlencoded());

// Routes
server.use('/leaderboard', Leaderboard);
server.use('/player-matches', PlayerMatches);
server.use('/match-stats', MatchStats);
server.use('/drafts', Drafts);
server.use('/scores', Scores);
server.use('/drafts/enter-draft', EnterDraft);

const port = process.env.PORT || 9999;

server.listen(port, () => `Server listening on port ${port}`);

export default server;
