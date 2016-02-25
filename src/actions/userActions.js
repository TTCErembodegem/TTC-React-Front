import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';

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

export function logout() {
  return {
    type: ActionTypes.LOGIN_LOGOUT
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
        }
      }, function(err) {
        dispatch(logFailed(playerName));
        console.log('Login!', err); // eslint-disable-line
      });
  };
}