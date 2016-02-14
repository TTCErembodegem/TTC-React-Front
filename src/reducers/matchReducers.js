import Immutable from 'immutable';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    var result = payload.map(x => new MatchModel(x));
    console.log('MATCHES_LOADED', result[0]); // eslint-disable-line
    return Immutable.List(result);

  case ActionTypes.MATCHES_UPDATE:
    //let newMatch = new MatchModel(Object.assign({}, match, {players: [matchPlayer]}));
    //dispatch(togglePlayerSelection(newMatch));

    var match = payload;
    var newState = state.update(state.findIndex(function(m) {
      return m === match.matchId;
    }), function() {
      return new MatchModel(match);
    });
    //console.log('new', newState.toJSON());
    return newState;

  default:
    return state;
  }
}