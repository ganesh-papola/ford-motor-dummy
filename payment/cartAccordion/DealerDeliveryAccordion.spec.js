import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import DealerDeliveryAccordion from './DealerDeliveryAccordion';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store/Store';

const props = {
  completeCartAccordion: jest.fn(),
};
describe('DealerDeliveryAccordion', () => {
  it('calls completeCartAccordion when isDealerized and there is a selectDeliveryMethod', () => {
    const completeCartAccordion = jest.fn();
    render(
      <Provider store={store}>
        <DealerDeliveryAccordion
          {...props}
          isDealerized={true}
          isOpen={true}
          selectedDeliveryMethod="delivery"
          completeCartAccordion={completeCartAccordion}
        />
      </Provider>
    );
    expect(completeCartAccordion).toHaveBeenCalled();
  });

  it('does NOT call completeCartAccordion when !isDealerized and there is a selectDeliveryMethod', () => {
    const completeCartAccordion = jest.fn();
    render(
      <Provider store={store}>
        <DealerDeliveryAccordion
          {...props}
          isDealerized={false}
          isOpen={true}
          selectedDeliveryMethod="delivery"
          completeCartAccordion={completeCartAccordion}
        />
      </Provider>
    );
    expect(completeCartAccordion).not.toHaveBeenCalled();
  });
});
