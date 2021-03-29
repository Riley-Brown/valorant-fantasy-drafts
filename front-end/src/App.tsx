import { useEffect } from 'react';
import './App.css';

import { Switch, Route } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';

import Player from 'Pages/Player';
import MatchStats from 'Pages/MatchStats';
import UpcomingDraft from 'Pages/UpcomingDraft';
import ClosestUpcomingDraft from 'Pages/ClosestUpcomingDraft';
import Login from 'Pages/Login';
import Signup from 'Pages/Signup';
import Admin from 'Pages/Admin';
import Account from 'Pages/Account';

import AuthModal from 'Components/AuthModal';
import Navbar from 'Components/Navbar';
import PaymentModal from 'Components/PaymentModal';
import AddBalanceModal from 'Components/AddBalanceModal';

import { useTypedSelector } from 'Reducers';

import { getAccount } from 'API/account';
import { getPaymentDetails } from 'API/payment';

import { useDispatch } from 'react-redux';
import { setAccount } from 'Actions/account';
import { setIsAuthed } from 'Actions/global';

function App() {
  const isAuthed = useTypedSelector((state) => state.global.isAuthed);

  const dispatch = useDispatch();

  const handleGetAccount = async () => {
    try {
      const account = await getAccount();
      if (account.type === 'ok') {
        if (account.data.stripeCustomerId) {
          const payment = await getPaymentDetails();
          console.log(payment);

          dispatch(
            setAccount({
              ...account.data,
              payment: {
                cardBrand: payment.sources.data[0].brand,
                cardLast4: payment.sources.data[0].last4
              }
            })
          );
        } else {
          dispatch(setAccount(account.data));
        }

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
      <ToastProvider placement="top-center">
        <div className="app-background" />
        <Navbar />
        <AuthModal />
        {isAuthed && (
          <>
            <PaymentModal />
            <AddBalanceModal />
          </>
        )}
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
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/account" component={Account} />
          <Route path="/" component={ClosestUpcomingDraft} />
        </Switch>
      </ToastProvider>
    </>
  );
}

export default App;
