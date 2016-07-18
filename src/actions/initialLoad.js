import Promise from 'bluebird';
import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { simpleLoaded, loaded as matchesLoaded } from './matchActions.js';
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

function fetchData(url, loadedAction) {
  return dispatch => {
    http.get(url)
      .then(function(data) {
        if (loadedAction && data) {
          dispatch(loadedAction(data));
        }
      }, function(err) {
        console.error(err); // eslint-disable-line
      });
  };
}
export function fetchPlayer(playerId) {
  return fetchData('/players/' + playerId, playersLoaded);
}
export function fetchMatch(matchId) {
  return fetchData('/matches/' + matchId, simpleLoaded);
}
export function fetchTeam(teamId) {
  return fetchData('/teams/' + teamId, teamsLoaded);
}
export function fetchClub(clubId) {
  return fetchData('/clubs/' + clubId, clubsLoaded); // TODO: not implemented on backend
}

export default function() {
  return dispatch => {
    //dispatch(initialLoadStarted());

    function initialRequest(url, loadedAction, callback) {
      return http.get(url)
        .then(function(data) {
          if (loadedAction && data) {
            dispatch(loadedAction(data));
          }
          if (callback && data) {
            return callback(data, dispatch);
          }
          return null;
        }, function(err) {
          console.error(err); // eslint-disable-line
        });
    }

    function afterInitialTeamLoadCallback(data) {
      var p = Promise.resolve();
      data.forEach(team => {
        if (!team.ranking || team.ranking.length === 0) {
          p = p.then(function() {
            return http.get('/teams/Ranking', {teamId: team.id})
              .then(function(newTeam) {
                dispatch(teamsLoaded(newTeam));
                return null;
              }, function(err) {
                console.error(err); // eslint-disable-line
              });
            });
        }
      });
      return p;
    }

    return Promise.all([
      initialRequest('/players', playersLoaded),
      initialRequest('/clubs', clubsLoaded),
      initialRequest('/matches/GetRelevantMatches', null, matchesLoaded),
      initialRequest('/teams', teamsLoaded/*, afterInitialTeamLoadCallback*/),
    ]).then(() => dispatch(initialLoadCompleted()));
    // TODO: na de eerste 4 is initial load complete... dan pas de rest van de syncs, getReturnMatch etc beginnen aan te roepen!!!
  };
}