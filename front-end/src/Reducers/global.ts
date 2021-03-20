import * as ACTIONS from 'ActionTypes/global';
import { Action } from 'redux';

export type GlobalStateTypes = {
  isAuthed: boolean;
  showAuthModal: boolean;
};

const initialState: GlobalStateTypes = {
  isAuthed: false,
  showAuthModal: false
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
    default:
      return state;
  }
}
