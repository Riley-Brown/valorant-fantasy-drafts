import './App.css';

import { Switch, Route } from 'react-router-dom';

import Player from 'Pages/Player';
import MatchStats from 'Pages/MatchStats';
import UpcomingDrafts from 'Pages/UpcomingDrafts';
import UpcomingDraft from 'Pages/UpcomingDraft';
import ClosestUpcomingDraft from 'Pages/ClosestUpcomingDraft';
import Login from 'Pages/Login';
import Signup from 'Pages/Signup';

function App() {
  return (
    <>
      <div className="app-background" />
      <Switch>
        <Route exact path="/player/:playerId" component={Player} />
        <Route
          exact
          path="/player/:playerId/match/:matchId"
          component={MatchStats}
        />
        <Route
          exact
          path="/draft/upcoming/:draftId"
          component={UpcomingDraft}
        />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        {/* <Route exact path="/" component={UpcomingDrafts} /> */}
        <Route path="/" component={ClosestUpcomingDraft} />
      </Switch>
    </>
  );
}

export default App;
