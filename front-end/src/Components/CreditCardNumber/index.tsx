import Cleave from 'cleave.js/react';
import { Control, Controller } from 'react-hook-form';

import { cardNumberRegex } from 'Helpers';
import { PaymentModalFormTypes } from 'Components/PaymentModal';

export default function CreditCardNumber({
    control,
}: {
    control: Control<PaymentModalFormTypes>;
}) {
    return (
        <>
            <Controller
                control={control}
                name="cardNumber"
                rules={{
                    required: 'Card number is required',
                    validate: {
                        regex: (value: string) =>
                            cardNumberRegex.test(value.replace(/\s/g, '')) ||
                            'Invalid card number',
                    },
                }}
                render={({
                    field,
                    fieldState: { error },
                }: {
                    field: any;
                    fieldState: any;
                }) => (
                    <>
                        <Cleave
                            data-private
                            id="card-number"
                            inputMode="numeric"
                            className={`form-control ${
                                error ? 'is-invalid' : ''
                            }`}
                            placeholder="4242 4242 4242 4242"
                            options={{
                                creditCard: true,
                            }}
                            {...field}
                            htmlRef={field.ref as any}
                        />
                        {error && (
                            <small className="d-block text-danger">
                                {error.message}
                            </small>
                        )}
                    </>
                )}
            />
        </>
    );
}
