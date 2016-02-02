import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { calendarLoaded } from './calendar.js';

function playersLoaded(data) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: data
  };
}
function clubsLoaded(data) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: data
  };
}
function teamsLoaded(data) {
  return {
    type: ActionTypes.TEAMS_LOADED,
    payload: data
  };
}
function initialLoadCompleted() {
  return {
    type: ActionTypes.INITIAL_LOADED
  }
}

export default function() {
  return dispatch => {
    //dispatch(initialLoadStarted());

    function initialRequest(url, loadedAction) {
      return http.get(url)
        .then(function(data) {
          dispatch(loadedAction(data));
        }, function(err) {
          console.error(err);
        });
    }

    return Promise.all([
      initialRequest('/players', playersLoaded),
      initialRequest('/clubs', clubsLoaded),
      initialRequest('/calendar', calendarLoaded),
      initialRequest('/teams', teamsLoaded),
    ]).then(() => dispatch(initialLoadCompleted()));
  }
}