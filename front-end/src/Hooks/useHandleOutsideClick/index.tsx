import React, { useEffect } from 'react';

export default function useHandleOutsideClick(
  ref: React.RefObject<HTMLElement>,
  handler: () => any
) {
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', handleOutsideClick, false);
    document.addEventListener('touchstart', handleOutsideClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, false);
      document.removeEventListener('touchstart', handleOutsideClick, false);
    };
  }, [ref]);
}
