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
