import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registerCartAccordion } from '@Ducks/cart/actions';

const useRegisterCartAccordion = ({
  accordionType,
  isRequired,
  alwaysExpandDuringAccordionProgression,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      registerCartAccordion({
        accordionType,
        isRequired,
        alwaysExpandDuringAccordionProgression,
      })
    );
  }, []);
};

export default useRegisterCartAccordion;
