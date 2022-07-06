import { useEffect } from 'react';

/**
 * Creates an event listener that is automatically removed when the component is destroyed.
 * @param {HTMLElement} element The element to attach the listener to
 * @param {string} eventName The event name (e.g. "click", "mousedown", etc...)
 * @param {function} callback The callback. Takes an event object as its parameter
 * @param {Array[]} dependencies A list of variables that will cause the listener to be recreated if changed.
 */
export const useEventListener = (
  element,
  eventName,
  callback,
  dependencies = []
) => {
  useEffect(() => {
    if (!element) return;
    element.addEventListener(eventName, callback);
    return () => element.removeEventListener(eventName, callback);
  }, [element, ...dependencies]);
};
