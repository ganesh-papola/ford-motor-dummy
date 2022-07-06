export const reducers = {
  setDeliveryGeoCoords(state, { payload }) {
    state.searchParams.delivery.latitude = payload?.latitude ?? null;
    state.searchParams.delivery.longitude = payload?.longitude ?? null;
  },

  setDeliveryPostalCode(state, { payload }) {
    state.searchParams.delivery.postalCode = payload ?? null;
  },

  setDeliveryRadius(state, { payload }) {
    // TODO: US3150880: add test coverage for this case where the value received from AEM/authoring is a string
    const radius = Number(payload);
    if (Number.isNaN(radius) || radius <= 0) return;

    state.searchParams.delivery.radius = radius ?? null;
  },

  setGroupBy(state, { payload }) {
    state.searchParams.groupBy = payload ?? null;
  },

  clearLocationErrorMessage(state) {
    clearDataRequestErrors({ state, clearUiErrorMsgs: true });
  },

  clearAutoAllocationErrors(state) {
    clearDataRequestErrors({ state, clearUiErrorMsgs: true });
  },
};

function clearDataRequestErrors({ state, clearUiErrorMsgs = true }) {
  const dataRequests = Object.entries(state.dataRequests);
  const dataRequestsWithErrorsToClear = dataRequests
    .filter(([, { shouldTriggerErrMsgInUi }]) => {
      return shouldTriggerErrMsgInUi === clearUiErrorMsgs;
    })
    .map(([key]) => key);

  dataRequestsWithErrorsToClear.forEach((dataRequestName) => {
    state.dataRequests[dataRequestName].error = null;
  });
}
