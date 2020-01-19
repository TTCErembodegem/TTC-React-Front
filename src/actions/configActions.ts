import ActionTypes from './ActionTypes';
import http from '../utils/httpClient';
import trans from '../locales';

export function clearSnackbar() {
  return {
    type: ActionTypes.CLEAR_SNACKBAR,
    payload: null,
  };
}

export function showSnackbar(msg: string) {
  return {
    type: ActionTypes.SHOW_SNACKBAR,
    payload: msg,
  };
}

export function setSetting(key: string, value: string) {
  return {
    type: ActionTypes.SET_SETTING,
    payload: {key, value},
  };
}


export function saveConfigParam(key: string, value: string) {
  return dispatch => http.post('/config', {key, value})
    .then(() => {
      dispatch(updateConfigParam(key, value));
      dispatch(showSnackbar('Parameter saved')); // toastr
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('saveConfigParam!', err); // eslint-disable-line
    });
}


export function updateConfigParam(key: string, value: string) {
  return {
    type: ActionTypes.UPDATE_CONFIG_PARAM,
    payload: {key, value},
  };
}
