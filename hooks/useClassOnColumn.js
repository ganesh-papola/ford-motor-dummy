import { useEffect } from 'react';

/**
 * Adds a class to parent DOM node.
 * @param {import('react').Ref} componentRef - Reference to a DOM node.
 * @param {string} className - Class to add to ref's parent.
 * @param {string} filterClass - Defaults to 'aem-GridColumn'. Only apply class to parent if parent has matching class.
 */
const useClassOnColumn = (
  componentRef,
  className,
  filterClass = 'aem-GridColumn'
) => {
  useEffect(() => {
    const containerParent = componentRef.current?.parentNode;
    if (containerParent?.classList.contains(filterClass)) {
      containerParent.classList.add(className);
    }
  }, []);
};

export default useClassOnColumn;
