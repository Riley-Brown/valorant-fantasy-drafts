import React, { useRef, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types';

import { cardNumberRegex } from 'Helpers';

export default function CreditCardNumber({
  register,
  errors,
  setValue,
  ...rest
}: {
  register: any;
  errors: any;
  setValue: any;
}) {
  const cardNumberRef = useRef<HTMLElement>();

  useEffect(() => {
    const errorsArr = Object.keys(errors);

    if (
      cardNumberRef.current &&
      errors.cardNumber &&
      errorsArr[0] === 'cardNumber'
    ) {
      cardNumberRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <Cleave
        data-private
        id="card-number"
        inputMode="numeric"
        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
        name="cardNumber"
        placeholder="4242 4242 4242 4242"
        options={{
          creditCard: true
        }}
        htmlRef={(ref) => {
          cardNumberRef.current = ref;
          register(
            { name: 'cardNumber', type: 'custom' },
            {
              required: true,
              validate: {
                regex: (value: string) =>
                  cardNumberRegex.test(value.replace(/\s/g, ''))
              }
            }
          );
        }}
        onChange={(e) => setValue('cardNumber', e.target.value, true)}
        {...rest}
      />
      {errors.cardNumber && (
        <small className="text-danger">
          {errors.cardNumber.type === 'required'
            ? 'Card number is required'
            : errors.cardNumber.type === 'incorrect'
            ? 'Incorrect card number. Please check card number and try again.'
            : 'Invalid card number'}
        </small>
      )}
    </>
  );
}
