import './App.css';

import { Switch, Route } from 'react-router-dom';

import Player from 'Pages/Player';
import MatchStats from 'Pages/MatchStats';
import UpcomingDrafts from 'Pages/UpcomingDrafts';
import UpcomingDraft from 'Pages/UpcomingDraft';

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
        <Route exact path="/" component={UpcomingDrafts} />
        <Route
          exact
          path="/draft/upcoming/:draftId"
          component={UpcomingDraft}
        />
      </Switch>
    </>
  );
}

export default App;
