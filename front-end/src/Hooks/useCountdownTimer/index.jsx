import { useState, useEffect } from 'react';

export default function useCountdownTimer({ unixTimestamp }) {
  const calculateTimeLeft = () => {
    const difference = Math.abs(unixTimestamp - Date.now() / 1000);

    const days = Math.floor(difference / 60 / 60 / 24);
    const hours = Math.floor((difference / 60 / 60) % 24);
    const minutes = Math.floor((difference / 60) % 60);
    const seconds = Math.floor(difference % 60);

    return {
      days: days < 10 ? `0${days}` : days,
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(() => calculateTimeLeft());
    }, 1000);
  });

  return timeLeft;
}
