import Immutable from 'immutable';
import * as immutableHelpers from './immutableHelpers.js';

import ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
    case ActionTypes.MATCHES_LOADED:
      return immutableHelpers.merge(state, payload, x => new MatchModel(x), x => x.shouldBePlayed);
    default:
      return state;
  }
}

// readonlyMatches reducer is in ./reducers.js
