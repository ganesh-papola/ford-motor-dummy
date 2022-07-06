import { useCallback, useState, useEffect } from 'react';
import { KEYBOARD_CODES } from '@Constants/calculator';

const useRoveFocus = (size, defaultValue = 0) => {
  const [currentFocus, setCurrentFocus] = useState(defaultValue);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === KEYBOARD_CODES.DOWN_ARROW) {
        setCurrentFocus(currentFocus === size - 1 ? 0 : currentFocus + 1);
      } else if (event.keyCode === KEYBOARD_CODES.UP_ARROW) {
        setCurrentFocus(currentFocus === 0 ? size - 1 : currentFocus - 1);
      }
    },
    [size, currentFocus, setCurrentFocus]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return [currentFocus, setCurrentFocus];
};

export default useRoveFocus;
