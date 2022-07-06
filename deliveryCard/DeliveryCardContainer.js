// React
import React from 'react';
import useActions from '@Hooks/useActions';
import { useSelector } from 'react-redux';

// Selectors
import {
  getProvider,
  getTotalPriceWithAddOns,
} from '@Ducks/calculator/selectors';
import * as deliveryDataSelectors from '@Ducks/deliveryData/selectors';
import * as orderDataSelectors from '@Ducks/orderData/selectors';
import { getUpdateDeliveryFinanceHasSucceeded } from '@Ducks/sap/selectors';

// Thunks
import {
  updateDeliveryOptions,
  updateDeliveryFinance,
} from '@Ducks/deliveryData/thunks';

// Actions
import {
  updateDeliveryApplyFinance,
  updateSelectedDeliveryMethod,
  updateDeliveryMethodShowDealer,
} from '@Ducks/deliveryData/actions';

// Constants
import { DELIVERY_CARDS_TYPES } from '@Constants/main';

// Components
import DeliveryCard from './DeliveryCard';

const DeliveryCardContainer = (props) => {
  const { cardType } = props;
  const isDeliveryUnavailable = useSelector((state) =>
    deliveryDataSelectors.isDeliveryUnavailable(state)
  );
  return (
    <DeliveryCard
      {...props}
      {...useActions({
        updateDeliveryOptions,
        updateDeliveryFinance,
        updateDeliveryApplyFinance,
        updateSelectedDeliveryMethod,
        updateDeliveryMethodShowDealer,
      })}
      addToFinance={useSelector(deliveryDataSelectors.getDeliveryApplyFinance)}
      collectionFee={useSelector((state) =>
        deliveryDataSelectors.getFee(state, cardType)
      )}
      deliveryFee={useSelector((state) =>
        deliveryDataSelectors.getFee(state, cardType)
      )}
      deliveryZipcode={useSelector(
        deliveryDataSelectors.getDeliveryMethodPostCode ||
          orderDataSelectors.getPostalCode
      )}
      isDeliveryUnavailable={
        cardType === DELIVERY_CARDS_TYPES.DELIVERY && isDeliveryUnavailable
      }
      isNewOrder={useSelector(orderDataSelectors.getNewOrderFlow)}
      updateDeliveryFinanceHasSucceeded={useSelector(
        getUpdateDeliveryFinanceHasSucceeded
      )}
      paymentProvider={useSelector(getProvider)}
      cartTotalPrice={useSelector(getTotalPriceWithAddOns)}
    />
  );
};

export default DeliveryCardContainer;
