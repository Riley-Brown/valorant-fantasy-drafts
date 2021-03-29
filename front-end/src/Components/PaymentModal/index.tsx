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

type FormSubmitTypes = {
  cardCvc: string;
  cardExp: string;
  // cardName: string;
  cardNumber: string;
  chargeAmount: string;
  // cardZip: string;
};

export default function PaymentModal() {
  const show = useTypedSelector((state) => state.global.showPaymentModal);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [paymentError, setPaymentError] = useState('');

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    setError
  } = useForm<FormSubmitTypes>({
    mode: 'onBlur'
  });

  console.log(errors);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
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
      }

      // setPaymentError(saveCard.message);

      setLoading(false);
      console.log(saveCard);
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
                  {paymentError && (
                    <h2 className="text-danger">{paymentError}</h2>
                  )}
                  <label htmlFor="card-number">Card number</label>
                  <CreditCardNumber
                    register={register}
                    errors={errors}
                    setValue={setValue}
                  />
                </div>
                <div className="input-row-wrapper">
                  <div className="input-wrapper">
                    <label htmlFor="card-exp">Card exp</label>
                    <CreditCardExp
                      register={register}
                      errors={errors}
                      setValue={setValue}
                    />
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="card-cvc">Card Cvc</label>
                    <input
                      ref={register({
                        required: true,
                        validate: {
                          invalid: (value) => value.trim().length <= 4
                        }
                      })}
                      placeholder="***"
                      id="card-cvc"
                      type="number"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      name="cardCvc"
                    />
                    {errors.cardCvc && (
                      <small className="text-danger">
                        {(errors.cardCvc as FieldError).type === 'invalid'
                          ? 'Invalid cvc'
                          : 'Card cvc is required'}
                      </small>
                    )}
                  </div>
                </div>
                <div className="input-wrapper">
                  <label htmlFor="add-balance">Add balance</label>
                  <input
                    ref={register({
                      // required: true,
                      // validate: {
                      //   invalid: (value) => value.trim().length <= 4
                      // }
                    })}
                    placeholder="5.00"
                    id="add-balance"
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    name="addBalance"
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
