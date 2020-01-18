import ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import trans from '../locales.js';

export function clearSnackbar() {
  return {
    type: ActionTypes.CLEAR_SNACKBAR,
    payload: null,
  };
}

export function showSnackbar(msg) {
  return {
    type: ActionTypes.SHOW_SNACKBAR,
    payload: msg,
  };
}

export function setSetting(key, value) {
  return {
    type: ActionTypes.SET_SETTING,
    payload: {key, value},
  };
}


export function saveConfigParam(key, value) {
  return dispatch => http.post('/config', {key, value})
    .then(() => {
      dispatch(updateConfigParam(key, value));
      dispatch(showSnackbar('Parameter saved')); // toastr
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('saveConfigParam!', err); // eslint-disable-line
    });
}


export function updateConfigParam(key, value) {
  return {
    type: ActionTypes.UPDATE_CONFIG_PARAM,
    payload: {key, value},
  };
}
