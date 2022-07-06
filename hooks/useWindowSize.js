import { useState, useEffect } from 'react';
import * as constants from '@Constants';

const sizeLabeller = (width) => {
  switch (width > 0) {
    case width >= constants.SCREEN_SIZES.xl:
      return 'xl';
    case width >= constants.SCREEN_SIZES.lg:
      return 'lg';
    case width >= constants.SCREEN_SIZES.md:
      return 'md';
    case width >= constants.SCREEN_SIZES.sm:
      return 'sm';
    default:
      return 'xs';
  }
};

const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const getSize = () => ({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
    sizeLabel: isClient ? sizeLabeller(window.innerWidth) : undefined,
  });

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    let timeoutId = null;
    if (!isClient) {
      return false;
    }

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowSize(getSize()), 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
