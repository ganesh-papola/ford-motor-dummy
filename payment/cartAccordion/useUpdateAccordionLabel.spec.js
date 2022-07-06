import { renderHook } from '@testing-library/react-hooks';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('useUpdateAccordionLabel', () => {
  it('should fire action', () => {
    renderHook(() => useUpdateAccordionLabel('accessories', 'Accessories'));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'Accessories',
      type: 'UPDATE_ACCESSORIES_LABEL',
    });
  });
});
