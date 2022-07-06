import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { persistor } from 'redux/store/Store';

/**
 * Batches multiple actions then flushes the redux state.
 * @param  {...any} actions list of actions.
 * @param {any[]} deps list of dependencies.
 */

export const useBatchAndPersist = (actions = [], deps) => {
  const dispatch = useDispatch();
  return useCallback(
    () => {
      actions.forEach((action) => {
        action();
      });
      return persistor.flush();
    },
    deps ? [dispatch, ...deps] : [dispatch]
  );
};

export default useBatchAndPersist;
