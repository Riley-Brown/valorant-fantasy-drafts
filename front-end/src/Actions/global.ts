import * as ACTIONS from 'ActionTypes/global';

export const setIsAuthed = (payload: boolean) => ({
  type: ACTIONS.SET_IS_AUTHED,
  payload
});

export const setShowAuthModal = (payload: boolean) => ({
  type: ACTIONS.SET_SHOW_AUTH_MODAL,
  payload
});

export const setAuthLoginType = (payload: 'signup' | 'login') => ({
  type: ACTIONS.SET_AUTH_LOGIN_TYPE,
  payload
});

export const setShowPaymentModal = (payload: boolean) => ({
  type: ACTIONS.SET_SHOW_PAYMENT_MODAL,
  payload
});

export const setShowBalanceModal = (payload: boolean) => ({
  type: ACTIONS.SET_SHOW_BALANCE_MODAL,
  payload
});
