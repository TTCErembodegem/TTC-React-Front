import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
//import store from '../store.js';

export function loaded(data) {
  return {
    type: ActionTypes.CALENDAR_LOADED,
    payload: data
  };
}

// export function selectPlayer(matchId, playerId) {
//   return {
//     type: ActionTypes.CALENDAR_PLAYER_SELECT,
//     payload: {
//       matchId,
//       playerId
//     }
//   };
// }

function selectedPlayer(data) {
  return {
    type: ActionTypes.CALENDAR_PLAYER_SELECT,
    payload: {
      data
    }
  };
}

export function selectPlayer(matchId, playerId) {
  return (dispatch, getState) => {
    //dispatch(initialLoadStarted());

    //console.log('selectPlayer', getState());

    //return new Promise((resolve, reject) => {
    return http.post('/calendar/SelectMatchPlayer', {matchId, playerId})
        .then(function(data) {
          dispatch(selectedPlayer(data));

        }, function(err) {
          console.log('erreur!', err); // eslint-disable-line
        });
    //});

    // hehe... see git history for the 'simple' version :p

    // function initialRequest(url, loadedAction) {
    //   return http.get(url)
    //     .then(function(data) {
    //       dispatch(loadedAction(data));
    //     }, function(err) {
    //       console.error(err); // eslint-disable-line
    //     });
    // }

    // return Promise.all([
    //   initialRequest('/players', playersLoaded),
    //   initialRequest('/clubs', clubsLoaded),
    //   initialRequest('/calendar', calendarLoaded),
    //   initialRequest('/teams', teamsLoaded),
    // ]).then(() => dispatch(initialLoadCompleted()));
  };
}