import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import { showSnackbar } from './configActions.js';

import trans from '../locales.js';

export function loaded(data) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: data
  };
}

export function updateStyle(player, newStyle) {
  return dispatch => {
    return http.post('/players/UpdateStyle', {playerId: player.id, ...newStyle})
      .then(function(data) {
        if (data) {
          dispatch(showSnackbar(trans('players.editStyle.saved', {ply: player.alias})));
          dispatch(loaded(data));
        }
      }, function(err) {
        dispatch(showSnackbar('players.editStyle.saveFailed'));
        console.log('UpdateStyle!', err); // eslint-disable-line
      });
  };
}