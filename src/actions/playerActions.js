import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import { showSnackbar } from './configActions.js';
import { broadcastSnackbar, broadcastReload } from '../hub.js';

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
          let user = storeUtil.getUser().getPlayer();
          broadcastSnackbar(trans('players.editStyle.saved', {
            ply: player.alias,
            by: user.alias,
            newStyle: newStyle.name + ': ' + newStyle.bestStroke
          }));
          dispatch(loaded(data));
          broadcastReload('player', data.id);
        }
      }, function(err) {
        dispatch(showSnackbar('common.apiFail'));
        console.log('UpdateStyle!', err); // eslint-disable-line
      });
  };
}