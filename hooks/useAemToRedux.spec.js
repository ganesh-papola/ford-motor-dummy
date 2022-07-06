import { renderHook } from '@testing-library/react-hooks';
import useAemToRedux from './useAemToRedux';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

describe('useAemToRedux', () => {
  it('should fire action', () => {
    const fauxAction = jest.fn();

    renderHook(() => useAemToRedux(fauxAction(7)));
    expect(fauxAction).toHaveBeenCalled();
  });

  it('should fire multiple actions', () => {
    const fauxAction = jest.fn();
    const fauxAction2 = jest.fn();

    renderHook(() => useAemToRedux(fauxAction(7), fauxAction2('thing')));
    expect(fauxAction).toHaveBeenCalled();
    expect(fauxAction2).toHaveBeenCalled();
  });
});
