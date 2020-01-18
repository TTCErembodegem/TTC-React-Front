import ActionTypes from './ActionTypes';
import http from '../utils/httpClient';
import storeUtil from '../storeUtil';
import initialLoad from './initialLoad';
import {showSnackbar} from './configActions';
import {broadcastSnackbar} from '../hub';

import trans from '../locales';

function loggedIn(user, redirect = true) {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    payload: {user, redirect},
  };
}

function logFailed(playerName) {
  return {
    type: ActionTypes.LOGIN_FAIL,
    payload: trans('login.fail', playerName),
  };
}

export function logout() {
  return {
    type: ActionTypes.LOGIN_LOGOUT,
  };
}

export function validateToken(token) {
  return dispatch => http.post('/users/ValidateToken', {token})
    .then(data => {
      if (data) {
        dispatch(loggedIn(data, false));
        broadcastSnackbar(trans('login.loggedIn', data.alias));
      }
    }, err => {
      dispatch(logFailed('John Doe'));
        console.log('ValidateToken!', err); // eslint-disable-line
    });
}

export function uploadPlayer(imageBase64, playerId, type) {
  return dispatch => http.uploadImage(imageBase64, playerId, type)
    .then(() => {
      dispatch(showSnackbar(trans('common.apiSuccess')));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('player-image Upload!', err); // eslint-disable-line
    });
}

export function requestResetPasswordLink({playerId, email}) {
  return dispatch => http.post('/users/requestResetPasswordLink', {playerId, email})
    .then(() => {
      dispatch(showSnackbar(trans('password.fogotMailSent')));
      window.history.back();
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
       console.log('requestResetPasswordLink!', err); // eslint-disable-line
    });
}
export function setNewPasswordFromGuid({guid, playerId, password}) {
  return dispatch => http.post('/users/SetNewPasswordFromGuid', {guid, playerId, password})
    .then(() => {
      dispatch(showSnackbar(trans('common.apiSuccess')));
      dispatch(login({playerId, password}, false));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
       console.log('setNewPasswordFromGuid!', err); // eslint-disable-line
    });
}

export function adminSetNewPassword({playerId, newPassword}) {
  const plyId = typeof playerId === 'string' ? -1 : playerId;
  return dispatch => http.post('/users/AdminSetNewPassword', {plyId, newPassword})
    .then(() => {
      dispatch(showSnackbar(trans('common.apiSuccess')));
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
       console.log('adminSetNewPassword!', err); // eslint-disable-line
    });
}

export function login(credentials, redirect = true) {
  const creds = {...credentials};
  let playerName;
  if (typeof creds.playerId === 'number') {
    const player = storeUtil.getPlayer(creds.playerId);
    playerName = player ? player.alias : 'John Doe';

  } else {
    creds.playerId = -1;
    playerName = trans('systemUserAlias');
  }

  return dispatch => http.post('/users/Login', creds)
    .then(data => {
      if (!data) {
        dispatch(logFailed(playerName));
      } else {
        dispatch(loggedIn(data, redirect));
        broadcastSnackbar(trans('login.loggedIn', data.alias));
        dispatch(initialLoad());
      }
    }, err => {
      dispatch(logFailed(playerName));
        console.log('Login!', err); // eslint-disable-line
    });
}

export function changePassword(playerId, creds) {
  return dispatch => http.post('/users/ChangePassword', {...creds, playerId})
    .then(data => {
      if (!data) {
        dispatch(showSnackbar(trans('password.passwordChangedFail')));
      } else {
        dispatch(showSnackbar(trans('password.passwordChangedSuccess')));
        dispatch(loggedIn(data));
      }
    }, err => {
      dispatch(showSnackbar(trans('common.apiFail')));
        console.log('ChangePassword!', err); // eslint-disable-line
    });
}
