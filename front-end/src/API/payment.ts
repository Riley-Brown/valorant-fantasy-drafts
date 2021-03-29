import { API_ROOT } from './root';

export async function getPaymentDetails() {
  const res = await fetch(`${API_ROOT}/payments/stripe/get-payment`, {
    method: 'GET',
    credentials: 'include'
  });

  return res.json();
}

export async function addPayment(data: {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}) {
  const res = await fetch(`${API_ROOT}/payments/stripe/add-payment`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function chargePayment({
  chargeAmount
}: {
  chargeAmount: number;
}) {
  const res = await fetch(`${API_ROOT}/payments/stripe/charge`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ chargeAmount })
  });

  return res.json();
}
