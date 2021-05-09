import * as ACTIONS from 'ActionTypes/account';
import { Action } from 'redux';

export type AccountStateTypes = {
  balance: number;
  balanceFormatted: string;
  displayName: string;
  drafts: any[]; // todo: properly type check this eventually
  email: string;
  isAdmin: boolean;
  payment?: {
    cardBrand: string;
    cardLast4: string;
  };
  signupDate: number;
  stripeCustomerId: string | undefined;
  userId: string;
};

const initialState: AccountStateTypes = {
  balance: 0,
  balanceFormatted: '0.00',
  displayName: '',
  drafts: [],
  email: '',
  isAdmin: false,
  signupDate: 0,
  stripeCustomerId: undefined,
  userId: ''
};

export default function accountReducer(
  state = initialState,
  action: Action
): AccountStateTypes {
  const { type, payload }: { type?: any; payload?: any } = action;

  switch (type) {
    case ACTIONS.SET_ACCOUNT:
      return payload;
    case ACTIONS.UPDATE_ACCOUNT:
      return {
        ...state,
        ...payload
      };
    case ACTIONS.SET_PAYMENT:
      return {
        ...state,
        payment: payload
      };
    default:
      return state;
  }
}
