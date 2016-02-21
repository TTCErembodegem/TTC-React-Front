import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import { devTools } from 'redux-devtools';
import { createHashHistory as createHistory } from 'history';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import routes from './routes.js';
import rootReducer from './reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  reduxReactRouter({routes, createHistory}),
  devTools(),
  //applyMiddleware(createLogger({collapsed: true}))
)(createStore);

const store = finalCreateStore(rootReducer);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;

export const util = {
  getTeam(teamId) {
    const teams = store.getState().teams;
    return teams.find(team => team.id === teamId);
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
    getFromOpponent(opponent) {
      const matches = store.getState().readonlyMatches;
      var result = matches.filter(m => (m.home.clubId === opponent.clubId && m.home.teamCode === opponent.teamCode) ||
          (m.away.clubId === opponent.clubId && m.away.teamCode === opponent.teamCode));

      return result;
    }
  },
};