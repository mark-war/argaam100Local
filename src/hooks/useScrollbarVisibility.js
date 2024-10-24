// useScrollbarVisibility.js
import { useEffect } from 'react';

const useScrollbarVisibility = (isVisible) => {
  useEffect(() => {
    const handleScrollbar = () => {
      if (isVisible) {
        alert('ok')
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    };

    handleScrollbar();

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isVisible]);
};

export default useScrollbarVisibility;
