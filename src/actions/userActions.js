import { browserHistory } from 'react-router';
import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import initialLoad from './initialLoad.js';
import { showSnackbar } from './configActions.js';
import { broadcastSnackbar } from '../hub.js';

import trans from '../locales.js';

function loggedIn(user, redirect = true) {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    payload: {user, redirect}
  };
}

function logFailed(playerName) {
  return {
    type: ActionTypes.LOGIN_FAIL,
    payload: trans('login.fail', playerName)
  };
}

export function logout() {
  return {
    type: ActionTypes.LOGIN_LOGOUT
  };
}

export function validateToken(token) {
  return dispatch => {
    return http.post('/users/ValidateToken', {token})
      .then(function(data) {
        if (data) {
          dispatch(loggedIn(data, false));
          broadcastSnackbar(trans('login.loggedIn', data.alias));
        }
      }, function(err) {
        dispatch(logFailed('John Doe'));
        console.log('ValidateToken!', err); // eslint-disable-line
      });
  };
}

export function uploadPlayer(imageBase64, playerId, type) {
  return dispatch => {
    return http.uploadImage(imageBase64, playerId, type)
      .then(function() {
        dispatch(showSnackbar(trans('common.apiSuccess')));
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('player-image Upload!', err); // eslint-disable-line
      });
  };
}

export function requestNewPassword({playerId, email}) {
  return dispatch => {
    return http.post('/users/RequestNewPassword', {playerId, email})
      .then(function(data) {
        dispatch(showSnackbar(trans('password.fogotMailSent')));
        window.history.back();
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
       console.log('requestNewPassword!', err); // eslint-disable-line
      });
  };
}

export function login(credentials) {
  var creds = Object.assign({}, credentials);
  var playerName;
  if (typeof creds.playerId === 'number') {
    const player = storeUtil.getPlayer(creds.playerId);
    playerName = player ? player.alias : 'John Doe';

  } else {
    creds.playerId = -1;
    playerName = trans('systemUserAlias');
  }

  return dispatch => {
    return http.post('/users/Login', creds)
      .then(function(data) {
        if (!data) {
          dispatch(logFailed(playerName));
        } else {
          dispatch(loggedIn(data));
          broadcastSnackbar(trans('login.loggedIn', data.alias));
          dispatch(initialLoad());
        }
      }, function(err) {
        dispatch(logFailed(playerName));
        console.log('Login!', err); // eslint-disable-line
      });
  };
}

export function changePassword(playerId, creds) {
  return dispatch => {
    return http.post('/users/ChangePassword', {...creds, playerId})
      .then(function(data) {
        if (!data) {
          dispatch(showSnackbar(trans('password.passwordChangedFail')));
        } else {
          dispatch(showSnackbar(trans('password.passwordChangedSuccess')));
          dispatch(loggedIn(data));
        }
      }, function(err) {
        dispatch(showSnackbar(trans('common.apiFail')));
        console.log('ChangePassword!', err); // eslint-disable-line
      });
  };
}