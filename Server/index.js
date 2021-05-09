import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import Leaderboard from './Routes/Leaderboard';
import MatchStats from './Routes/MatchStats';
import PlayerMatches from './Routes/PlayerMatches';
import Drafts from './Routes/Drafts';
import Scores from './Routes/Scores';
import EnterDraft from './Routes/EnterDraft';
import Login from './Routes/Login';
import Signup from './Routes/Signup';
import Account from './Routes/Account';
import Logout from './Routes/Logout';
import StripePayments from './Routes/StripePayments';

import { requireUserAuth } from './Middleware/authMiddleware';
import SignupValidator from './Middleware/Validators/Signup';

const server = express();

const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'https://romantic-varahamihira-837530.netlify.app',
    'https://valorant-draft.riley.gg'
  ]
};

// Middleware
server.use(express.json());
server.use(cors(corsOptions));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan('dev'));

// Routes
server.use('/leaderboard', Leaderboard);
server.use('/player-matches', PlayerMatches);
server.use('/match-stats', MatchStats);
server.use('/drafts', Drafts);
server.use('/scores', Scores);
server.use('/drafts/enter-draft', requireUserAuth, EnterDraft);
server.use('/auth/login', Login);
server.use('/auth/signup', SignupValidator, Signup);
server.use('/account', requireUserAuth, Account);
server.use('/auth/logout', requireUserAuth, Logout);
server.use('/payments/stripe', requireUserAuth, StripePayments);

const port = process.env.PORT || 9999;

server.listen(port, () => `Server listening on port ${port}`);

export default server;
