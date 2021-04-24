import { useState } from 'react';
import { useTypedSelector } from 'Reducers';

import './PaymentModal.scss';

import CreditCardNumber from 'Components/CreditCardNumber';
import CreditCardExp from 'Components/CreditCardExp';
import SpinnerButton from 'Components/SpinnerButton';
import Portal from 'Components/Portal';
import Fade from 'Components/Fade';

import { useForm, FieldError } from 'react-hook-form';

import { useDispatch } from 'react-redux';

import { setShowPaymentModal, updateAccount } from 'Actions';
import { addPayment } from 'API/payment';

import { useToasts } from 'react-toast-notifications';

export type PaymentModalFormTypes = {
  addBalance: string;
  cardCvc: string;
  cardExp: string;
  cardNumber: string;
  chargeAmount: string;
};

export default function PaymentModal() {
  const show = useTypedSelector((state) => state.global.showPaymentModal);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control
  } = useForm<PaymentModalFormTypes>({
    mode: 'onBlur'
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    try {
      const saveCard = await addPayment({
        number: data.cardNumber.replace(/\s/g, ''),
        exp_month: data.cardExp.substring(0, 2),
        exp_year: `20${data.cardExp.substring(3, 5)}`,
        cvc: data.cardCvc
      });

      if (saveCard.type === 'success') {
        dispatch(setShowPaymentModal(false));

        addToast(<h2>Successfully added card</h2>, {
          appearance: 'success',
          autoDismiss: true
        });

        dispatch(
          updateAccount({
            stripeCustomerId: saveCard.data.stripeCustomerId,
            payment: {
              cardBrand: saveCard.data.cardBrand,
              cardLast4: saveCard.data.cardLast4
            }
          })
        );
      } else {
        addToast(<h2>{saveCard.message}</h2>, {
          appearance: 'error',
          autoDismiss: true
        });

        if (saveCard.type === 'card_error') {
          setError('cardNumber', { message: saveCard.message });
        }
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  });

  return (
    <>
      <Portal id="payment-modal">
        <Fade inProp={show}>
          <div
            className="modal-backdrop"
            onClick={() => dispatch(setShowPaymentModal(false))}
          >
            <div className="container" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={onSubmit}>
                <div className="input-wrapper">
                  <label htmlFor="card-number">Card number</label>
                  <CreditCardNumber control={control} />
                </div>
                <div className="input-row-wrapper">
                  <div className="input-wrapper">
                    <label htmlFor="card-exp">Card exp</label>
                    <CreditCardExp control={control} />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="card-cvc">Card Cvc</label>
                    <input
                      className={`form-control ${
                        errors.cardCvc ? 'is-invalid' : ''
                      }`}
                      {...register('cardCvc', {
                        required: 'Card cvc is required',
                        validate: {
                          invalid: (value) =>
                            value.trim().length <= 4 || 'Invalid cvc'
                        }
                      })}
                      placeholder="***"
                      id="card-cvc"
                      type="number"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                    {errors.cardCvc && (
                      <small className="text-danger">
                        {errors.cardCvc.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="input-wrapper">
                  <label htmlFor="add-balance">Add balance</label>
                  <input
                    {...register('addBalance')}
                    placeholder="5.00"
                    id="add-balance"
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                  {errors.cardCvc && (
                    <small className="text-danger">
                      {(errors.cardCvc as FieldError).type === 'invalid'
                        ? 'Invalid cvc'
                        : 'Card cvc is required'}
                    </small>
                  )}
                </div>
                <SpinnerButton
                  loading={loading}
                  className="btn submit"
                  type="submit"
                >
                  Submit
                </SpinnerButton>
              </form>
            </div>
          </div>
        </Fade>
      </Portal>
    </>
  );
}
