import Immutable from 'immutable';
import * as immutableHelpers from './immutableHelpers.js';
import * as ActionTypes from '../actions/ActionTypes.js';
import { browserHistory } from 'react-router';

import UserModel from '../models/UserModel.js';
import store from '../store.js';

var startState = new UserModel({
  playerId: 0,
  teams: Immutable.List([]),
  security: Immutable.List([])
});

// Security: ['CAN_MANAGETEAM']

export default function user(state = startState, action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.LOGIN_SUCCESS:
    //console.log('eh', store.getState().router);

    //browserHistory.push('/spelers');
    return new UserModel(payload);
  case ActionTypes.LOGIN_FAIL:
    return startState;
  default:
    return state;
  }
}