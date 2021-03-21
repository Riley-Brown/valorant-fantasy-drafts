import * as ACTIONS from 'ActionTypes/account';
import { Action } from 'redux';

export type AccountStateTypes = {
  balance: number;
  balanceFormatted: string;
  email: string;
  userId: string;
};

const initialState: AccountStateTypes = {
  balance: 0,
  balanceFormatted: '0.00',
  email: '',
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
