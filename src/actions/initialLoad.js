import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { loaded as matchesLoaded } from './matchActions.js';
import { loaded as playersLoaded } from './playerActions.js';

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
  };
}

export default function() {
  return dispatch => {
    //dispatch(initialLoadStarted());

    function initialRequest(url, loadedAction) {
      return http.get(url)
        .then(function(data) {
          dispatch(loadedAction(data));
        }, function(err) {
          console.error(err); // eslint-disable-line
        });
    }

    // TODO: Performance: Load logged in user matches and today matches in initial load? (measure...)
    // TODO: dispatch immediately to get the next VTTL/Sporta match of the logged in user (if not yet loaded)
    return Promise.all([
      initialRequest('/players', playersLoaded),
      initialRequest('/clubs', clubsLoaded),
      initialRequest('/matches/GetRelevantMatches', matchesLoaded),
      initialRequest('/teams', teamsLoaded),
    ]).then(() => dispatch(initialLoadCompleted()));
  };
}