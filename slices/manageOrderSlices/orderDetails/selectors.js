export function getManageOrderData(state) {
  return state?.manageOrderData || {};
}

export function getIsLoading(state) {
  return getManageOrderData(state)?.isLoading;
}

export function getHasSucceeded(state) {
  return getManageOrderData(state)?.hasSucceeded;
}

export function getHasSucceededWithValidData(state) {
  return getManageOrderData(state)?.hasSucceededWithValidData;
}

export function getHasFailed(state) {
  return getManageOrderData(state)?.hasFailed;
}

export function getFinancialData(state) {
  return getManageOrderData(state)?.data?.entries?.[0]?.financeData || [];
}

export function getFinancialQuote(state) {
  return getFinancialData(state)?.quote || {};
}
