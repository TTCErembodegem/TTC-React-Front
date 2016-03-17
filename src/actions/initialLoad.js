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
function initialLoadCompleted() {
  return {
    type: ActionTypes.INITIAL_LOADED
  };
}

function teamsLoaded(data) {
  return {
    type: ActionTypes.TEAMS_LOADED,
    payload: data
  };
}
function loadFrenoyTeamRanking(dispatch, teamId) {
  return http.get('/teams/Ranking', {teamId})
    .then(function(data) {
      dispatch(teamsLoaded(data));

    }, function(err) {
      console.error(err); // eslint-disable-line
    });
}
function afterInitialTeamLoad(dispatch, data) {
  data.forEach(team => {
    if (!team.ranking || team.ranking.length === 0) {
      dispatch(loadFrenoyTeamRanking(dispatch, team.id));
    }
  });
}


export default function() {
  return dispatch => {
    //dispatch(initialLoadStarted());

    function initialRequest(url, loadedAction, callback) {
      return http.get(url)
        .then(function(data) {
          dispatch(loadedAction(data));
          if (callback) {
            callback(dispatch, data);
          }
        }, function(err) {
          console.error(err); // eslint-disable-line
        });
    }

    return Promise.all([
      initialRequest('/players', playersLoaded),
      initialRequest('/clubs', clubsLoaded),
      initialRequest('/matches/GetRelevantMatches', matchesLoaded),
      initialRequest('/teams', teamsLoaded, afterInitialTeamLoad),
    ]).then(() => dispatch(initialLoadCompleted()));
  };
}