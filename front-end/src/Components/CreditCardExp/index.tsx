import Cleave from 'cleave.js/react';
import { Control, Controller } from 'react-hook-form';

import { checkCardExpDate } from 'Helpers';
import { PaymentModalFormTypes } from 'Components/PaymentModal';

export default function CreditCardExp({
  control
}: {
  control: Control<PaymentModalFormTypes>;
}) {
  return (
    <>
      <Controller
        control={control}
        name="cardExp"
        rules={{
          required: 'Card exp is required',
          validate: {
            dateInPast: (value: string) =>
              !checkCardExpDate(value) || 'Card expired',
            invalidDate: (value: string) => value.length >= 5 || 'Invalid date'
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Cleave
              data-private
              inputMode="numeric"
              id="card-exp"
              className={`form-control ${error ? 'is-invalid' : ''}`}
              placeholder="mm/yy"
              options={{
                date: true,
                datePattern: ['m', 'y']
              }}
              htmlRef={field.ref as any}
              {...field}
            />
            {error && (
              <small style={{ marginTop: 5 }} className="d-block text-danger">
                {error.message}
              </small>
            )}
          </>
        )}
      />
    </>
  );
}
