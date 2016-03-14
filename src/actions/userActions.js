import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import initialLoad from './initialLoad.js';

import trans from '../locales.js';

function loggedIn(user) {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    payload: user
  };
}

function logFailed(playerName) {
  return {
    type: ActionTypes.LOGIN_FAIL,
    payload: trans('login.fail', playerName)
  };
}

function passwordChanged(playerName) {
  return {
    type: ActionTypes.PASSWORD_CHANGE_SUCCESS,
    payload: trans('changePassword.success', playerName)
  };
}

function passwordChangedFailed(playerName) {
  return {
    type: ActionTypes.PASSWORD_CHANGE_FAIL,
    payload: trans('changePassword.fail', playerName)
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
          dispatch(loggedIn(data));
        }
      }, function(err) {
        dispatch(logFailed('John Doe'));
        console.log('ValidateToken!', err); // eslint-disable-line
      });
  };
}

export function login(creds) {
  var player = storeUtil.getPlayer(creds.playerId);
  var playerName = player ? player.alias : 'John Doe';

  return dispatch => {
    return http.post('/users/Login', creds)
      .then(function(data) {
        if (!data) {
          dispatch(logFailed(playerName));
        } else {
          dispatch(loggedIn(data));
          dispatch(initialLoad());
        }
      }, function(err) {
        dispatch(logFailed(playerName));
        console.log('Login!', err); // eslint-disable-line
      });
  };
}

export function changePassword(creds) {
  var player = storeUtil.getPlayer(creds.playerId);
  var playerName = player ? player.alias : 'John Doe';

  return dispatch => {
    return http.post('/users/ChangePassword', creds)
      .then(function(data) {
        if (!data) {
          dispatch(passwordChangedFailed(playerName));
        } else {
          dispatch(passwordChanged(playerName));
          dispatch(initialLoad());
        }
      }, function(err) {
        dispatch(passwordChangedFailed(playerName));
        console.log('ChangePassword!', err); // eslint-disable-line
      });
  };
}
