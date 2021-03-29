import * as ACTIONS from 'ActionTypes/global';
import { Action } from 'redux';

export type GlobalStateTypes = {
  isAuthed: boolean;
  showBalanceModal: boolean;
  showAuthModal: boolean;
  showPaymentModal: boolean;
  loginType: 'signup' | 'login';
};

const initialState: GlobalStateTypes = {
  isAuthed: false,
  showBalanceModal: false,
  showAuthModal: false,
  showPaymentModal: false,
  loginType: 'signup'
};

export default function globalReducer(
  state = initialState,
  action: Action
): GlobalStateTypes {
  const { type, payload }: { type?: any; payload?: any } = action;

  switch (type) {
    case ACTIONS.SET_IS_AUTHED:
      return {
        ...state,
        isAuthed: payload
      };
    case ACTIONS.SET_SHOW_AUTH_MODAL:
      return {
        ...state,
        showAuthModal: payload
      };
    case ACTIONS.SET_AUTH_LOGIN_TYPE:
      return {
        ...state,
        loginType: payload
      };
    case ACTIONS.SET_SHOW_PAYMENT_MODAL:
      return {
        ...state,
        showPaymentModal: payload
      };
    case ACTIONS.SET_SHOW_BALANCE_MODAL:
      return {
        ...state,
        showBalanceModal: payload
      };
    default:
      return state;
  }
}
