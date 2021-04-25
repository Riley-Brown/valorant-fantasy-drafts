import { isBefore, sub } from 'date-fns/esm';

export function formattedInt(number: number) {
  return (number / 100).toFixed(2);
}

// credit card number regex
export const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;

export function checkCardExpDate(cardExp: string) {
  let expYear = '20' + cardExp.substring(3, 5);
  let expMonth = cardExp.substring(0, 2);

  return isBefore(
    new Date(parseInt(expYear), parseInt(expMonth) - 1),
    sub(new Date(), {
      months: 1
    })
  );
}

export function formatPrice(price: string) {
  if (!price) return '';

  const split = price.replace(/[a-zA-Z]+/g, '').split('.');

  return `${split[0] || 0}.${(split.length > 1 ? split[1] + '00' : '00').slice(
    undefined,
    2
  )}`;
}

export function calcUnixTimeDifference(date1: number, date2: number) {
  console.log({ date1, date2 });

  const difference = Math.floor(date1 - date2);

  console.log(difference);

  const days = Math.floor(difference / 60 / 60 / 24);
  const hours = Math.floor((difference / 60 / 60) % 24);
  const minutes = Math.floor((difference / 60) % 60);
  const seconds = Math.floor(difference % 60);

  console.log({ days, hours, minutes, seconds });

  return {
    days,
    hours,
    minutes,
    seconds
  };
}
