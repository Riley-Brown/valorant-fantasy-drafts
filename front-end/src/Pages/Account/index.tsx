import './Account.scss';

import { useTypedSelector } from 'Reducers';

import { formattedInt } from 'Helpers';

import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';

import SelectedRoster from 'Pages/ClosestUpcomingDraft/SelectedRoster';
import { useDispatch } from 'react-redux';
import { setShowBalanceModal, setShowPaymentModal } from 'Actions';

export default function Account() {
  const account = useTypedSelector((state) => state.account);
  const payment = useTypedSelector((state) => state.account.payment);

  const dispatch = useDispatch();

  return (
    <div id="account">
      <div className="account-info account-section">
        <h1 className="section-title">Account info</h1>
        <ul>
          <div className="wrapper">
            <li>Email</li>
            <li>{account.email}</li>
          </div>
          <div className="wrapper">
            <li>Balance</li>
            <li>${formattedInt(account.balance)}</li>
          </div>
          <div className="balance-buttons">
            <button className="btn withdraw">Withdraw balance</button>
            <button
              className="btn add"
              onClick={() => dispatch(setShowBalanceModal(true))}
            >
              Add balance
            </button>
          </div>
          <div className="wrapper">
            <li>Signup date</li>
            <li>{format(fromUnixTime(account.signupDate), 'MM/dd/yy')}</li>
          </div>
        </ul>
      </div>
      <div className="account-info account-section">
        <h1 className="section-title">Payment info</h1>
        <ul>
          <div className="wrapper">
            <li>Card</li>
            <li>
              {account.payment
                ? `**** **** **** ${account.payment.cardLast4}`
                : 'No card added yet'}
            </li>
          </div>
          {account.payment && (
            <div className="wrapper">
              <li>Card brand</li>
              <li>{account.payment.cardBrand}</li>
            </div>
          )}
        </ul>
        <div className="payment-buttons">
          <button disabled={!payment} className="btn remove-payment">
            Remove payment
          </button>
          <button
            onClick={() => dispatch(setShowPaymentModal(true))}
            className="btn add-update-payment"
          >
            {payment ? 'Update payment' : 'Add payment'}
          </button>
        </div>
      </div>
      <div className="account-drafts account-section">
        <h1 className="section-title">Draft history</h1>
        {account.drafts.length > 0 ? (
          account.drafts.map((draft) => (
            <div className="draft">
              <ul>
                <div className="wrapper">
                  <li>Enter date</li>
                  <li>
                    {format(fromUnixTime(draft.enterDate), 'MM/dd/yy hh:mm a')}
                  </li>
                </div>
                <div className="wrapper">
                  <li>Entry fee</li>
                  <li>${formattedInt(draft.entryFee || 0)}</li>
                </div>
              </ul>

              {draft.selectedRoster && (
                <>
                  <h2 className="selected-roster-title">Selected roster</h2>
                  <SelectedRoster selectedRoster={draft.selectedRoster} />
                </>
              )}
            </div>
          ))
        ) : (
          <p>No drafts entered yet! Enter your first draft here!</p>
        )}
      </div>
    </div>
  );
}
