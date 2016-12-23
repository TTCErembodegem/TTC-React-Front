import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import storeUtil from '../storeUtil.js';
import { showSnackbar } from './configActions.js';
import { broadcastSnackbar, broadcastReload } from '../hub.js';
import { teamsLoaded } from './initialLoad.js';

import trans from '../locales.js';

export function loaded(data) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: data
  };
}

export function toggleTeamPlayer(teamId, playerId, role) {
  return dispatch => {
    return http.post('/teams/ToggleTeamPlayer', {playerId, teamId, role})
      .then(function(data) {
        if (data) {
          dispatch(teamsLoaded(data));
          broadcastReload('team', data.id);
        }
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('toggleTeamPlayer!', err); // eslint-disable-line
      });
  };
}

export function frenoySync() {
  return dispatch => {
    return http.post('/players/FrenoySync')
      .then(function() {
        dispatch(showSnackbar(trans('common.apiSuccess')));
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('FrenoySync!', err); // eslint-disable-line
      });
  };
}

export function updateStyle(player, newStyle, updatedBy) {
  return dispatch => {
    return http.post('/players/UpdateStyle', {playerId: player.id, ...newStyle})
      .then(function(data) {
        if (data) {
          let user = storeUtil.getPlayer(updatedBy) || {alias: ''};
          broadcastSnackbar(trans('player.editStyle.saved', {
            ply: player.alias,
            by: user.alias,
            newStyle: newStyle.name + ': ' + newStyle.bestStroke
          }));
          dispatch(loaded(data));
          broadcastReload('player', data.id);
        }
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('UpdatePlayerStyle!', err); // eslint-disable-line
      });
  };
}

export function updatePlayer(player, opts = {}) {
  return dispatch => {
    return http.post('/players/UpdatePlayer', player)
      .then(function(data) {
        if (data) {
          dispatch(showSnackbar(trans('player.updatePlayerSuccess')));
          dispatch(loaded(data));
          broadcastReload('player', data.id);

          if (opts.activeChanged) {
            dispatch({
              type: ActionTypes.PLAYER_ACTIVE_CHANGED,
              payload: {playerId: data.id, isActive: data.active}
            });
          }
        }

      }, function(err) {
        dispatch(showSnackbar(trans('player.updatePlayerFail')));
        console.log('UpdatePlayer!', err); // eslint-disable-line
      });
  };
}