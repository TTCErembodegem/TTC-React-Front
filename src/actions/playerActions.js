import ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import storeUtil from '../storeUtil.js';
import {showSnackbar} from './configActions.js';
import {broadcastSnackbar, broadcastReload} from '../hub.js';
import {teamsLoaded} from './initialLoad.js';

import trans from '../locales.js';

export function loaded(data) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: data,
  };
}

export function toggleTeamPlayer(teamId, playerId, role) {
  return dispatch => http.post('/teams/ToggleTeamPlayer', {playerId, teamId, role})
    .then(data => {
      if (data) {
        dispatch(teamsLoaded(data));
        broadcastReload('team', data.id);
      }
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('toggleTeamPlayer!', err); // eslint-disable-line
    });
}

export function frenoySync() {
  return dispatch => http.post('/players/FrenoySync')
    .then(() => {
      dispatch(showSnackbar(trans('common.apiSuccess')));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('FrenoySync!', err); // eslint-disable-line
    });
}

export function updateStyle(player, newStyle, updatedBy) {
  return dispatch => http.post('/players/UpdateStyle', {playerId: player.id, ...newStyle})
    .then(data => {
      if (data) {
        const user = storeUtil.getPlayer(updatedBy) || {alias: ''};
        broadcastSnackbar(trans('player.editStyle.saved', {
          ply: player.alias,
          by: user.alias,
          newStyle: `${newStyle.name}: ${newStyle.bestStroke}`,
        }));
        dispatch(loaded(data));
        broadcastReload('player', data.id);
      }
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('UpdatePlayerStyle!', err); // eslint-disable-line
    });
}

export function updatePlayer(player, opts = {}) {
  return dispatch => http.post('/players/UpdatePlayer', player)
    .then(data => {
      if (data) {
        dispatch(showSnackbar(trans('player.updatePlayerSuccess')));
        dispatch(loaded(data));
        broadcastReload('player', data.id);

        if (opts.activeChanged) {
          dispatch({
            type: ActionTypes.PLAYER_ACTIVE_CHANGED,
            payload: {playerId: data.id, isActive: data.active},
          });
        }
      }

    }, err => {
      dispatch(showSnackbar(trans('player.updatePlayerFail')));
        console.log('UpdatePlayer!', err); // eslint-disable-line
    });
}


export function deletePlayer(player) {
  return dispatch => http.post(`/players/DeletePlayer/${player.id}`)
    .then(() => {
      dispatch(showSnackbar(trans('player.deletePlaterSuccess')));
      dispatch(deleted(player));

    }, err => {
      dispatch(showSnackbar(trans('player.deletePlayerFail')));
        console.log('DeletePlayer!', err); // eslint-disable-line
    });
}

function deleted(data) {
  return {
    type: ActionTypes.PLAYER_DELETED,
    payload: data,
  };
}




export function saveBoardMember({playerId, boardFunction, sort}) {
  return dispatch => http.post('/clubs/Board', {playerId, boardFunction, sort})
    .then(() => {
      // dispatch({type: ActionTypes.BOARD_SAVED, payload: playerId});
      dispatch(showSnackbar(trans('common.apiSuccess')));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
       console.log('saveBoardMember!', err); // eslint-disable-line
    });
}

export function deleteBoardMember({playerId}) {
  return dispatch => http.post(`/clubs/Board/${playerId}`)
    .then(() => {
      // dispatch({type: ActionTypes.BOARD_DELETED, payload: playerId});
      dispatch(showSnackbar(trans('common.apiSuccess')));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
       console.log('deleteBoardMember!', err); // eslint-disable-line
    });
}
