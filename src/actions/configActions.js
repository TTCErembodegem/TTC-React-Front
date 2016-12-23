import * as ActionTypes from './ActionTypes.js';

export function clearSnackbar() {
  return {
    type: ActionTypes.CLEAR_SNACKBAR,
    payload: null
  };
}

export function showSnackbar(msg) {
  return {
    type: ActionTypes.SHOW_SNACKBAR,
    payload: msg
  };
}

export function setSetting(key, value) {
  return {
    type: ActionTypes.SET_SETTING,
    payload: {key, value}
  };
}