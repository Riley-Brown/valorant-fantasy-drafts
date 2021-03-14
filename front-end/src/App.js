import logo from './logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom';

import Player from 'Pages/Player';
import Leaderboard from 'Pages/Leaderboard';
import MatchStats from 'Pages/MatchStats';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/player/:playerId" component={Player} />
        <Route exact path="/" component={Leaderboard} />
        <Route
          exact
          path="/player/:playerId/match/:matchId"
          component={MatchStats}
        />
      </Switch>
    </>
  );
}

export default App;
