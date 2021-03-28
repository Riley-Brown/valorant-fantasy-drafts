import * as ACTIONS from 'ActionTypes/account';
import { Action } from 'redux';

export type AccountStateTypes = {
  balance: number;
  balanceFormatted: string;
  drafts: any[]; // todo: properly type check this eventually
  email: string;
  isAdmin: boolean;
  signupDate: number;
  userId: string;
};

const initialState: AccountStateTypes = {
  balance: 0,
  balanceFormatted: '0.00',
  drafts: [],
  email: '',
  isAdmin: false,
  signupDate: 0,
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
    default:
      return state;
  }
}
