import { useRef } from 'react';

/**
 * Returns the number of times the component has rendered, starting at 1.
 * @returns {number}
 */
export const useRenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current++;
  return renderCount.current;
};

export const useIsFirstRender = () => useRenderCount() === 1;
