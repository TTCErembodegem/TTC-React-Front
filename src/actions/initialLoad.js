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
  return fetchData('/clubs/' + clubId, clubsLoaded); // TODO: not implemented on backend (required by SignalR once we update a club)
}

export default function() {
  function initialRequest(dispatch, url, loadedAction) {
    return http.get(url)
      .then(function(data) {
        if (loadedAction && data) {
          dispatch(loadedAction(data));
        }
        return data;
      }, function(err) {
        console.error(err); // eslint-disable-line
      });
  }

  function loadTeamRankings(data, dispatch) {
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

  return dispatch => {
    return Promise.all([
      initialRequest(dispatch, '/matches', null),
      initialRequest(dispatch, '/teams', teamsLoaded),
      initialRequest(dispatch, '/players', playersLoaded),
      initialRequest(dispatch, '/clubs', clubsLoaded),
    ])
    .then(initialLoad => {
      console.info('initialLoadCompleted');
      dispatch(initialLoadCompleted());
      return initialLoad;
    })
    .then(initialLoad => {
      var p = Promise.resolve();

      const matches = initialLoad[0];
      p = p.then(() => matchesLoaded(matches, dispatch));

      const teams = initialLoad[1];
      p = p.then(() => loadTeamRankings(teams, dispatch));

      return p;
    })
    .then(() => console.info('secundary load completed'))
    .catch(err => console.error('initial load failed', err));
  };
}