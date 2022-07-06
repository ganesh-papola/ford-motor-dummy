export function getFinalPayment(state) {
  return state?.reservationMisc?.finalPayment ?? null;
}
