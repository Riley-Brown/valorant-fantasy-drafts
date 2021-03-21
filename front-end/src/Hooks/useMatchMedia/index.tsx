import { useState, useEffect } from 'react';

export default function useMatchMedia({ width }: { width: number }) {
  const [isMediaMatched, setIsMediaMatched] = useState(
    window.matchMedia(`(max-width: ${width}px)`).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${width}px)`);
    const handleToggle = () => setIsMediaMatched(mq.matches);
    mq.addListener(handleToggle);

    return () => mq.removeListener(handleToggle);
  }, [width]);

  return isMediaMatched;
}
