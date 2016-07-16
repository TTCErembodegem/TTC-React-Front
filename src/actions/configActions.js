import * as ActionTypes from './ActionTypes.js';
// import http from '../utils/httpClient.js';
// import { util as storeUtil } from '../store.js';

export function clearSnackbar() {
  return {
    type: ActionTypes.CLEAR_SNACKBAR,
    payload: null
  };
}

export function showSnackbar(msg) {
  return {
    type: ActionTypes.SHOW_SNACKBAR,
    payload: msg
  };
}

export function setSetting(key, value) {
  return {
    type: ActionTypes.SET_SETTING,
    payload: {key, value}
  };
}

export function matchesForTeamLoaded(teamId) {
  return {
    type: ActionTypes.MATCHES_FOR_TEAM_LOADED,
    payload: teamId
  };
}