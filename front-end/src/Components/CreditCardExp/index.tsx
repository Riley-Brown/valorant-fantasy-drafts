import React, { useRef, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types';

import { checkCardExpDate } from 'Helpers';

export default function CreditCardExp({
  register,
  errors,
  setValue,
  ...rest
}: {
  register: any;
  errors: any;
  setValue: any;
}) {
  const cardExpRef = useRef<HTMLElement>();

  useEffect(() => {
    const errorsArr = Object.keys(errors);
    if (cardExpRef.current && errors.cardExp && errorsArr[0] === 'cardExp') {
      cardExpRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <Cleave
        data-private
        inputMode="numeric"
        id="card-exp"
        className={`form-control ${errors.cardExp ? 'is-invalid' : ''}`}
        placeholder="mm/yy"
        name="cardExp"
        options={{
          date: true,
          datePattern: ['m', 'y']
        }}
        htmlRef={(ref) => {
          cardExpRef.current = ref;
          register(
            { name: 'cardExp' },
            {
              required: true,
              validate: {
                dateInPast: (value: string) => !checkCardExpDate(value),
                invalidDate: (value: string) => value.length >= 5
              }
            }
          );
        }}
        onChange={(e) => setValue('cardExp', e.target.value, true)}
        {...rest}
      />
      {errors.cardExp && (
        <small className="d-block text-danger">
          {errors.cardExp.type === 'invalidDate'
            ? 'Invalid date'
            : errors.cardExp.type === 'dateInPast'
            ? 'Card expired'
            : 'Card exp is required'}
        </small>
      )}
    </>
  );
}
