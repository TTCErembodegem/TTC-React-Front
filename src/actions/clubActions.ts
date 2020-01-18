import ActionTypes from './ActionTypes';
import http from '../utils/httpClient';
import {showSnackbar} from './configActions';
import {broadcastReload} from '../hub';

import trans from '../locales';

export function loaded(data) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: data,
  };
}


export function updateClub(club) {
  return dispatch => http.post('/clubs/UpdateClub', club)
    .then(data => {
      if (data) {
        dispatch(showSnackbar(trans('common.apiSuccess')));
        dispatch(loaded(data));
        broadcastReload('club', data.id);
      }

    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('UpdateClub!', err); // eslint-disable-line
    });
}
