import Immutable from 'immutable';
import * as immutableHelpers from './immutableHelpers.js';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    return immutableHelpers.merge(state, payload, x => new MatchModel(x));
  default:
    return state;
  }
}