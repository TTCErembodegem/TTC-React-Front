import Immutable from 'immutable';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

function replaceMatch(state, match) {
  var toReplaceIndex = state.findIndex(m => m.id === match.id);
  if (toReplaceIndex === -1) {
    return state.push(new MatchModel(match));
  } else {
    return state.update(toReplaceIndex, () => new MatchModel(match));
  }
}

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    if (state.size === 0) {
      let result = payload.map(x => new MatchModel(x));
      return Immutable.List(result);

    } else if (payload instanceof Array) {
      //console.log('MATCHES_LOADED BEGIN', state.toArray());
      let newState = state;
      for (let i = 0; i < payload.length; i++) {
        newState = replaceMatch(newState, payload[i]);
      }
      console.log('MATCHES_LOADED END', newState.toArray());
      return newState;

    } else {
      let match = payload;
      return replaceMatch(state, match);
    }
  default:
    return state;
  }
}