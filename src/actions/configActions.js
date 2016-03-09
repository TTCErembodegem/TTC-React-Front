import * as ActionTypes from './ActionTypes.js';
// import http from '../utils/httpClient.js';
// import { util as storeUtil } from '../store.js';

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