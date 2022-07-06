import React from 'react';
import { shallow } from 'enzyme';
import PriceItem from './PriceItem';

describe('Price Item Component', () => {
  let wrapper;
  const setupWrapper = (props = {}) => {
    wrapper = shallow(<PriceItem {...props} />);
  };
  it('When Component instance is called and have description, should render the component', () => {
    setupWrapper({ description: 'just a description' });
    expect(wrapper.find('.description-and-price').exists()).toBeTruthy();
  });

  it('When Description is passed, should display the description', () => {
    const props = {
      description: 'just a description',
    };
    setupWrapper(props);
    expect(wrapper.find('.description').text()).toEqual(props.description);
  });

  it('When price is passed, should display the price', () => {
    const props = {
      description: 'just a description',
      priceValue: 50,
      disclaimerOnLabel: false,
      renderDisclaimer: jest.fn().mockImplementation(() => {
        return <div className="disclaimer" />;
      }),
    };
    setupWrapper(props);
    expect(wrapper.find('.price').text()).toEqual(props.priceValue.toString());
  });

  it('When price is zero and zero value should be suppressed, should not display the price but description should be displayed', () => {
    const props = {
      description: 'just a description',
      priceValue: 0,
      disclaimerOnLabel: false,
      suppressZeroValue: true,
      renderDisclaimer: jest.fn().mockImplementation(() => {
        return <div className="disclaimer" />;
      }),
    };
    setupWrapper(props);
    expect(wrapper.find('.price').text()).not.toEqual(
      props.priceValue.toString()
    );
  });

  it('When disclaimer is passed and should be on label, should display the disclaimer on description and not on price', () => {
    const props = {
      description: 'just a description',
      disclaimerOnLabel: true,
      renderDisclaimer: jest.fn().mockImplementation(() => {
        return <div className="disclaimer" />;
      }),
    };
    setupWrapper(props);
    expect(wrapper.find('.description .disclaimer').exists()).toBeTruthy();
    expect(wrapper.find('.price .disclaimer').exists()).toBeFalsy();
  });

  it('When disclaimer is passed and should be on price, should display the disclaimer on price and not on description', () => {
    const props = {
      description: 'just a description',
      disclaimerOnLabel: false,
      renderDisclaimer: jest.fn().mockImplementation(() => {
        return <div className="disclaimer" />;
      }),
    };
    setupWrapper(props);
    expect(wrapper.find('.description .disclaimer').exists()).toBeFalsy();
    expect(wrapper.find('.price .disclaimer').exists()).toBeTruthy();
  });
});
