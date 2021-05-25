import { FormEvent, useState } from 'react';

import './AddBalanceModal.scss';

import { useDispatch } from 'react-redux';

import { useTypedSelector } from 'Reducers';
import { setShowBalanceModal, updateAccount } from 'Actions';

import { chargePayment } from 'API/payment';

import { useToasts } from 'react-toast-notifications';
import { formatPrice } from 'Helpers';

import SpinnerButton from 'Components/SpinnerButton';
import Modal from 'Components/Modal';

export default function AddBalanceModal() {
  const dispatch = useDispatch();
  const account = useTypedSelector((state) => state.account);

  const show = useTypedSelector((state) => state.global.showBalanceModal);

  const [chargeAmount, setChargeAmount] = useState('');

  const { addToast } = useToasts();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const charge = await chargePayment({
        chargeAmount: parseInt(chargeAmount) * 100
      });

      console.log(charge);

      if (charge.type === 'success') {
        addToast(
          <h2>Successfully added ${formatPrice(chargeAmount)} to balance</h2>,
          {
            appearance: 'success',
            autoDismiss: true
          }
        );

        dispatch(setShowBalanceModal(false));
        dispatch(updateAccount({ balance: charge.data.balance }));
      } else {
        addToast(<h2>{charge.message}</h2>, {
          appearance: 'error',
          autoDismiss: true
        });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        id="add-balance-modal"
        show={show}
        onHide={() => dispatch(setShowBalanceModal(false))}
      >
        <h1>Add balance to your account</h1>
        <form onSubmit={onSubmit}>
          <div className="input-wrapper">
            <label htmlFor="add-balance">Amount</label>
            <input
              id="add-balance"
              type="number"
              placeholder="5.00"
              pattern="[0-9]*"
              inputMode="numeric"
              name="addBalance"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              onBlur={(e) => {
                setChargeAmount(formatPrice(e.target.value));
              }}
            />
          </div>
          <small>
            By clicking submit you agree to charge {chargeAmount} USD to your{' '}
            {account.payment?.cardBrand} card ending in{' '}
            {account.payment?.cardLast4}
          </small>
          <div className="buttons-wrapper">
            <button
              onClick={() => dispatch(setShowBalanceModal(false))}
              className="btn"
              type="button"
            >
              Cancel
            </button>
            <SpinnerButton
              disabled={!chargeAmount}
              loading={loading}
              className="btn submit-btn"
              type="submit"
            >
              Add balance
            </SpinnerButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
