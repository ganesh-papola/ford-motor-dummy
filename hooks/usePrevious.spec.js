import usePrevious from '@Hooks/usePrevious';
import { renderHook } from '@testing-library/react-hooks';

describe('usePrevious Hook', () => {
  it('When passed string, should return previous string', () => {
    const previousValue = 'some string';
    const { result, rerender } = renderHook(() => usePrevious(previousValue));
    rerender('new String');
    expect(result.current).toEqual(previousValue);
  });

  it('When passed object, should return previous object', () => {
    const previousValue = { savingsAmount: 500 };
    const { result, rerender } = renderHook(() => usePrevious(previousValue));
    rerender({ savingsAmount: 1000 });
    expect(result.current).toEqual(previousValue);
  });

  it('When passed undefined, should return previous value as undefined', () => {
    const previousValue = undefined;
    const { result, rerender } = renderHook(() => usePrevious(previousValue));
    rerender('some new value');
    expect(result.current).toBeUndefined();
  });
});
