import { useState, useCallback, useLayoutEffect } from 'react';

const getDimensionObject = (node, sectionWidth) => {
  const rect = node.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
    howManyFit: sectionWidth ? Math.floor(rect.width / sectionWidth) || 1 : 0,
  };
};

const useDimensions = ({
  update = false,
  sectionWidth = null,
  updateLimit = 200,
} = {}) => {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node && process.env.NODE_ENV !== 'test') {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(getDimensionObject(node, sectionWidth))
        );

      measure();
      let timeoutId = null;

      const handleResizeScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => measure(), updateLimit);
      };

      if (update) {
        window.addEventListener('resize', handleResizeScroll);
        window.addEventListener('scroll', handleResizeScroll);

        return () => {
          window.removeEventListener('resize', handleResizeScroll);
          window.removeEventListener('scroll', handleResizeScroll);
        };
      }
    }
  }, [node, sectionWidth, update]);

  return [ref, dimensions, node];
};

export default useDimensions;
