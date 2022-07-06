import { renderHook } from '@testing-library/react-hooks';
import useRegisterCartAccordion from './useRegisterCartAccordion';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('useRegisterCartAccordion', () => {
  it('should fire action', () => {
    renderHook(() =>
      useRegisterCartAccordion({
        accordionType: 'paymentMethod',
        isRequired: true,
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { accordionType: 'paymentMethod', isRequired: true },
      type: 'REGISTER_CART_ACCORDION',
    });
  });
});
