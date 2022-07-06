import { useSelector } from 'react-redux';
import { getFragmentProps } from '@Utils/fragmentUtils/FragmentUtils';
import { getSingleFragmentSlice } from '@Ducks/aem/selectors';

/*
This hook allows fragment containers to use both the fragment selector and
the legacy fragment selectors. It should be deleted once authoring is fully
switched to the new fragment selector.
 */
export const useLegacyFragment = (path, fragmentProps, mappableValues = {}) => {
  const computedSingleFragment = useSelector((state) =>
    getSingleFragmentSlice(state, path)
  );
  return (
    fragmentProps ||
    getFragmentProps(computedSingleFragment, mappableValues) ||
    {}
  );
};
