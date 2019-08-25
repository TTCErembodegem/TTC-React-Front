import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import {showSnackbar} from './configActions.js';
import {broadcastReload} from '../hub.js';

import trans from '../locales.js';

export function loaded(data) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: data
  };
}


export function updateClub(club) {
  return dispatch => {
    return http.post('/clubs/UpdateClub', club)
      .then(function(data) {
        if (data) {
          dispatch(showSnackbar(trans('common.apiSuccess')));
          dispatch(loaded(data));
          broadcastReload('club', data.id);
        }

      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('UpdateClub!', err); // eslint-disable-line
      });
  };
}
