import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateDeliveryLabel } from '@Ducks/deliveryData/actions';
import { updateChargingLabel } from '@Ducks/charging/actions';
import { updateAccessoriesLabel } from '@Ducks/accessories/actions';
import { ACCORDION_TYPES } from '@Constants/main';

const useUpdateAccordionLabel = (accordionType, label) => {
  const dispatch = useDispatch();
  useEffect(() => {
    switch (accordionType) {
      case ACCORDION_TYPES.ACCESSORIES:
        dispatch(updateAccessoriesLabel(label));
        break;

      case ACCORDION_TYPES.CHARGING:
        dispatch(updateChargingLabel(label));
        break;

      case ACCORDION_TYPES.DEALER_DELIVERY:
        dispatch(updateDeliveryLabel(label));
        break;

      default:
        return;
    }
  }, [accordionType, label]);
};

export default useUpdateAccordionLabel;
