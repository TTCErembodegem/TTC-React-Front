import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { loaded as matchesLoaded } from './matchActions.js';
import { loaded as playersLoaded } from './playerActions.js';

export function clubsLoaded(data) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: data
  };
}

export function teamsLoaded(data) {
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

    function initialRequest(url, loadedAction, callback) {
      return http.get(url)
        .then(function(data) {
          if (loadedAction) {
            dispatch(loadedAction(data));
          }
          if (callback) {
            callback(data, dispatch);
          }
        }, function(err) {
          console.error(err); // eslint-disable-line
        });
    }

    function afterInitialTeamLoadCallback(data) {
      data.forEach(team => {
        if (!team.ranking || team.ranking.length === 0) {
          http.get('/teams/Ranking', {teamId: team.id})
            .then(function(newTeam) {
              dispatch(teamsLoaded(newTeam));
            }, function(err) {
              console.error(err); // eslint-disable-line
            });
        }
      });
    }

    return Promise.all([
      initialRequest('/players', playersLoaded),
      initialRequest('/clubs', clubsLoaded),
      initialRequest('/matches/GetRelevantMatches', null, matchesLoaded),
      initialRequest('/teams', teamsLoaded, afterInitialTeamLoadCallback),
    ]).then(() => dispatch(initialLoadCompleted()));
  };
}