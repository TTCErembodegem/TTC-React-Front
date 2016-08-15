import { createStore, applyMiddleware, compose } from 'redux';
//import { devTools } from 'redux-devtools';
//import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

var finalCreateStore;
if (DEBUG) {
  //console.error('finalCreateStore DEBUG');
  finalCreateStore = compose(
    //applyMiddleware(createLogger({collapsed: true})),
    applyMiddleware(thunk),
    //devTools(),
  )(createStore);
} else {
  //console.error('finalCreateStore NODEBUG');
  finalCreateStore = compose(
    applyMiddleware(thunk),
  )(createStore);
}

const store = finalCreateStore(rootReducer);

if (module.hot) {
  //console.error('finalCreateStore is HOT');
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;

function getOpponentMatches(match) {
  const opponent = match.opponent;
  const matches = store.getState().readonlyMatches
    .filter(x => x.competition === match.competition && x.frenoyDivisionId === match.frenoyDivisionId);

  return {
    home: matches.filter(m => m.home.clubId === opponent.clubId && m.home.teamCode === opponent.teamCode),
    away: matches.filter(m => m.away.clubId === opponent.clubId && m.away.teamCode === opponent.teamCode)
  };
}

export const util = {
  getConfig() {
    return store.getState().config;
  },
  getUser() {
    return store.getState().user;
  },
  getUserPlayer() {
    return util.getPlayer(util.getUser().playerId);
  },

  getTeam(teamId) {
    const teams = store.getState().teams;
    return teams.find(team => team.id === teamId);
  },
  getTeams() {
    return store.getState().teams;
  },

  getClub(clubId) {
    const clubs = store.getState().clubs;
    return clubs.find(club => club.id === clubId);
  },

  getPlayer(playerId) {
    const players = store.getState().players;
    return players.find(ply => ply.id === playerId);
  },

  getMatch(matchId) {
    const matches = store.getState().matches;
    return matches.find(match => match.id === matchId);
  },

  matches: {
    getTodayMatches() {
      const matches = store.getState().matches;
      //return matches.filter(cal => cal.date.isAfter(require('moment')(), 'd')).take(4);
      return matches.filter(cal => cal.scoreType === 'BeingPlayed');
    },
    getFromOpponent(match) {
      const result = getOpponentMatches(match);
      return result.away.concat(result.home);
    },

    getAllMatches() {
      return store.getState().matches;
    },

    getFormation(match) {
      const matches = getOpponentMatches(match);
      var opponentPlayers = matches.home.map(m => m.players).flatten().filter(m => m.home);
      opponentPlayers = opponentPlayers.concat(matches.away.map(m => m.players).flatten().filter(m => !m.home));

      // TODO: this assumes that if you forfeited, you lost that match (ply has won but not lost property)
      // could be calculated more correctly by looking at the individual match results
      var result = {};
      opponentPlayers.forEach(ply => {
        if (result[ply.uniqueIndex]) {
          result[ply.uniqueIndex].count++;
          result[ply.uniqueIndex].won += +ply.won || 0;

        } else {
          result[ply.uniqueIndex] = {
            player: ply,
            count: 1,
            won: +ply.won || 0,
          };
        }
      });

      const matchesPerPlayer = match.getTeam().getTeamPlayerCount();
      return Object.values(result).map(ply => Object.assign(ply, {lost: (matchesPerPlayer * ply.count) - ply.won}));
    }
  },
};