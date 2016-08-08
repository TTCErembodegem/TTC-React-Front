import { createStore, applyMiddleware, compose } from 'redux';
import { devTools } from 'redux-devtools';
//import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

var finalCreateStore;
if (DEBUG) {
  //console.error('finalCreateStore DEBUG');
  finalCreateStore = compose(
    //applyMiddleware(createLogger({collapsed: true})),
    applyMiddleware(thunk),
    devTools(),
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
      //return matches.filter(cal => cal.date.isAfter(moment(), 'd')).take(4);
      return matches.filter(cal => cal.scoreType === 'BeingPlayed');
    },
    getFromOpponent(opponent) {
      const matches = store.getState().readonlyMatches;
      var result = matches.filter(m => (m.home.clubId === opponent.clubId && m.home.teamCode === opponent.teamCode) ||
          (m.away.clubId === opponent.clubId && m.away.teamCode === opponent.teamCode));

      // TODO: this would become much easier if the backend returned a DivisionId with a match?
      // Probably a good idea to store DivisionId in match table? Also add 'competition' to match

      return result;
    },

    getAllMatches() {
      return store.getState().matches;
    },

    getFormation(match) {
      var opponent = match.opponent;
      const matches = store.getState().readonlyMatches;

      // TODO: does not filter on "season" nor on competition
      var resultHome = matches.filter(m => m.home.clubId === opponent.clubId && m.home.teamCode === opponent.teamCode);
      var resultAway = matches.filter(m => m.away.clubId === opponent.clubId && m.away.teamCode === opponent.teamCode);

      var opponentPlayers = resultHome.map(m => m.players).flatten().filter(m => m.home);
      opponentPlayers = opponentPlayers.concat(resultAway.map(m => m.players).flatten().filter(m => !m.home));

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

      var matchesPerPlayer = match.getTeam().getTeamPlayerCount();
      return Object.values(result).map(ply => Object.assign(ply, {lost: (matchesPerPlayer * ply.count) - ply.won}));
    }
  },
};