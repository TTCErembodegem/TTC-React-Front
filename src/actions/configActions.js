import * as ActionTypes from './ActionTypes.js';
// import http from '../utils/httpClient.js';
// import { util as storeUtil } from '../store.js';

export function clearSnackbar() {
  return {
    type: ActionTypes.CONFIG_CLEAR_SNACKBAR,
    payload: null
  };
}