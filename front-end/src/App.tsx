import './App.css';

import { Switch, Route } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';

import Player from 'Pages/Player';
import MatchStats from 'Pages/MatchStats';
// import UpcomingDrafts from 'Pages/UpcomingDrafts';
import UpcomingDraft from 'Pages/UpcomingDraft';
import ClosestUpcomingDraft from 'Pages/ClosestUpcomingDraft';
import Login from 'Pages/Login';
import Signup from 'Pages/Signup';
import Admin from 'Pages/Admin';

import AuthModal from 'Components/AuthModal';
import Navbar from 'Components/Navbar';

import { useTypedSelector } from 'Reducers';
import { getAccount } from 'API/account';
import { useDispatch } from 'react-redux';
import { setAccount } from 'Actions/account';
import { setIsAuthed } from 'Actions/global';
import { useEffect } from 'react';

function App() {
  const isAuthed = useTypedSelector((state) => state.global.isAuthed);

  const dispatch = useDispatch();

  const handleGetAccount = async () => {
    try {
      const account = await getAccount();
      if (account.type === 'ok') {
        dispatch(setAccount(account.data));
        dispatch(setIsAuthed(true));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetAccount();
  }, []);

  return (
    <>
      <ToastProvider placement="bottom-center">
        <div className="app-background" />
        <Navbar />
        <AuthModal />
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
          {isAuthed && <Route exact path="/admin" component={Admin} />}
          {/* <Route exact path="/" component={UpcomingDrafts} /> */}
          <Route path="/" component={ClosestUpcomingDraft} />
        </Switch>
      </ToastProvider>
    </>
  );
}

export default App;
