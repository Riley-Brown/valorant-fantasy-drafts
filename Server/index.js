import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI);

import Leaderboard from './Routes/Leaderboard';
import MatchStats from './Routes/MatchStats';
import PlayerMatches from './Routes/PlayerMatches';
import Drafts from './Routes/Drafts';

const server = express();

server.use(express.json());
server.use(cors());

// Routes
server.use('/leaderboard', Leaderboard);
server.use('/player-matches', PlayerMatches);
server.use('/match-stats', MatchStats);
server.use('/drafts', Drafts);

const port = process.env.PORT || 9999;

server.listen(port, () => `Server listening on port ${port}`);

export default server;
