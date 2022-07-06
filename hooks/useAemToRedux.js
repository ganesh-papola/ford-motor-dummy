import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useAemToRedux = (...actions) => {
  const dispatch = useDispatch();

  useEffect(() => {
    actions.forEach((action) => {
      dispatch(action);
    });
  }, []);
};

export default useAemToRedux;
